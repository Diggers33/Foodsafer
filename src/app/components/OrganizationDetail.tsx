import { ArrowLeft, MapPin, Phone, Mail, Globe, Users, Calendar, Building2, CheckCircle, MessageSquare, Share2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

interface OrganizationData {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  distance: string;
  thumbnail: string;
  coverImage: string;
  verified: boolean;
  rating: number;
  reviews: number;
  connections: number;
  founded: string;
  size: string;
  specialties: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  recentActivity: Array<{
    id: string;
    type: 'post' | 'certification' | 'event';
    title: string;
    date: string;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
  }>;
}

const mockOrgData: Record<string, OrganizationData> = {
  '1': {
    id: '1',
    name: 'FreshPro Organic Foods',
    category: 'Food Manufacturer',
    description: 'Leading organic food manufacturer specializing in fresh produce and sustainable farming practices. Committed to food safety excellence and environmental responsibility.',
    location: 'Portland, OR',
    distance: '2.3 mi',
    thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    verified: true,
    rating: 4.8,
    reviews: 142,
    connections: 856,
    founded: '2015',
    size: '201-500 employees',
    specialties: ['Organic Certification', 'HACCP', 'SQF Level 3', 'USDA Organic'],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@freshpro.com',
      website: 'www.freshpro.com',
      address: '1234 Green Valley Rd, Portland, OR 97201',
    },
    recentActivity: [
      {
        id: '1',
        type: 'certification',
        title: 'Received SQF Level 3 Certification',
        date: '2026-01-08',
      },
      {
        id: '2',
        type: 'post',
        title: 'Published HACCP implementation case study',
        date: '2026-01-05',
      },
      {
        id: '3',
        type: 'event',
        title: 'Hosting Food Safety Workshop',
        date: '2026-01-15',
      },
    ],
    team: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Food Safety Manager',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Quality Assurance Director',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        role: 'Compliance Specialist',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      },
    ],
  },
};

export function OrganizationDetail({ orgId, onBack }: { orgId: string; onBack: () => void }) {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [showMessageComposer, setShowMessageComposer] = useState(false);
  const org = mockOrgData[orgId] || mockOrgData['1'];

  // Handle message compose
  if (showMessageComposer) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 h-14">
            <button onClick={() => setShowMessageComposer(false)}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h1>New Message</h1>
            <button className="text-[#2E7D32]">
              Send
            </button>
          </div>
        </header>

        {/* To Field */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img src={org.thumbnail} alt={org.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm">{org.name}</p>
              <p className="text-xs text-[#757575]">{org.category}</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <textarea
            placeholder="Write your message..."
            className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
            autoFocus
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-[#212121]" />
          </button>
          <div className="flex items-center gap-3">
            <button>
              <Share2 className="w-6 h-6 text-[#757575]" />
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-40 bg-gray-100">
        <img
          src={org.coverImage}
          alt={org.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="px-4 -mt-12 mb-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex gap-3 mb-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border-4 border-white shadow-md flex-shrink-0">
              <img
                src={org.thumbnail}
                alt={org.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pt-8">
              <div className="flex items-start gap-2 mb-1">
                <h2 className="flex-1 line-clamp-1">{org.name}</h2>
                {org.verified && (
                  <CheckCircle className="w-5 h-5 text-[#2E7D32] flex-shrink-0" fill="#2E7D32" />
                )}
              </div>
              <p className="text-sm text-[#757575]">{org.category}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-gray-200 mb-3">
            <div className="text-center">
              <div className="text-lg text-[#212121]">{org.connections}</div>
              <div className="text-xs text-[#757575]">Connections</div>
            </div>
            <div className="text-center border-l border-r border-gray-200">
              <div className="text-lg text-[#212121] flex items-center justify-center gap-1">
                {org.rating}
                <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
              </div>
              <div className="text-xs text-[#757575]">{org.reviews} reviews</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-[#212121]">{org.distance}</div>
              <div className="text-xs text-[#757575]">Away</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setIsConnected(!isConnected)}
              className={`h-11 ${
                isConnected
                  ? 'bg-white border border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]'
                  : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
              }`}
            >
              {isConnected ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Connect
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowMessageComposer(true)}
              variant="outline"
              className="h-11 border-[#757575] text-[#212121] hover:bg-gray-50"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 bg-white rounded-lg">
            <TabsTrigger value="about" className="data-[state=active]:bg-[#E8F5E9] data-[state=active]:text-[#2E7D32]">
              About
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-[#E8F5E9] data-[state=active]:text-[#2E7D32]">
              Activity
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-[#E8F5E9] data-[state=active]:text-[#2E7D32]">
              Team
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="px-4 space-y-4">
        {activeTab === 'about' && (
          <>
            {/* Description */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="mb-2">About</h3>
              <p className="text-[#212121] leading-relaxed mb-3">
                {org.description}
              </p>
              <div className="flex items-center gap-1 text-sm text-[#757575]">
                <MapPin className="w-4 h-4" />
                <span>{org.location}</span>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="mb-3">Company Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#757575]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Founded</p>
                    <p className="text-sm text-[#212121]">{org.founded}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-[#757575]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Company Size</p>
                    <p className="text-sm text-[#212121]">{org.size}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="mb-3">Specialties & Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {org.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="mb-3">Contact Information</h3>
              <div className="space-y-3">
                <a href={`tel:${org.contact.phone}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Phone className="w-5 h-5 text-[#757575]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Phone</p>
                    <p className="text-sm text-[#2E7D32]">{org.contact.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${org.contact.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Mail className="w-5 h-5 text-[#757575]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Email</p>
                    <p className="text-sm text-[#2E7D32]">{org.contact.email}</p>
                  </div>
                </a>
                <a href={`https://${org.contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <Globe className="w-5 h-5 text-[#757575]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Website</p>
                    <p className="text-sm text-[#2E7D32]">{org.contact.website}</p>
                  </div>
                </a>
                <div className="flex items-start gap-3 p-2">
                  <MapPin className="w-5 h-5 text-[#757575] mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-[#757575]">Address</p>
                    <p className="text-sm text-[#212121]">{org.contact.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {org.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'certification' ? 'bg-[#E8F5E9]' :
                    activity.type === 'event' ? 'bg-[#FFF3E0]' : 'bg-[#E3F2FD]'
                  }`}>
                    {activity.type === 'certification' && <CheckCircle className="w-5 h-5 text-[#2E7D32]" />}
                    {activity.type === 'event' && <Calendar className="w-5 h-5 text-[#FF9800]" />}
                    {activity.type === 'post' && <MessageSquare className="w-5 h-5 text-[#2196F3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#212121] mb-1">{activity.title}</p>
                    <p className="text-xs text-[#757575]">
                      {new Date(activity.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="bg-white rounded-lg p-4">
            <h3 className="mb-4">Team Members</h3>
            <div className="space-y-3">
              {org.team.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm">{member.name}</h4>
                    <p className="text-xs text-[#757575]">{member.role}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}