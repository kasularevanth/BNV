import { useState, useCallback } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import { getOrders, updateOrderStatus } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import usePolling from '../hooks/usePolling';

const STATUS_FILTERS = ['all', 'pending', 'active', 'completed', 'cancelled'];

const OrdersPage = () => {
  const { isDesigner } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const { data } = await getOrders(params);
      setOrders(data.orders);
    } catch {
      // silently fail on polling error
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  usePolling(fetchOrders, 10000);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const { data } = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: data.order.status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isDesigner ? 'Manage orders for your mockups' : 'Track your placed orders'}
          </p>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 mb-5 overflow-x-auto scrollbar-hide">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mockup
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {isDesigner ? 'Client' : 'Date'}
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {isDesigner && (
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <OrderRow
                      key={order._id}
                      order={order}
                      isDesigner={isDesigner}
                      onStatusUpdate={handleStatusUpdate}
                      updating={updating === order._id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const NEXT_STATUS = { pending: 'active', active: 'completed' };

const OrderRow = ({ order, isDesigner, onStatusUpdate, updating }) => {
  const mockup = order.mockupId;
  const client = order.clientId;

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          {mockup?.imageUrl && (
            <img
              src={mockup.imageUrl}
              alt={mockup.name}
              className="w-9 h-9 rounded-lg object-cover border border-gray-100 flex-shrink-0"
            />
          )}
          <div>
            <p className="font-medium text-gray-800 truncate max-w-[160px]">
              {mockup?.name || 'Deleted Mockup'}
            </p>
            <p className="text-xs text-gray-400">{mockup?.category}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-3 text-gray-600">
        {isDesigner
          ? <span className="text-sm">{client?.name || '—'}</span>
          : <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
        }
      </td>

      <td className="px-5 py-3 text-gray-700 font-medium">{order.quantity}</td>

      <td className="px-5 py-3 font-semibold text-gray-900">
        ${Number(order.totalPrice).toFixed(2)}
      </td>

      <td className="px-5 py-3">
        <OrderStatusBadge status={order.status} />
      </td>

      {isDesigner && (
        <td className="px-5 py-3">
          {NEXT_STATUS[order.status] ? (
            <button
              onClick={() => onStatusUpdate(order._id, NEXT_STATUS[order.status])}
              disabled={updating}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition disabled:opacity-50 capitalize"
            >
              {updating ? '...' : `Mark ${NEXT_STATUS[order.status]}`}
            </button>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </td>
      )}
    </tr>
  );
};

export default OrdersPage;
