import { ArrowLeft, Download, Share2, Bookmark, Clock, Users, Star, Calendar, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface FrameworkData {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
  users: number;
  rating: number;
  lastUpdated: string;
  author: {
    name: string;
    organization: string;
    avatar: string;
  };
  sections: Array<{
    id: string;
    title: string;
    duration: string;
  }>;
  relatedFrameworks: Array<{
    id: string;
    title: string;
    thumbnail: string;
  }>;
}

const mockFrameworkData: Record<string, FrameworkData> = {
  '1': {
    id: '1',
    title: 'HACCP Implementation Guide 2026',
    description: 'Comprehensive guide for implementing Hazard Analysis and Critical Control Points in food facilities. This framework covers the seven principles of HACCP, detailed implementation steps, monitoring procedures, and verification methods.',
    category: 'HACCP',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    duration: '45 min read',
    users: 1247,
    rating: 4.8,
    lastUpdated: 'January 10, 2026',
    author: {
      name: 'Dr. Maria Rodriguez',
      organization: 'Global Food Standards',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    sections: [
      { id: '1', title: 'Introduction to HACCP', duration: '8 min' },
      { id: '2', title: 'Principle 1: Conduct Hazard Analysis', duration: '10 min' },
      { id: '3', title: 'Principle 2: Determine Critical Control Points', duration: '8 min' },
      { id: '4', title: 'Principle 3: Establish Critical Limits', duration: '7 min' },
      { id: '5', title: 'Principle 4: Monitoring Procedures', duration: '6 min' },
      { id: '6', title: 'Principle 5: Corrective Actions', duration: '5 min' },
      { id: '7', title: 'Principle 6: Verification Procedures', duration: '6 min' },
      { id: '8', title: 'Principle 7: Record Keeping', duration: '5 min' },
    ],
    relatedFrameworks: [
      {
        id: '2',
        title: 'Allergen Control Framework',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      },
      {
        id: '4',
        title: 'Quality Management Standards',
        thumbnail: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop',
      },
    ],
  },
};

export function FrameworkDetail({ frameworkId, onBack }: { frameworkId: string; onBack: () => void }) {
  const [isSaved, setIsSaved] = useState(false);
  const framework = mockFrameworkData[frameworkId] || mockFrameworkData['1'];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
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
            <button onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#2E7D32] text-[#2E7D32]' : 'text-[#757575]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={framework.thumbnail}
          alt={framework.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Category Badge */}
        <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9] border-none mb-3">
          {framework.category}
        </Badge>

        {/* Title */}
        <h1 className="mb-3">{framework.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-[#757575] mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{framework.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{framework.users.toLocaleString()} users</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
            <span>{framework.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Updated {framework.lastUpdated}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-2">About this Framework</h3>
          <p className="text-[#212121] leading-relaxed">
            {framework.description}
          </p>
        </div>

        {/* Author */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="mb-3">Created by</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img
                src={framework.author.avatar}
                alt={framework.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4>{framework.author.name}</h4>
              <p className="text-sm text-[#757575]">{framework.author.organization}</p>
            </div>
            <Button
              variant="outline"
              className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]"
            >
              Follow
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-3">Content Sections</h3>
          <div className="space-y-2">
            {framework.sections.map((section, index) => (
              <button
                key={section.id}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm">{section.title}</h4>
                    <p className="text-xs text-[#757575]">{section.duration}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#757575]" />
              </button>
            ))}
          </div>
        </div>

        {/* Related Frameworks */}
        <div className="mb-4">
          <h3 className="mb-3">Related Frameworks</h3>
          <div className="grid grid-cols-2 gap-3">
            {framework.relatedFrameworks.map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-24 bg-gray-100">
                  <img
                    src={related.thumbnail}
                    alt={related.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm line-clamp-2">{related.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200">
          <Button className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
            <Download className="w-5 h-5 mr-2" />
            Download Framework
          </Button>
        </div>
      </div>
    </div>
  );
}
