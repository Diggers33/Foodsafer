import { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, MessageCircle, ChevronDown, ChevronUp, Users as UsersIcon, Plus, Calendar, FileText, Upload, UserPlus, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { WorkspaceDiscussions } from './WorkspaceDiscussions';
import { WorkspaceMeetings } from './WorkspaceMeetings';
import { WorkspaceNotes } from './WorkspaceNotes';
import { WorkspaceFiles } from './WorkspaceFiles';
import { WorkspaceMembers } from './WorkspaceMembers';
import { CreateDiscussion } from './CreateDiscussion';
import { CreateMeeting } from './CreateMeeting';
import { CreateNote } from './CreateNote';
import { UploadFile } from './UploadFile';
import { AddMember } from './AddMember';
import { workspacesService } from '@/api';

interface WorkspaceDetailProps {
  workspaceId: string;
  onBack: () => void;
}

interface WorkspaceData {
  id: string;
  name: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  members: { id: string; name: string; avatar: string }[];
  totalMembers: number;
  tags: string[];
  unreadCounts: {
    discussions: number;
    meetings: number;
    notes: number;
    files: number;
  };
}

const API_BASE = 'https://my.foodsafer.com:443/api';

export function WorkspaceDetail({ workspaceId, onBack }: WorkspaceDetailProps) {
  const [activeTab, setActiveTab] = useState('discussions');
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkspace();
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workspacesService.getById(workspaceId);
      console.log('Workspace API response:', JSON.stringify(data, null, 2));
      // Map API response to our display format
      const thumbnail = data.thumbnail ?
        (data.thumbnail.startsWith('http') ? data.thumbnail : `${API_BASE}${data.thumbnail}`)
        : '';

      // Map participants (API uses 'participants' not 'members')
      const participants = data.participants || data.members || [];
      const members = participants.slice(0, 5).map((p: any) => {
        const user = p.user || p;
        return {
          id: user.id || p.userId,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Member',
          avatar: user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : '',
        };
      });

      // Extract tags from 'about' field if they exist (format: "text #tag1 #tag2")
      const aboutText = data.about || data.description || '';
      const tagMatches = aboutText.match(/#\w+/g) || [];
      const tags = tagMatches.map((t: string) => t.substring(1)); // Remove # prefix

      setWorkspace({
        id: data.id,
        name: data.name || 'Untitled Workspace',
        subtitle: data.subName || data.subtitle || data.shortDescription || '',
        thumbnail,
        description: aboutText.replace(/#\w+/g, '').trim() || '', // Remove tags from description
        members,
        totalMembers: participants.length || data.memberCount || data.numMembers || 0,
        tags,
        unreadCounts: {
          discussions: data.unreadDiscussions || 0,
          meetings: data.unreadMeetings || 0,
          notes: data.unreadNotes || 0,
          files: data.unreadFiles || 0,
        },
      });
    } catch (err) {
      console.error('Failed to load workspace:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workspace');
    } finally {
      setIsLoading(false);
    }
  };

  // Get the appropriate FAB icon and label based on active tab
  const getFabConfig = () => {
    switch (activeTab) {
      case 'discussions':
        return { icon: MessageCircle, label: 'New Discussion', ariaLabel: 'Create new discussion' };
      case 'meetings':
        return { icon: Calendar, label: 'New Meeting', ariaLabel: 'Schedule new meeting' };
      case 'notes':
        return { icon: FileText, label: 'New Note', ariaLabel: 'Create new note' };
      case 'files':
        return { icon: Upload, label: 'Upload File', ariaLabel: 'Upload new file' };
      case 'members':
        return { icon: UserPlus, label: 'Add Member', ariaLabel: 'Add new member' };
      default:
        return { icon: Plus, label: 'Add', ariaLabel: 'Add new item' };
    }
  };

  const fabConfig = getFabConfig();
  const FabIcon = fabConfig.icon;

  const handleFabClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  // If create modal is open, show the appropriate creation screen
  if (showCreateModal) {
    switch (activeTab) {
      case 'discussions':
        return <CreateDiscussion onClose={handleCloseModal} workspaceId={workspaceId} />;
      case 'meetings':
        return <CreateMeeting onClose={handleCloseModal} workspaceId={workspaceId} />;
      case 'notes':
        return <CreateNote onClose={handleCloseModal} workspaceId={workspaceId} />;
      case 'files':
        return <UploadFile onClose={handleCloseModal} workspaceId={workspaceId} />;
      case 'members':
        return <AddMember onClose={handleCloseModal} workspaceId={workspaceId} />;
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  // Error state
  if (error || !workspace) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">{error || 'Workspace not found'}</p>
        <button onClick={onBack} className="text-[#2E7D32]">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header with Hero Image */}
      <div className="relative">
        {/* Hero Image */}
        <div className="h-48 overflow-hidden relative">
          {workspace.thumbnail ? (
            <img
              src={workspace.thumbnail}
              alt={workspace.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#2E7D32]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>

          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
              <MoreVertical className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Workspace Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <h1 className="text-white">{workspace.name}</h1>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white px-4 py-4 mb-2">
        {/* Subtitle */}
        {workspace.subtitle && <p className="text-[#757575] mb-3">{workspace.subtitle}</p>}

        {/* Members Row */}
        {workspace.totalMembers > 0 && (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center -space-x-2">
              {workspace.members.map((member) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-xs">
                      {member.name[0]}
                    </div>
                  )}
                </Avatar>
              ))}
            </div>
            {workspace.totalMembers > 5 && (
              <span className="text-sm text-[#757575]">
                +{workspace.totalMembers - 5} more
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        {workspace.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {workspace.tags.map((tag) => {
              const tagName = typeof tag === 'object' && tag !== null ? (tag as any).name : tag;
              const tagKey = typeof tag === 'object' && tag !== null ? (tag as any).id || tagName : tag;
              return (
                <Badge
                  key={tagKey}
                  variant="secondary"
                  className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs"
                >
                  #{tagName}
                </Badge>
              );
            })}
          </div>
        )}

        {/* About Section */}
        {workspace.description && (
          <div>
            <button
              onClick={() => setShowFullAbout(!showFullAbout)}
              className="flex items-center gap-2 text-[#2E7D32] mb-2"
            >
              <span>About</span>
              {showFullAbout ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <p className={`text-sm text-[#212121] leading-relaxed ${showFullAbout ? '' : 'line-clamp-2'}`}>
              {workspace.description}
            </p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none overflow-x-auto">
            <TabsTrigger
              value="discussions"
              className="relative px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2E7D32] data-[state=active]:text-[#2E7D32] data-[state=active]:bg-transparent"
            >
              Discussions
              {workspace.unreadCounts.discussions > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#D32F2F] text-white text-xs rounded-full">
                  {workspace.unreadCounts.discussions}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="meetings" 
              className="relative px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2E7D32] data-[state=active]:text-[#2E7D32] data-[state=active]:bg-transparent"
            >
              Meetings
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="relative px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2E7D32] data-[state=active]:text-[#2E7D32] data-[state=active]:bg-transparent"
            >
              Notes
            </TabsTrigger>
            <TabsTrigger 
              value="files" 
              className="relative px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2E7D32] data-[state=active]:text-[#2E7D32] data-[state=active]:bg-transparent"
            >
              Files
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="relative px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#2E7D32] data-[state=active]:text-[#2E7D32] data-[state=active]:bg-transparent"
            >
              Members
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="pb-20">
        {activeTab === 'discussions' && <WorkspaceDiscussions workspaceId={workspaceId} />}
        {activeTab === 'meetings' && <WorkspaceMeetings workspaceId={workspaceId} />}
        {activeTab === 'notes' && <WorkspaceNotes workspaceId={workspaceId} />}
        {activeTab === 'files' && <WorkspaceFiles workspaceId={workspaceId} />}
        {activeTab === 'members' && <WorkspaceMembers workspaceId={workspaceId} />}
      </div>

      {/* Floating Chat Button */}
      <button 
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40"
        onClick={handleFabClick}
        aria-label={fabConfig.ariaLabel}
      >
        <FabIcon className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}