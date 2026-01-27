import { useState } from 'react';
import { ArrowLeft, MoreVertical, MessageCircle, ChevronDown, ChevronUp, Users as UsersIcon, Plus, Calendar, FileText, Upload, UserPlus } from 'lucide-react';
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

interface WorkspaceDetailProps {
  workspaceId: string;
  onBack: () => void;
}

const mockWorkspace = {
  id: '1',
  name: 'HACCP Implementation Team',
  subtitle: 'Collaborative workspace for implementing HACCP protocols across facilities',
  thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
  description: 'This workspace is dedicated to implementing and maintaining HACCP (Hazard Analysis and Critical Control Points) protocols across our global facilities. We collaborate on best practices, share documentation, conduct training sessions, and ensure compliance with international food safety standards.',
  members: [
    { id: '1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
    { id: '2', name: 'Dr. Maria Rodriguez', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop' },
    { id: '3', name: 'James Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },
    { id: '4', name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop' },
    { id: '5', name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
  ],
  totalMembers: 24,
  tags: ['HACCP', 'Compliance', 'Food Safety', 'Quality Control'],
  unreadCounts: {
    discussions: 3,
    meetings: 0,
    notes: 0,
    files: 0,
  },
};

export function WorkspaceDetail({ workspaceId, onBack }: WorkspaceDetailProps) {
  const [activeTab, setActiveTab] = useState('discussions');
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header with Hero Image */}
      <div className="relative">
        {/* Hero Image */}
        <div className="h-48 overflow-hidden relative">
          <img 
            src={mockWorkspace.thumbnail} 
            alt={mockWorkspace.name} 
            className="w-full h-full object-cover"
          />
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
            <h1 className="text-white">{mockWorkspace.name}</h1>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white px-4 py-4 mb-2">
        {/* Subtitle */}
        <p className="text-[#757575] mb-3">{mockWorkspace.subtitle}</p>
        
        {/* Members Row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center -space-x-2">
            {mockWorkspace.members.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-[#757575]">
            +{mockWorkspace.totalMembers - 5} more
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {mockWorkspace.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>
        
        {/* About Section */}
        <div>
          <button 
            onClick={() => setShowFullAbout(!showFullAbout)}
            className="flex items-center gap-2 text-[#2E7D32] mb-2"
          >
            <span>About</span>
            {showFullAbout ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <p className={`text-sm text-[#212121] leading-relaxed ${showFullAbout ? '' : 'line-clamp-2'}`}>
            {mockWorkspace.description}
          </p>
        </div>
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
              {mockWorkspace.unreadCounts.discussions > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-[#D32F2F] text-white text-xs rounded-full">
                  {mockWorkspace.unreadCounts.discussions}
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