'use client';
import Image from 'next/image';

type Tab = 'compose' | 'schedule' | 'analytics';

interface Props {
  user: any;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  onLogout: () => void;
}

const links = [
  { id: 'compose' as Tab, label: 'Compose Post', icon: '✍️' },
  { id: 'schedule' as Tab, label: 'Schedule Queue', icon: '🗓️' },
  { id: 'analytics' as Tab, label: 'Analytics', icon: '📊' },
];

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }: Props) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">LP</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">LinkedPost Pro</p>
            <p className="text-xs text-gray-400">Content Studio</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {user?.picture ? (
            <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(link => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === link.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
            {activeTab === link.id && (
              <span className="ml-auto w-1.5 h-5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <span>🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
