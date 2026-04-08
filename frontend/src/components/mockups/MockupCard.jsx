import { Pencil, Trash2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BADGE_STYLES = {
  PREMIUM: 'bg-amber-500 text-white',
  UPDATED: 'bg-blue-500 text-white',
  NEW: 'bg-indigo-600 text-white',
};

const MockupCard = ({ mockup, onEdit, onDelete, onOrder }) => {
  const { isDesigner, isClient } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={mockup.imageUrl}
          alt={mockup.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {mockup.badge && (
          <span
            className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider ${
              BADGE_STYLES[mockup.badge] || 'bg-gray-700 text-white'
            }`}
          >
            {mockup.badge}
          </span>
        )}
        {/* Category chip */}
        {mockup.category && (
          <span className="absolute bottom-2 right-2 text-xs bg-white/90 text-gray-600 px-2 py-0.5 rounded-lg font-medium">
            {mockup.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2 flex-1">
            {mockup.name}
          </h3>
          <span className="text-sm font-bold text-indigo-600 whitespace-nowrap flex-shrink-0">
            ${Number(mockup.price).toFixed(2)}
          </span>
        </div>
        {mockup.description && (
          <p className="text-xs text-gray-400 line-clamp-2 hidden sm:block">{mockup.description}</p>
        )}

        {/* Designer actions */}
        {isDesigner && (
          <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
            <button
              onClick={() => onEdit?.(mockup)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => onDelete?.(mockup)}
              className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Client action */}
        {isClient && (
          <button
            onClick={() => onOrder?.(mockup)}
            className="mt-auto flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition"
          >
            <ShoppingCart className="w-3 h-3" />
            Place Order
          </button>
        )}
      </div>
    </div>
  );
};

export default MockupCard;
