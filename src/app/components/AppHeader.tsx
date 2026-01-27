import { Search, Bell } from 'lucide-react';
import logoImage from '@/assets/ad1500f1c0a7d330374c8347ab5c29fbc9f7deb9.png';
import { useApp } from '../App';

interface AppHeaderProps {
  onProfileClick: () => void;
  notificationCount?: number;
}

export function AppHeader({ onProfileClick, notificationCount = 0 }: AppHeaderProps) {
  const { currentUser } = useApp();

  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
    : 'User';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-14">
        <img src={logoImage} alt="FoodSafer" className="h-8" />
        <div className="flex items-center gap-4">
          <button className="relative">
            <Search className="w-6 h-6 text-[#757575]" />
          </button>
          <button className="relative">
            <Bell className="w-6 h-6 text-[#757575]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D32F2F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button
            onClick={onProfileClick}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-[#2E7D32] transition-colors"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-xs font-semibold">
                {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
