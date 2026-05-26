import { Home, Scan, Calendar, ShoppingBag, TrendingUp, User } from 'lucide-react';

type Tab = 'home' | 'scan' | 'routine' | 'products' | 'progress' | 'profile';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scan', label: 'Scan', icon: Scan },
  { id: 'routine', label: 'Routine', icon: Calendar },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-teal-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-teal-50 text-teal-600'
                    : ''
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
