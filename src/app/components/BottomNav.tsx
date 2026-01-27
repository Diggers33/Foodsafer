import { Home, Users, BookOpen, MapPin } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'workspaces', label: 'Workspaces', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'network', label: 'Network', icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full min-w-[44px] relative"
            >
              <Icon
                className={`w-6 h-6 mb-1 ${
                  isActive ? 'text-[#2E7D32]' : 'text-[#757575]'
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-[#2E7D32]' : 'text-[#757575]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && tab.id === 'home' && (
                <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}