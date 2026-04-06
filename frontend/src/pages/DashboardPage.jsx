import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShoppingBag, AlertCircle, CheckCircle2, Plus, Pencil } from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/orderApi';
import { getMyMockups, getMockups } from '../api/mockupApi';
import usePolling from '../hooks/usePolling';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isDesigner } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMockups, setRecentMockups] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, mockupsRes] = await Promise.all([
        getDashboardStats(),
        isDesigner
          ? getMyMockups({ sort: 'Recently Edited' })
          : getMockups({ sort: 'Recently Edited', limit: 4 }),
      ]);
      setStats(statsRes.data.stats);
      const list = isDesigner ? mockupsRes.data.mockups : mockupsRes.data.mockups;
      setRecentMockups(list.slice(0, 4));
    } catch {
      // silently fail on polling error
    }
  }, [isDesigner]);

  usePolling(fetchData, 10000);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Performance Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track your packaging assets and supply chain status in real-time.
            </p>
          </div>
          {isDesigner && (
            <button
              onClick={() => navigate('/mockups/upload')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition"
            >
              <Plus className="w-4 h-4" />
              New Mockup
            </button>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isDesigner ? (
            <>
              <StatCard
                label="Total Mockups"
                value={stats?.totalMockups ?? '—'}
                sub="Assets"
                badge={stats ? '+12%' : null}
                badgeColor="text-green-600 bg-green-50"
              />
              <StatCard
                label="Orders Received"
                value={stats?.ordersReceived ?? '—'}
                sub="Lifetime"
                icon={ShoppingBag}
              />
              <StatCard
                label="Pending Orders"
                value={stats?.pendingOrders ?? '—'}
                sub="Action Required"
                badge={stats?.pendingOrders > 0 ? 'ACTIVE' : null}
                badgeColor="text-amber-600 bg-amber-50"
              />
              <StatCard
                label="Completed Orders"
                value={stats?.completedOrders ?? '—'}
                sub={stats ? `Success Rate ${stats.successRate}%` : 'Success Rate —'}
                icon={CheckCircle2}
              />
            </>
          ) : (
            <>
              <StatCard
                label="Total Orders"
                value={stats?.totalOrders ?? '—'}
                sub="Lifetime"
                icon={ShoppingBag}
              />
              <StatCard
                label="Pending Orders"
                value={stats?.pendingOrders ?? '—'}
                sub="Action Required"
                badge={stats?.pendingOrders > 0 ? 'ACTIVE' : null}
                badgeColor="text-amber-600 bg-amber-50"
              />
              <StatCard
                label="Completed Orders"
                value={stats?.completedOrders ?? '—'}
                sub="Done"
                icon={CheckCircle2}
              />
            </>
          )}
        </div>

        {/* Recent Mockups */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Mockups</h2>
          {recentMockups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-400 text-sm">
                {isDesigner ? 'No mockups yet. Upload your first one!' : 'No mockups available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentMockups.map((mockup) => (
                <RecentMockupCard key={mockup._id} mockup={mockup} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const RecentMockupCard = ({ mockup }) => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group">
    <div className="aspect-square bg-gray-100 overflow-hidden">
      <img
        src={mockup.imageUrl}
        alt={mockup.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-800 truncate">{mockup.name}</span>
        <Pencil className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">
        Edited {new Date(mockup.updatedAt).toLocaleDateString()}
      </p>
    </div>
  </div>
);

export default DashboardPage;
