import { useState, useEffect } from 'react';
import { Search, UserPlus, Crown, MessageCircle, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { workspacesService } from '@/api';

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

const API_BASE = 'https://my.foodsafer.com:443/api';

function mapMember(p: any): Member {
  const user = p.user || p;
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  const avatar = user.avatar ?
    (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : '';
  const company = user.userCompanies?.[0]?.company?.name || user.organization || '';

  return {
    id: user.id || p.userId,
    name,
    organization: company,
    avatar,
    role: p.isAdmin ? 'Admin' : 'Member',
    isOnline: user.isOnline || false,
    status: p.status === 22 ? 'Active' : 'Pending',
  };
}

export function WorkspaceMembers({ workspaceId }: WorkspaceMembersProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workspacesService.getById(workspaceId);
      const participants = data.participants || [];
      setMembers(participants.map(mapMember));
    } catch (err) {
      console.error('Failed to load members:', err);
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const activeMembers = members.filter(m => m.status === 'Active');
  const pendingMembers = members.filter(m => m.status === 'Pending');

  const filteredMembers = () => {
    let filtered = activeMembers;

    if (activeTab === 'admins') {
      filtered = filtered.filter(m => m.role === 'Admin');
    }

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <div className="bg-[#F5F5F5]">
      {/* Header Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3>Members ({activeMembers.length})</h3>
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
              Pending {pendingMembers.length > 0 && `(${pendingMembers.length})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Loading/Error states */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : (
        <>
          {/* Members List */}
          {activeTab !== 'pending' && (
            <div className="px-4 py-4 space-y-2">
              {filteredMembers().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#757575]">No members found</p>
                </div>
              ) : (
                filteredMembers().map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              )}
            </div>
          )}

          {/* Pending Members */}
          {activeTab === 'pending' && (
            <div className="px-4 py-4">
              {pendingMembers.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-[#757575] text-sm mb-3">Join Requests</h4>
                  {pendingMembers.map((member) => (
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
        </>
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
