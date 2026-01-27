import { ArrowLeft, Users, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface Connection {
  id: string;
  name: string;
  role: string;
  organization: string;
  avatar: string;
  location: string;
  mutualConnections: number;
  isConnected: boolean;
}

const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Food Safety Manager',
    organization: 'FreshPro Organic Foods',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    location: 'Portland, OR',
    mutualConnections: 12,
    isConnected: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Quality Assurance Director',
    organization: 'SafetyFirst Lab Services',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    location: 'Portland, OR',
    mutualConnections: 8,
    isConnected: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Compliance Specialist',
    organization: 'NutriGreen Solutions',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    location: 'Beaverton, OR',
    mutualConnections: 15,
    isConnected: true,
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Training Coordinator',
    organization: 'Pacific Food Safety Institute',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    location: 'Portland, OR',
    mutualConnections: 6,
    isConnected: true,
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    role: 'HACCP Coordinator',
    organization: 'Organic Valley Farms',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    location: 'Eugene, OR',
    mutualConnections: 10,
    isConnected: true,
  },
];

const suggestedConnections: Connection[] = [
  {
    id: '6',
    name: 'Robert Thompson',
    role: 'Food Safety Consultant',
    organization: 'SafeFood Consulting',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    location: 'Seattle, WA',
    mutualConnections: 7,
    isConnected: false,
  },
  {
    id: '7',
    name: 'Amanda Lee',
    role: 'Quality Manager',
    organization: 'Pacific Seafood Group',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    location: 'Portland, OR',
    mutualConnections: 9,
    isConnected: false,
  },
];

export function ConnectionsList({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-[#212121]" />
              </button>
              <h1>Connections</h1>
            </div>
            <Badge variant="secondary" className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">
              {mockConnections.length}
            </Badge>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* My Connections */}
        <div className="mb-6">
          <h3 className="mb-3">My Connections</h3>
          <div className="space-y-3">
            {mockConnections.map((connection) => (
              <article
                key={connection.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="line-clamp-1 mb-0.5">{connection.name}</h4>
                    <p className="text-sm text-[#757575] line-clamp-1 mb-1">{connection.role}</p>
                    <p className="text-xs text-[#757575] line-clamp-1">{connection.organization}</p>
                    <p className="text-xs text-[#2E7D32] mt-1">
                      {connection.mutualConnections} mutual connections
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#757575] text-[#757575] hover:bg-gray-50 flex-shrink-0"
                  >
                    Message
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Suggested Connections */}
        <div>
          <h3 className="mb-3">People You May Know</h3>
          <div className="space-y-3">
            {suggestedConnections.map((connection) => (
              <article
                key={connection.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={connection.avatar}
                      alt={connection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="line-clamp-1 mb-0.5">{connection.name}</h4>
                    <p className="text-sm text-[#757575] line-clamp-1 mb-1">{connection.role}</p>
                    <p className="text-xs text-[#757575] line-clamp-1">{connection.organization}</p>
                    <p className="text-xs text-[#2E7D32] mt-1">
                      {connection.mutualConnections} mutual connections
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white flex-shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Connect
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
