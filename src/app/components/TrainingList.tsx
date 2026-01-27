import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Play, Clock, Users, Star, Award, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { TrainingDetail } from './TrainingDetail';
import { api } from '@/api';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  students: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  certified: boolean;
  progress?: number;
}

const API_BASE = 'https://test.foodsafer.com/api';

function formatDuration(minutes: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
}

function mapCourse(t: any): Course {
  const instructor = t.instructor || t.creator || {};
  const instructorName = typeof instructor === 'string'
    ? instructor
    : `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Unknown';

  const thumbnail = t.thumbnail || t.image || t.cover;
  const thumbUrl = thumbnail ? (thumbnail.startsWith('http') ? thumbnail : `${API_BASE}${thumbnail}`) : '';

  return {
    id: t.id,
    title: t.title || t.name || 'Untitled Course',
    description: t.description || t.content || '',
    instructor: instructorName,
    thumbnail: thumbUrl,
    duration: formatDuration(t.duration || t.durationMinutes || 0),
    students: t.enrolledCount || t.students || t.participantsCount || 0,
    rating: t.rating || t.averageRating || 0,
    level: t.level || t.difficulty || 'Beginner',
    lessons: t.lessonsCount || t.modulesCount || t.lessons || 0,
    certified: t.certified ?? t.hasCertificate ?? false,
    progress: t.progress || 0,
  };
}

export function TrainingList({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any[]>('/queries/trainings');
      const coursesArray = Array.isArray(data) ? data.map(mapCourse) : [];
      setCourses(coursesArray);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCourse) {
    return (
      <TrainingDetail
        courseId={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  const filteredCourses = activeTab === 'inProgress'
    ? courses.filter(c => c.progress && c.progress > 0)
    : courses;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-[#4CAF50] text-white';
      case 'Intermediate':
        return 'bg-[#FF9800] text-white';
      case 'Advanced':
        return 'bg-[#D32F2F] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button onClick={onBack}>
                <ArrowLeft className="w-6 h-6 text-[#212121]" />
              </button>
              <h1>Training</h1>
            </div>
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
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-[#FF9800]">
                All Courses
              </TabsTrigger>
              <TabsTrigger value="inProgress" className="data-[state=active]:bg-white data-[state=active]:text-[#FF9800]">
                In Progress
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF9800]" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-[#757575] mx-auto mb-3" />
            <p className="text-[#757575]">No courses available</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
          <article
            key={course.id}
            onClick={() => setSelectedCourse(course.id)}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative h-40 bg-gray-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-[#FF9800] ml-1" fill="#FF9800" />
                </div>
              </div>
              {course.certified && (
                <Badge className="absolute top-3 left-3 bg-[#4CAF50] hover:bg-[#388E3C] text-white border-none">
                  <Award className="w-3 h-3 mr-1" />
                  Certified
                </Badge>
              )}
              <Badge className={`absolute top-3 right-3 ${getLevelColor(course.level)} border-none`}>
                {course.level}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="mb-2 line-clamp-1">{course.title}</h3>

              <p className="text-sm text-[#757575] line-clamp-2 mb-3">
                {course.description}
              </p>

              <p className="text-sm text-[#212121] mb-3">
                Instructor: {course.instructor}
              </p>

              {/* Progress Bar (if in progress) */}
              {course.progress && course.progress > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-[#757575] mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF9800] rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center flex-wrap gap-4 text-xs text-[#757575]">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
                  <span>{course.rating}</span>
                </div>
              </div>
            </div>
          </article>
          ))
        )}
      </div>

      {/* Learning Path Banner */}
      <div className="mx-4 my-4 bg-gradient-to-br from-[#FF9800] to-[#F57C00] rounded-lg p-4 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Award className="w-8 h-8 text-white" />
          <div>
            <h3 className="text-white mb-1">Complete Learning Paths</h3>
            <p className="text-white/90 text-sm">
              Earn certificates and advance your career
            </p>
          </div>
        </div>
        <button className="w-full bg-white text-[#FF9800] px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
          View Learning Paths
        </button>
      </div>
    </div>
  );
}
