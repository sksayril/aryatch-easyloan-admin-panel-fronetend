import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FolderTree,
  Banknote,
  TrendingUp,
  Settings2,
  LogOut,
  User,
  Menu,
  X,
  Flag,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'dashboard' | 'categories' | 'loans' | 'commodity-prices' | 'india-apply-now' | 'ads-settings' | 'app-settings';
  onNavigate: (page: 'dashboard' | 'categories' | 'loans' | 'commodity-prices' | 'india-apply-now' | 'ads-settings' | 'app-settings') => void;
}

const Layout = ({ children, currentPage, onNavigate }: LayoutProps) => {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitles: Record<LayoutProps['currentPage'], string> = {
    dashboard: 'Dashboard',
    categories: 'Categories',
    loans: 'Loans',
    'commodity-prices': 'Commodity Prices',
    'india-apply-now': 'India Apply Now',
    'ads-settings': 'Ads Settings',
    'app-settings': 'App Settings',
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'loans', label: 'Loans', icon: Banknote },
    { id: 'commodity-prices', label: 'Commodity Prices', icon: TrendingUp },
    { id: 'india-apply-now', label: 'India Apply Now', icon: Flag },
    { id: 'ads-settings', label: 'Ads Settings', icon: Settings2 },
    { id: 'app-settings', label: 'App Settings', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 bg-cyan-300/30 blur-3xl rounded-full"></div>
      <div className="pointer-events-none absolute top-1/3 -left-20 w-72 h-72 bg-violet-300/20 blur-3xl rounded-full"></div>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-950 via-purple-900 to-fuchsia-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white leading-tight">EasyLoan Admin</h1>
                  <p className="text-xs text-slate-300">Control panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg border-cyan-400/30'
                      : 'text-gray-300 border-transparent hover:bg-slate-700/70 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700/80">
            <div className="bg-slate-700/90 rounded-xl p-4 mb-3 border border-slate-600/70">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{admin?.username}</p>
                  <p className="text-gray-400 text-sm truncate">{admin?.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800">{pageTitles[currentPage]}</h2>
            <div className="w-6 lg:hidden"></div>
          </div>
        </header>

        <main className="p-6 relative z-10">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
