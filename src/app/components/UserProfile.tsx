import { useApp } from '../App';
import { Settings, Edit, LogOut, MapPin, FileText, Bookmark, Users, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';

export function UserProfile({ onBack }: { onBack?: () => void }) {
  const { currentUser, logout } = useApp();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!currentUser) return null;

  // Compute display name from firstName and lastName
  const displayName = `${currentUser.firstName} ${currentUser.lastName}`.trim();

  const stats = [
    { label: 'Posts', value: 28 },
    { label: 'Workspaces', value: 12 },
    { label: 'Connections', value: 156 },
  ];

  const menuItems = [
    { icon: Edit, label: 'Edit Profile', action: () => {} },
    { icon: FileText, label: 'My Posts', action: () => {} },
    { icon: Bookmark, label: 'Saved Items', action: () => {} },
    { icon: Users, label: 'My Connections', action: () => {} },
    { icon: MessageSquare, label: 'Language Preference', value: 'English', action: () => {} },
    { icon: Settings, label: 'Notification Settings', action: () => {} },
    { icon: Settings, label: 'Privacy Settings', action: () => {} },
    { icon: MessageSquare, label: 'Help & Support', action: () => {} },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center px-4 h-14 relative">
          {onBack && (
            <button onClick={onBack} className="absolute left-4 flex items-center">
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
          )}
          <h1 className="flex-1 text-center">Profile</h1>
          <button className="absolute right-4">
            <Settings className="w-6 h-6 text-[#757575]" />
          </button>
        </div>
      </header>

      {/* Profile Hero */}
      <div className="bg-white px-4 py-6 mb-4">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <Avatar className="w-24 h-24">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-2xl font-semibold">
                  {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                </div>
              )}
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2E7D32] rounded-full flex items-center justify-center shadow-lg">
              <Edit className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* User Info */}
          <h2 className="mb-1">{displayName}</h2>
          <p className="text-[#757575] mb-1">{currentUser.organization || 'No organization'}</p>
          <div className="flex items-center gap-1 text-sm text-[#757575] mb-4">
            <MapPin className="w-4 h-4" />
            <span>{currentUser.location || 'Location not set'}</span>
          </div>

          {/* Bio */}
          <p className="text-sm text-[#212121] max-w-md mb-4">
            {currentUser.bio || 'No bio available'}
          </p>

          {/* Tags/Skills */}
          {currentUser.skills && currentUser.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {currentUser.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-8 pt-4 border-t border-gray-200 w-full justify-center">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[#2E7D32] mb-1">{stat.value}</div>
                <div className="text-xs text-[#757575]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white px-4 py-3 mb-4">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex-col h-auto py-3 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
          >
            <Edit className="w-5 h-5 mb-1" />
            <span className="text-xs">Edit Profile</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-3 border-gray-200 hover:bg-gray-50"
          >
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs">My Posts</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-3 border-gray-200 hover:bg-gray-50"
          >
            <Bookmark className="w-5 h-5 mb-1" />
            <span className="text-xs">Saved</span>
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white mb-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#757575]" />
                <span className="text-[#212121]">{item.label}</span>
              </div>
              {item.value && (
                <span className="text-sm text-[#757575]">{item.value}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-6">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 border-[#D32F2F] text-[#D32F2F] hover:bg-red-50"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </>
          )}
        </Button>
      </div>

      {/* App Version */}
      <div className="text-center text-xs text-[#757575] pb-4">
        FoodSafer Mobile v1.0.0
      </div>
    </div>
  );
}
