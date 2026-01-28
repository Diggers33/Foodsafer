import { useState } from 'react';
import { X, Search, UserPlus, CheckCircle } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface AddMemberProps {
  onClose: () => void;
  workspaceId: string;
}

const suggestedUsers = [
  { id: '1', name: 'Alex Thompson', role: 'Food Safety Manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  { id: '2', name: 'Nina Patel', role: 'Quality Control Specialist', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop' },
  { id: '3', name: 'David Kim', role: 'HACCP Coordinator', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop' },
  { id: '4', name: 'Lisa Martinez', role: 'Compliance Officer', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop' },
  { id: '5', name: 'Robert Johnson', role: 'Operations Director', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop' },
];

export function AddMember({ onClose }: AddMemberProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [inviteByEmail, setInviteByEmail] = useState('');

  const filteredUsers = suggestedUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleAddMembers = () => {
    const memberData = {
      userIds: selectedUsers,
      inviteEmail: inviteByEmail,
      timestamp: new Date().toISOString(),
    };
    console.log('Adding members:', memberData);
    // In a real app, this would send invitations
    onClose();
  };

  const isValid = selectedUsers.length > 0 || inviteByEmail.trim();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onClose}>
            <X className="w-6 h-6 text-[#212121]" />
          </button>
          <h1>Add Members</h1>
          <button 
            onClick={handleAddMembers}
            className="text-[#2E7D32] font-semibold disabled:text-[#BDBDBD] disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            Add
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#757575]" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2E7D32]"
              autoFocus
            />
          </div>

          {/* Selected Count */}
          {selectedUsers.length > 0 && (
            <div className="mb-3 p-2 bg-[#E8F5E9] rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-sm text-[#2E7D32]">
                {selectedUsers.length} member{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
            </div>
          )}

          {/* User List */}
          <div className="space-y-2">
            <h4 className="text-sm text-[#757575] mb-2">Suggested Members</h4>
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.includes(user.id);
              return (
                <button
                  key={user.id}
                  onClick={() => toggleUserSelection(user.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                    isSelected ? 'bg-[#E8F5E9]' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="w-10 h-10">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm">{user.name}</h4>
                    <p className="text-xs text-[#757575]">{user.role}</p>
                  </div>
                  {isSelected ? (
                    <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Invite by Email */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-sm text-[#757575] mb-3">Invite by Email</h4>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="colleague@example.com"
              value={inviteByEmail}
              onChange={(e) => setInviteByEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2E7D32]"
            />
          </div>
          <p className="text-xs text-[#757575] mt-2">
            They'll receive an invitation to join this workspace
          </p>
        </div>

        {/* Permission Info */}
        <div className="bg-white rounded-lg p-4">
          <h4 className="text-sm mb-2">Default Permissions</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5" />
              <p className="text-sm text-[#757575]">View and comment on discussions</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5" />
              <p className="text-sm text-[#757575]">Create and edit notes</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5" />
              <p className="text-sm text-[#757575]">Upload and download files</p>
            </div>
          </div>
          <p className="text-xs text-[#757575] mt-3">
            Workspace admins can modify permissions later
          </p>
        </div>
      </div>
    </div>
  );
}
