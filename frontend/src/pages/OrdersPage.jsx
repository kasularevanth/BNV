import { useState, useCallback } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';
import { getOrders, updateOrderStatus } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import usePolling from '../hooks/usePolling';

const STATUS_FILTERS = ['all', 'pending', 'active', 'completed', 'cancelled'];
const NEXT_STATUS = { pending: 'active', active: 'completed' };

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
      // silently fail
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
        <div className="mb-5">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isDesigner ? 'Manage orders for your mockups' : 'Track your placed orders'}
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium capitalize whitespace-nowrap transition flex-shrink-0 ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">No orders found.</p>
          </div>
        ) : (
          <>
            {/* Mobile: Card layout */}
            <div className="flex flex-col gap-3 md:hidden">
              {orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  isDesigner={isDesigner}
                  onStatusUpdate={handleStatusUpdate}
                  updating={updating === order._id}
                />
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Mockup', isDesigner ? 'Client' : 'Date', 'Qty', 'Total', 'Status'].map((h) => (
                        <th
                          key={h}
                          className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                      {isDesigner && (
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Action
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

/** Mobile card for a single order */
const OrderCard = ({ order, isDesigner, onStatusUpdate, updating }) => {
  const mockup = order.mockupId;
  const client = order.clientId;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {/* Top row: image + title + price */}
      <div className="flex items-start gap-3 mb-3">
        {mockup?.imageUrl && (
          <img
            src={mockup.imageUrl}
            alt={mockup.name}
            className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {mockup?.name || 'Deleted Mockup'}
          </p>
          {mockup?.category && (
            <p className="text-xs text-gray-400 mt-0.5">{mockup.category}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <span className="font-bold text-gray-900 text-sm flex-shrink-0">
          ${Number(order.totalPrice).toFixed(2)}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
        <div className="flex items-center gap-3">
          <span>Qty: <span className="font-semibold text-gray-700">{order.quantity}</span></span>
          {isDesigner ? (
            <span>Client: <span className="font-semibold text-gray-700">{client?.name || '—'}</span></span>
          ) : (
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          )}
        </div>
        {isDesigner && NEXT_STATUS[order.status] && (
          <button
            onClick={() => onStatusUpdate(order._id, NEXT_STATUS[order.status])}
            disabled={updating}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition disabled:opacity-50 capitalize"
          >
            {updating ? '...' : `Mark ${NEXT_STATUS[order.status]}`}
          </button>
        )}
      </div>
    </div>
  );
};

/** Desktop table row */
const OrderRow = ({ order, isDesigner, onStatusUpdate, updating }) => {
  const mockup = order.mockupId;
  const client = order.clientId;

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {mockup?.imageUrl && (
            <img
              src={mockup.imageUrl}
              alt={mockup.name}
              className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0"
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
      <td className="px-5 py-3.5 text-gray-600 text-sm">
        {isDesigner
          ? client?.name || '—'
          : new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-5 py-3.5 text-gray-700 font-medium">{order.quantity}</td>
      <td className="px-5 py-3.5 font-semibold text-gray-900">
        ${Number(order.totalPrice).toFixed(2)}
      </td>
      <td className="px-5 py-3.5">
        <OrderStatusBadge status={order.status} />
      </td>
      {isDesigner && (
        <td className="px-5 py-3.5">
          {NEXT_STATUS[order.status] ? (
            <button
              onClick={() => onStatusUpdate(order._id, NEXT_STATUS[order.status])}
              disabled={updating}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition disabled:opacity-50 capitalize"
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
