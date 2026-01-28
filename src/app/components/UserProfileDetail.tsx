import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Building, Briefcase, MessageSquare, UserPlus, Loader2, Mail, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { api } from '@/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  organization: string;
  location: string;
  bio: string;
  isConnected: boolean;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function mapUserData(u: any): UserData {
  const avatar = u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${API_BASE}${u.avatar}`) : '';
  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Unknown';
  const company = u.userCompanies?.[0]?.company?.name || u.organization || u.company || '';
  const location = [u.city, u.country].filter(Boolean).join(', ') || u.location || '';

  return {
    id: u.id,
    name,
    email: u.email || '',
    phone: u.phone || u.phoneNumber || '',
    avatar,
    role: u.jobTitle || u.role || u.title || '',
    organization: company,
    location,
    bio: u.bio || u.about || u.description || '',
    isConnected: u.isConnected ?? false,
  };
}

export function UserProfileDetail({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/queries/users/${userId}`);
      setUser(mapUserData(data));
    } catch (err) {
      console.error('Failed to load user:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h2 className="ml-3">Profile</h2>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

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
          {user.isConnected ? (
            <Button className="flex-1 bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          ) : (
            <Button className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Connect
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
