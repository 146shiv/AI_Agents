import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, FileSearch, BrainCircuit, BarChart3, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Resume', icon: Upload },
  { to: '/jd-match', label: 'JD Matching', icon: FileSearch },
  { to: '/interview', label: 'Mock Interview', icon: BrainCircuit },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const logout = useStore((s) => s.logout);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <BrainCircuit className="h-7 w-7 text-brand-600" />
        <span className="text-lg font-bold text-gray-900">ResumeAI</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
