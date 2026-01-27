import { ArrowLeft, Share2, Bookmark, Clock, Users, Star, Award, BookOpen, Play, CheckCircle, Lock, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { api } from '@/api';

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  thumbnail: string;
  videoUrl: string;
  duration: string;
  students: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  certified: boolean;
  progress: number;
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      duration: string;
      completed: boolean;
      locked: boolean;
    }>;
  }>;
}

// Check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
  }

  // If it's already an embed URL, return as is
  if (url.includes('youtube.com/embed')) {
    return url.includes('?') ? url : `${url}?autoplay=1`;
  }

  return null;
}

const API_BASE = 'https://my.foodsafer.com:443/api';

function formatDuration(minutes: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
}

function mapCourse(t: any): CourseData {
  // Debug: log to see available fields
  console.log('Training item:', t);

  const instructor = t.instructor || t.creator || {};
  const instructorName = typeof instructor === 'string'
    ? instructor
    : `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || 'Unknown';
  const instructorTitle = instructor.title || instructor.jobTitle || 'Instructor';
  const instructorAvatar = instructor.avatar
    ? (instructor.avatar.startsWith('http') ? instructor.avatar : `${API_BASE}${instructor.avatar}`)
    : '';

  const thumbnail = t.thumbnail || t.image || t.cover;
  const thumbUrl = thumbnail ? (thumbnail.startsWith('http') ? thumbnail : `${API_BASE}${thumbnail}`) : '';

  // Get video URL from various possible fields
  // The API returns the URL in file.rawLink for YouTube videos
  let videoUrl = t.file?.rawLink || t.videoUrl || t.video || t.youtubeUrl ||
                 t.youtubeLink || t.videoLink || t.mediaUrl || t.url || '';

  const modules = (t.modules || t.sections || []).map((m: any, mIdx: number) => ({
    id: m.id || String(mIdx + 1),
    title: m.title || m.name || `Module ${mIdx + 1}`,
    lessons: (m.lessons || m.items || []).map((l: any, lIdx: number) => ({
      id: l.id || `${mIdx + 1}-${lIdx + 1}`,
      title: l.title || l.name || `Lesson ${lIdx + 1}`,
      duration: l.duration ? `${l.duration} min` : '',
      completed: l.completed ?? false,
      locked: l.locked ?? (mIdx > 0),
    })),
  }));

  const totalLessons = modules.reduce((acc: number, m: any) => acc + m.lessons.length, 0);

  return {
    id: t.id,
    title: t.title || t.name || 'Untitled Course',
    description: t.description || t.content || '',
    instructor: { name: instructorName, title: instructorTitle, avatar: instructorAvatar },
    thumbnail: thumbUrl,
    videoUrl,
    duration: formatDuration(t.duration || t.durationMinutes || 0),
    students: t.enrolledCount || t.students || t.participantsCount || 0,
    rating: t.rating || t.averageRating || 0,
    level: t.level || t.difficulty || 'Beginner',
    lessons: t.lessonsCount || totalLessons || 0,
    certified: t.certified ?? t.hasCertificate ?? false,
    progress: t.progress || 0,
    modules,
  };
}

export function TrainingDetail({ courseId, onBack }: { courseId: string; onBack: () => void }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [course, setCourse] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/queries/trainings/${courseId}`);
      setCourse(mapCourse(data));
    } catch (err) {
      console.error('Failed to load course:', err);
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9800]" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#212121]" />
            </button>
            <h2 className="ml-3">Course</h2>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

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
            <button onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#FF9800] text-[#FF9800]' : 'text-[#757575]'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Video/Image */}
      <div className="relative h-56 bg-gray-900">
        {isPlayingVideo && course.videoUrl ? (
          isYouTubeUrl(course.videoUrl) ? (
            <iframe
              src={getYouTubeEmbedUrl(course.videoUrl) || course.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={course.title}
            />
          ) : (
            <video
              src={course.videoUrl}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <>
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            {course.videoUrl && (
              <button
                onClick={() => setIsPlayingVideo(true)}
                className="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-[#FF9800] ml-1" fill="#FF9800" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className={`${getLevelColor(course.level)} border-none`}>
            {course.level}
          </Badge>
          {course.certified && (
            <Badge className="bg-[#4CAF50] hover:bg-[#388E3C] text-white border-none">
              <Award className="w-3 h-3 mr-1" />
              Certificate
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="mb-3">{course.title}</h1>

        {/* Meta Info */}
        <div className="flex items-center flex-wrap gap-4 text-sm text-[#757575] mb-4 pb-4 border-b border-gray-200">
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
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#FF9800] text-[#FF9800]" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Progress */}
        {course.progress > 0 && (
          <div className="bg-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#212121]">Your Progress</span>
              <span className="text-[#FF9800]">{course.progress}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF9800] rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-2">About this Course</h3>
          <p className="text-[#212121] leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Instructor */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="mb-3">Instructor</h4>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4>{course.instructor.name}</h4>
              <p className="text-sm text-[#757575]">{course.instructor.title}</p>
            </div>
            <Button
              variant="outline"
              className="border-[#FF9800] text-[#FF9800] hover:bg-[#FFF3E0]"
            >
              Follow
            </Button>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-4">Course Content</h3>
          <div className="space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id}>
                <h4 className="mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#FFF3E0] text-[#FF9800] text-xs flex items-center justify-center">
                    {moduleIndex + 1}
                  </span>
                  {module.title}
                </h4>
                <div className="space-y-2 ml-8">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      disabled={lesson.locked}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${
                        lesson.locked
                          ? 'bg-gray-50 cursor-not-allowed'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0" fill="#4CAF50" />
                        ) : lesson.locked ? (
                          <Lock className="w-5 h-5 text-[#757575] flex-shrink-0" />
                        ) : (
                          <Play className="w-5 h-5 text-[#FF9800] flex-shrink-0" />
                        )}
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-sm line-clamp-1 ${lesson.locked ? 'text-[#757575]' : 'text-[#212121]'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-[#757575]">{lesson.duration}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h3 className="mb-3">What You'll Learn</h3>
          <ul className="space-y-2">
            {[
              'Understand the seven principles of HACCP',
              'Conduct comprehensive hazard analysis',
              'Identify and monitor critical control points',
              'Implement effective food safety systems',
              'Develop HACCP plans for your facility',
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-[#212121]">
                <CheckCircle className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-white border-t border-gray-200">
        <Button className="w-full h-12 bg-[#FF9800] hover:bg-[#F57C00] text-white">
          <Play className="w-5 h-5 mr-2" />
          {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
        </Button>
      </div>
    </div>
  );
}
