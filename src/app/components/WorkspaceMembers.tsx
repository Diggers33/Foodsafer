import { useState } from 'react';
import { Search, UserPlus, Crown, MessageCircle } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';

interface WorkspaceMembersProps {
  workspaceId: string;
}

interface Member {
  id: string;
  name: string;
  organization: string;
  avatar: string;
  role: 'Admin' | 'Member';
  isOnline: boolean;
  status?: 'Active' | 'Pending';
}

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Dr. Maria Rodriguez',
    organization: 'Global Food Standards',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    role: 'Admin',
    isOnline: true,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    organization: 'FoodSafe Global',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    role: 'Admin',
    isOnline: true,
    status: 'Active',
  },
  {
    id: '3',
    name: 'James Chen',
    organization: 'SafeFood Consulting',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: true,
    status: 'Active',
  },
  {
    id: '4',
    name: 'Emily Davis',
    organization: 'Quality First Inc',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: false,
    status: 'Active',
  },
  {
    id: '5',
    name: 'Michael Brown',
    organization: 'Food Safety Solutions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: false,
    status: 'Active',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    organization: 'NutriSafe Labs',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: true,
    status: 'Active',
  },
  {
    id: '7',
    name: 'David Wilson',
    organization: 'TechFood Systems',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: false,
    status: 'Active',
  },
  {
    id: '8',
    name: 'Jennifer Lee',
    organization: 'Global Quality Assurance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: true,
    status: 'Active',
  },
];

const mockPendingMembers: Member[] = [
  {
    id: 'p1',
    name: 'Robert Martinez',
    organization: 'FreshPro Foods',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: false,
    status: 'Pending',
  },
  {
    id: 'p2',
    name: 'Amanda Clark',
    organization: 'SafetyFirst Consulting',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    role: 'Member',
    isOnline: false,
    status: 'Pending',
  },
];

export function WorkspaceMembers({ workspaceId }: WorkspaceMembersProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = () => {
    let members = mockMembers;
    
    if (activeTab === 'admins') {
      members = members.filter(m => m.role === 'Admin');
    }
    
    if (searchQuery) {
      members = members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return members;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3>Members ({mockMembers.length})</h3>
          <div className="flex items-center gap-3">
            <button>
              <Search className="w-5 h-5 text-[#757575]" />
            </button>
            <button>
              <UserPlus className="w-5 h-5 text-[#2E7D32]" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full grid grid-cols-3 bg-[#F5F5F5]">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="admins" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]"
            >
              Admins
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]"
            >
              Pending {mockPendingMembers.length > 0 && `(${mockPendingMembers.length})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Members List */}
      {activeTab !== 'pending' && (
        <div className="px-4 py-4 space-y-2">
          {filteredMembers().map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}

      {/* Pending Members */}
      {activeTab === 'pending' && (
        <div className="px-4 py-4">
          {mockPendingMembers.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-[#757575] text-sm mb-3">Join Requests</h4>
              {mockPendingMembers.map((member) => (
                <PendingMemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-[#BDBDBD] mx-auto mb-3" />
              <p className="text-[#757575]">No pending requests</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 hover:shadow-md transition-shadow">
      {/* Avatar with Online Indicator */}
      <div className="relative flex-shrink-0">
        <Avatar className="w-12 h-12">
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        </Avatar>
        {member.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm truncate">{member.name}</h4>
          {member.role === 'Admin' && (
            <Crown className="w-4 h-4 text-[#FFC107] flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-[#757575] truncate">{member.organization}</p>
      </div>

      {/* Role Badge and Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge
          variant="secondary"
          className={`text-xs ${
            member.role === 'Admin'
              ? 'bg-[#FFF3E0] text-[#FF9800]'
              : 'bg-[#F5F5F5] text-[#757575]'
          }`}
        >
          {member.role}
        </Badge>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
          <MessageCircle className="w-4 h-4 text-[#757575]" />
        </button>
      </div>
    </article>
  );
}

function PendingMemberCard({ member }: { member: Member }) {
  return (
    <article className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-12 h-12">
          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm mb-1">{member.name}</h4>
          <p className="text-xs text-[#757575]">{member.organization}</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="flex-1 h-9 bg-[#2E7D32] hover:bg-[#1B5E20]">
          Accept
        </Button>
        <Button variant="outline" className="flex-1 h-9 border-[#D32F2F] text-[#D32F2F] hover:bg-red-50">
          Decline
        </Button>
      </div>
    </article>
  );
}
