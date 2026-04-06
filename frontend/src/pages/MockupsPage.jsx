import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown } from 'lucide-react';
import DashboardLayout from '../components/common/DashboardLayout';
import MockupCard from '../components/mockups/MockupCard';
import OrderModal from '../components/orders/OrderModal';
import EditMockupModal from '../components/mockups/EditMockupModal';
import { getMockups, getMyMockups, deleteMockup } from '../api/mockupApi';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All assets', 'Packaging', 'Bottles', 'Apparel', 'Beverage', 'Electronics'];
const SORT_OPTIONS = ['Recently Edited', 'Newest First', 'Price: Low to High', 'Price: High to Low'];

const MockupsPage = () => {
  const navigate = useNavigate();
  const { isDesigner, isClient } = useAuth();
  const [mockups, setMockups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All assets');
  const [sort, setSort] = useState('Recently Edited');
  const [search, setSearch] = useState('');
  const [orderMockup, setOrderMockup] = useState(null);
  const [editMockup, setEditMockup] = useState(null);
  const [showSortDrop, setShowSortDrop] = useState(false);

  const fetchMockups = useCallback(async () => {
    try {
      setLoading(true);
      const params = { category: category !== 'All assets' ? category : undefined, sort, search: search || undefined };
      const res = isDesigner
        ? await getMyMockups(params)
        : await getMockups(params);
      setMockups(isDesigner ? res.data.mockups : res.data.mockups);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [category, sort, search, isDesigner]);

  useEffect(() => {
    fetchMockups();
  }, [fetchMockups]);

  const handleDelete = async (mockup) => {
    if (!window.confirm(`Delete "${mockup.name}"? This cannot be undone.`)) return;
    try {
      await deleteMockup(mockup._id);
      setMockups((prev) => prev.filter((m) => m._id !== mockup._id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <DashboardLayout onSearch={setSearch}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mockups</h1>
            <p className="text-sm text-gray-500">Manage your uploaded mockups</p>
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

        {/* Filters bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition ${
                  category === cat
                    ? 'text-gray-900 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSortDrop(!showSortDrop)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Sort by: <span className="font-medium">{sort}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showSortDrop && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 min-w-[180px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setShowSortDrop(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      sort === opt ? 'text-indigo-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockups.map((mockup) => (
              <MockupCard
                key={mockup._id}
                mockup={mockup}
                onEdit={(m) => setEditMockup(m)}
                onDelete={handleDelete}
                onOrder={(m) => setOrderMockup(m)}
              />
            ))}

            {/* Create new card — designer only */}
            {isDesigner && (
              <button
                onClick={() => navigate('/mockups/upload')}
                className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 p-6 hover:border-indigo-400 hover:bg-indigo-50 transition group min-h-[200px]"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition">
                  <Plus className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Create New</span>
                <span className="text-xs text-gray-400 text-center">
                  Start with a blank canvas or import a 3D model.
                </span>
              </button>
            )}
          </div>
        )}

        {!loading && mockups.length === 0 && !isDesigner && (
          <div className="text-center py-16 text-gray-400 text-sm">No mockups found.</div>
        )}
      </div>

      {orderMockup && (
        <OrderModal mockup={orderMockup} onClose={() => setOrderMockup(null)} />
      )}

      {editMockup && (
        <EditMockupModal
          mockup={editMockup}
          onClose={() => setEditMockup(null)}
          onSaved={(updated) => {
            setMockups((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
            setEditMockup(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default MockupsPage;
