import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Images, Upload, ShoppingCart, User, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/mockups', icon: Images, label: 'Recent Mockups' },
  { to: '/mockups/upload', icon: Upload, label: 'Upload', designerOnly: true },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = () => {
  const { isDesigner } = useAuth();

  return (
    <aside className="w-[180px] min-h-screen bg-white border-r border-gray-100 flex flex-col py-4 flex-shrink-0">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, designerOnly }) => {
          if (designerOnly && !isDesigner) return null;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
