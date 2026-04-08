import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, SlidersHorizontal } from 'lucide-react';
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
  const { isDesigner } = useAuth();
  const [mockups, setMockups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All assets');
  const [sort, setSort] = useState('Recently Edited');
  const [search, setSearch] = useState('');
  const [orderMockup, setOrderMockup] = useState(null);
  const [editMockup, setEditMockup] = useState(null);
  const [showSortDrop, setShowSortDrop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchMockups = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        category: category !== 'All assets' ? category : undefined,
        sort,
        search: search || undefined,
      };
      const res = isDesigner ? await getMyMockups(params) : await getMockups(params);
      setMockups(res.data.mockups || []);
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Mockups</h1>
            <p className="text-sm text-gray-500">
              {isDesigner ? 'Manage your uploaded mockups' : 'Browse available mockups'}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((s) => !s)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            {isDesigner && (
              <button
                onClick={() => navigate('/mockups/upload')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Mockup</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        </div>

        {/* Filters bar — always visible on sm+, togglable on mobile */}
        <div className={`${showFilters ? 'flex' : 'hidden sm:flex'} flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5`}>
          {/* Category scroll */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setShowFilters(false); }}
                className={`px-3 py-1.5 text-sm font-medium rounded-xl whitespace-nowrap transition flex-shrink-0 ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowSortDrop(!showSortDrop)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition w-full sm:w-auto"
            >
              <span className="text-gray-400">Sort:</span>
              <span className="font-medium flex-1 sm:flex-none text-left">{sort}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSortDrop ? 'rotate-180' : ''}`} />
            </button>
            {showSortDrop && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-1.5 min-w-[200px]">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setShowSortDrop(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                      sort === opt ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Close sort dropdown when clicking outside */}
        {showSortDrop && (
          <div className="fixed inset-0 z-10" onClick={() => setShowSortDrop(false)} />
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
                className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-4 sm:p-6 hover:border-indigo-400 hover:bg-indigo-50 transition group min-h-[160px] sm:min-h-[200px]"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition">
                  <Plus className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Create New</span>
                <span className="text-xs text-gray-400 text-center hidden sm:block">
                  Start with a blank canvas or import a 3D model.
                </span>
              </button>
            )}
          </div>
        )}

        {!loading && mockups.length === 0 && !isDesigner && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-sm">No mockups found.</p>
          </div>
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
