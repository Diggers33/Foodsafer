import { ArrowLeft, Share2, Bookmark, Clock, Users, Star, Award, BookOpen, Play, CheckCircle, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

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

const mockCourseData: Record<string, CourseData> = {
  '1': {
    id: '1',
    title: 'HACCP Fundamentals Certification',
    description: 'Complete certification course covering all seven principles of HACCP. Learn to identify hazards, establish critical control points, and implement effective food safety management systems.',
    instructor: {
      name: 'Dr. Maria Rodriguez',
      title: 'Food Safety Expert',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    },
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    duration: '8 hours',
    students: 2456,
    rating: 4.9,
    level: 'Beginner',
    lessons: 24,
    certified: true,
    progress: 0,
    modules: [
      {
        id: '1',
        title: 'Introduction to HACCP',
        lessons: [
          { id: '1-1', title: 'What is HACCP?', duration: '12 min', completed: false, locked: false },
          { id: '1-2', title: 'History and Development', duration: '10 min', completed: false, locked: false },
          { id: '1-3', title: 'HACCP Regulations', duration: '15 min', completed: false, locked: false },
        ],
      },
      {
        id: '2',
        title: 'The Seven Principles',
        lessons: [
          { id: '2-1', title: 'Principle 1: Hazard Analysis', duration: '20 min', completed: false, locked: true },
          { id: '2-2', title: 'Principle 2: Critical Control Points', duration: '18 min', completed: false, locked: true },
          { id: '2-3', title: 'Principle 3: Critical Limits', duration: '15 min', completed: false, locked: true },
          { id: '2-4', title: 'Principle 4: Monitoring', duration: '16 min', completed: false, locked: true },
          { id: '2-5', title: 'Principle 5: Corrective Actions', duration: '14 min', completed: false, locked: true },
          { id: '2-6', title: 'Principle 6: Verification', duration: '17 min', completed: false, locked: true },
          { id: '2-7', title: 'Principle 7: Record Keeping', duration: '13 min', completed: false, locked: true },
        ],
      },
      {
        id: '3',
        title: 'Practical Implementation',
        lessons: [
          { id: '3-1', title: 'Building Your HACCP Team', duration: '15 min', completed: false, locked: true },
          { id: '3-2', title: 'Product Description', duration: '12 min', completed: false, locked: true },
          { id: '3-3', title: 'Process Flow Diagrams', duration: '18 min', completed: false, locked: true },
          { id: '3-4', title: 'Case Study: Dairy Processing', duration: '25 min', completed: false, locked: true },
        ],
      },
    ],
  },
};

export function TrainingDetail({ courseId, onBack }: { courseId: string; onBack: () => void }) {
  const [isSaved, setIsSaved] = useState(false);
  const course = mockCourseData[courseId] || mockCourseData['1'];

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
      <div className="relative h-48 bg-gray-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-[#FF9800] ml-1" fill="#FF9800" />
          </div>
        </div>
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
