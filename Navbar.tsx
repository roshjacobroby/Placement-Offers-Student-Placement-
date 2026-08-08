import React from 'react';
import { Building2, Calendar, BarChart3, Network, RefreshCw, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'companies' | 'drives' | 'reports' | 'er-diagram' | 'acceptance-test';
  setActiveTab: (tab: 'dashboard' | 'companies' | 'drives' | 'reports' | 'er-diagram' | 'acceptance-test') => void;
  onResetDemo: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  isResetting,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'companies', label: 'Companies (Master)', icon: Building2 },
    { id: 'drives', label: 'Placement Drives', icon: Calendar },
    { id: 'reports', label: 'Reports & Insights', icon: BarChart3 },
    { id: 'er-diagram', label: 'ER Diagram', icon: Network },
    { id: 'acceptance-test', label: 'Acceptance Test', icon: CheckCircle2 },
  ] as const;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white font-bold text-xl shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                Placement Drive System
              </span>
              <span className="text-xs text-indigo-400 font-medium tracking-wide uppercase">
                V05 Master Architecture
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Reset Demo Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onResetDemo}
              disabled={isResetting}
              title="Reset database to default hackathon demo state"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
