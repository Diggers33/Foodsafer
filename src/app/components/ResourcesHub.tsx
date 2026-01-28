import { useState, useEffect } from 'react';
import { Search, Shield, Wrench, GraduationCap, Library, ChevronRight, Loader2 } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { FrameworkList } from './FrameworkList';
import { ToolkitList } from './ToolkitList';
import { TrainingList } from './TrainingList';
import { LibraryList } from './LibraryList';
import { api } from '@/api';

interface ResourceCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

interface RecentItem {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  fileUrl: string;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

const categories: ResourceCategory[] = [
  {
    id: 'framework',
    title: 'Framework',
    subtitle: 'Food safety hazard identification',
    icon: <Shield className="w-8 h-8" />,
    color: '#2E7D32',
    gradient: 'from-[#2E7D32] to-[#1B5E20]',
  },
  {
    id: 'toolkit',
    title: 'Toolkit',
    subtitle: 'External tools & resources',
    icon: <Wrench className="w-8 h-8" />,
    color: '#2196F3',
    gradient: 'from-[#2196F3] to-[#1976D2]',
  },
  {
    id: 'training',
    title: 'Training',
    subtitle: 'Courses & learning materials',
    icon: <GraduationCap className="w-8 h-8" />,
    color: '#FF9800',
    gradient: 'from-[#FF9800] to-[#F57C00]',
  },
  {
    id: 'library',
    title: 'Library',
    subtitle: 'Documents & guidelines',
    icon: <Library className="w-8 h-8" />,
    color: '#9C27B0',
    gradient: 'from-[#9C27B0] to-[#7B1FA2]',
  },
];

function mapLibraryItem(item: any): RecentItem {
  const thumbnail = item.thumbnail || item.image || item.cover;
  const thumbUrl = thumbnail ? (thumbnail.startsWith('http') ? thumbnail : `${API_BASE}${thumbnail}`) : '';
  const rawUrl = item.url || item.fileUrl || item.file || item.path ||
                 item.downloadUrl || item.link || item.attachment || '';
  const fileUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${API_BASE}${rawUrl}`) : '';

  return {
    id: item.id,
    title: item.title || item.name || 'Untitled',
    type: item.type || item.category || 'Library',
    thumbnail: thumbUrl,
    fileUrl,
  };
}

export function ResourcesHub({ onProfileClick }: { onProfileClick: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    setIsLoading(true);
    try {
      // Try to fetch libraries
      const data = await api.get<any[]>('/queries/libraries');
      const items = Array.isArray(data) ? data.slice(0, 5).map(mapLibraryItem) : [];
      setRecentItems(items);
    } catch (err) {
      console.error('Failed to load recent items:', err);
      // Leave as empty array
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCategory === 'framework') {
    return <FrameworkList onBack={() => setSelectedCategory(null)} />;
  }

  if (selectedCategory === 'toolkit') {
    return <ToolkitList onBack={() => setSelectedCategory(null)} />;
  }

  if (selectedCategory === 'training') {
    return <TrainingList onBack={() => setSelectedCategory(null)} />;
  }

  if (selectedCategory === 'library') {
    return <LibraryList onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <AppHeader onProfileClick={onProfileClick} />

      {/* Subheader */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <h1>Resources</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Main Categories Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`bg-gradient-to-br ${category.gradient} rounded-xl p-5 text-left shadow-md hover:shadow-lg transition-shadow relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="text-white mb-3">{category.icon}</div>
                <h3 className="text-white mb-1">{category.title}</h3>
                <p className="text-white/90 text-xs leading-relaxed">
                  {category.subtitle}
                </p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full"></div>
            </button>
          ))}
        </div>

        {/* Recently Viewed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2>Recently Viewed</h2>
            <button className="text-[#2E7D32] text-sm">See all</button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
            </div>
          ) : recentItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#757575]">No recent items</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item) => (
                <article
                  key={item.id}
                  onClick={() => {
                    if (item.fileUrl) {
                      window.open(item.fileUrl, '_blank');
                    } else {
                      setSelectedCategory('library');
                    }
                  }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Library className="w-6 h-6 text-[#757575]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="line-clamp-1 mb-1">{item.title}</h4>
                      <p className="text-sm text-[#757575]">{item.type}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#757575] flex-shrink-0" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}