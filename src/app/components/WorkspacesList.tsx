import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Users as UsersIcon, Lock, Globe, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { WorkspaceDetail } from './WorkspaceDetail';
import { CreateWorkspace } from './CreateWorkspace';
import { AppHeader } from './AppHeader';
import { workspacesService, Workspace as ApiWorkspace } from '@/api';

// Local workspace type for display
interface DisplayWorkspace {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  memberCount: number;
  isPublic: boolean;
  userRole?: 'Admin' | 'Member';
  hasUnread: boolean;
}

// Helper to convert API workspace to display workspace
function toDisplayWorkspace(workspace: ApiWorkspace): DisplayWorkspace {
  return {
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    thumbnail: workspace.thumbnail || '',
    memberCount: workspace.memberCount,
    isPublic: workspace.isPublic,
    // TODO: userRole and hasUnread should come from API
    userRole: undefined,
    hasUnread: false,
  };
}

export function WorkspacesList({ onProfileClick }: { onProfileClick: () => void }) {
  const [activeTab, setActiveTab] = useState('my');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaces, setWorkspaces] = useState<DisplayWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch workspaces when tab changes
  useEffect(() => {
    fetchWorkspaces();
  }, [activeTab]);

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = activeTab === 'my'
        ? await workspacesService.getMy()
        : await workspacesService.getAll();
      const displayWorkspaces = response.data.map(toDisplayWorkspace);
      setWorkspaces(displayWorkspaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedWorkspace) {
    return <WorkspaceDetail workspaceId={selectedWorkspace} onBack={() => setSelectedWorkspace(null)} />;
  }

  if (showCreateWorkspace) {
    return <CreateWorkspace onBack={() => { setShowCreateWorkspace(false); fetchWorkspaces(); }} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <AppHeader onProfileClick={onProfileClick} />

      {/* Subheader with tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1>Workspaces</h1>
            <div className="flex items-center gap-3">
              <button>
                <Search className="w-6 h-6 text-[#757575]" />
              </button>
              <button>
                <Filter className="w-6 h-6 text-[#757575]" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 bg-[#F5F5F5]">
              <TabsTrigger value="my" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
                My Workspaces
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32]">
                All Workspaces
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Workspaces List */}
      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchWorkspaces} variant="outline">
              Try Again
            </Button>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#757575] mb-4">
              {activeTab === 'my'
                ? "You haven't joined any workspaces yet."
                : 'No workspaces available.'}
            </p>
            <Button onClick={() => setShowCreateWorkspace(true)} className="bg-[#2E7D32]">
              Create Workspace
            </Button>
          </div>
        ) : (
          workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onClick={() => setSelectedWorkspace(workspace.id)}
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCreateWorkspace(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

function WorkspaceCard({
  workspace,
  onClick
}: {
  workspace: DisplayWorkspace;
  onClick: () => void;
}) {
  return (
    <article
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-3 p-3 relative cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Unread Indicator */}
      {workspace.hasUnread && (
        <span className="absolute top-3 left-3 w-2 h-2 bg-[#2E7D32] rounded-full z-10"></span>
      )}

      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {workspace.thumbnail ? (
          <img src={workspace.thumbnail} alt={workspace.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#2E7D32] flex items-center justify-center text-white text-xl font-semibold">
            {workspace.name[0]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="line-clamp-1 mb-1">{workspace.name}</h3>
        <p className="text-sm text-[#757575] line-clamp-2 mb-2">
          {workspace.description}
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-[#757575]">
            <UsersIcon className="w-4 h-4" />
            <span>{workspace.memberCount}</span>
          </div>
          {workspace.isPublic ? (
            <Badge variant="secondary" className="bg-[#E3F2FD] text-[#2196F3] text-xs flex items-center gap-1 h-5">
              <Globe className="w-3 h-3" />
              Public
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-[#FFF3E0] text-[#FF9800] text-xs flex items-center gap-1 h-5">
              <Lock className="w-3 h-3" />
              Private
            </Badge>
          )}
          {workspace.userRole && (
            <Badge
              variant="secondary"
              className={`text-xs h-5 ${
                workspace.userRole === 'Admin'
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'bg-[#F5F5F5] text-[#757575]'
              }`}
            >
              {workspace.userRole}
            </Badge>
          )}
        </div>
      </div>
    </article>
  );
}
