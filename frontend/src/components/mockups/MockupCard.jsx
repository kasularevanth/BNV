import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BADGE_STYLES = {
  PREMIUM: 'bg-amber-500 text-white',
  UPDATED: 'bg-blue-500 text-white',
  NEW: 'bg-indigo-600 text-white',
};

const MockupCard = ({ mockup, onEdit, onDelete, onOrder }) => {
  const { isDesigner, isClient } = useAuth();

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={mockup.imageUrl}
          alt={mockup.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {mockup.badge && (
          <span
            className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
              BADGE_STYLES[mockup.badge] || 'bg-gray-700 text-white'
            }`}
          >
            {mockup.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{mockup.name}</h3>
          <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">
            ${Number(mockup.price).toFixed(2)}
          </span>
        </div>
        {mockup.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{mockup.description}</p>
        )}

        {/* Actions */}
        {isDesigner && (
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
            <button
              onClick={() => onEdit?.(mockup)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => onDelete?.(mockup)}
              className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isClient && (
          <button
            onClick={() => onOrder?.(mockup)}
            className="mt-auto py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default MockupCard;
