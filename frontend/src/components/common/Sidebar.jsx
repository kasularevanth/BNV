import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Images, Upload, ShoppingCart, User, Zap, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mockups', icon: Images, label: 'Recent Mockups' },
  { to: '/mockups/upload', icon: Upload, label: 'Upload', designerOnly: true },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { isDesigner } = useAuth();

  // Close on ESC key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const SidebarContent = () => (
    <aside className="w-[220px] h-full bg-white border-r border-gray-100 flex flex-col py-5">
      {/* Logo + close on mobile */}
      <div className="px-4 mb-7 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">BNV Studio</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, designerOnly }) => {
          if (designerOnly && !isDesigner) return null;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 pt-4 border-t border-gray-100 mt-4">
        <p className="text-xs text-gray-400 text-center">BNV © {new Date().getFullYear()}</p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <div className="hidden md:flex flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile overlay drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer slides in from left */}
          <div className="absolute left-0 top-0 h-full">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
