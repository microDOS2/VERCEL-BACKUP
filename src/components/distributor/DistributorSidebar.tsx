import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  FileSignature,
  Settings,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/distributor-dashboard', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Orders', path: '/distributor-orders', icon: ShoppingCart },
  { label: 'Invoices', path: '/distributor-invoices', icon: FileText },
  { label: 'Agreements', path: '/distributor-agreements', icon: FileSignature },
  { label: 'Settings', path: '/distributor-settings', icon: Settings },
];

export function DistributorSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#150f24] border-r border-white/10 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-[#44f80c] font-bold text-xl">micro</span>
          <span className="text-[#9a02d0] font-bold text-xl">DOS</span>
          <span className="text-[#ff66c4] font-bold text-xl">(2)</span>
        </Link>
        <p className="text-gray-400 text-sm mt-1">Distributor Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-[#9a02d0]/20 to-[#44f80c]/20 text-white border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#44f80c]' : ''}`} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
