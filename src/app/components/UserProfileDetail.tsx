import { useState } from 'react';
import { ArrowLeft, MapPin, Building, MessageSquare, UserPlus, Mail, Phone, Loader2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { usersService } from '@/api';

export interface UserProfileData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  role: string;
  organization: string;
  location: string;
  bio?: string;
  isConnected: boolean;
}

export function UserProfileDetail({ user, onBack }: { user: UserProfileData; onBack: () => void }) {
  const [isConnected, setIsConnected] = useState(user.isConnected);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await usersService.connect(user.id);
      setConnectionSent(true);
    } catch (err) {
      console.error('Failed to send connection request:', err);
      alert('Failed to send connection request. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center px-4 h-14">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </button>
          <h2 className="ml-3">Profile</h2>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white px-4 py-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-2xl font-semibold">
                {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-xl font-semibold text-[#212121] mb-1">{user.name}</h1>
          {user.role && <p className="text-[#757575] mb-1">{user.role}</p>}
          {user.organization && (
            <div className="flex items-center gap-1 text-sm text-[#757575] mb-2">
              <Building className="w-4 h-4" />
              <span>{user.organization}</span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center gap-1 text-sm text-[#757575]">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {isConnected ? (
            <Button className="flex-1 bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          ) : connectionSent ? (
            <Button className="flex-1 bg-[#E8F5E9] text-[#2E7D32]" disabled>
              <Check className="w-4 h-4 mr-2" />
              Request Sent
            </Button>
          ) : (
            <Button
              className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="bg-white mt-2 px-4 py-4">
          <h3 className="font-semibold text-[#212121] mb-2">About</h3>
          <p className="text-[#757575] text-sm leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Contact Info */}
      <div className="bg-white mt-2 px-4 py-4">
        <h3 className="font-semibold text-[#212121] mb-3">Contact Information</h3>
        {user.email && (
          <div className="flex items-center gap-3 py-2">
            <Mail className="w-5 h-5 text-[#757575]" />
            <span className="text-sm text-[#212121]">{user.email}</span>
          </div>
        )}
        {user.phone && (
          <div className="flex items-center gap-3 py-2">
            <Phone className="w-5 h-5 text-[#757575]" />
            <span className="text-sm text-[#212121]">{user.phone}</span>
          </div>
        )}
        {!user.email && !user.phone && (
          <p className="text-sm text-[#757575]">No contact information available</p>
        )}
      </div>
    </div>
  );
}
