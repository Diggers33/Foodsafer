import { useState } from 'react';
import { Calendar as CalendarIcon, Plus, List, Video, MapPin, Users as UsersIcon } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { MeetingDetail } from './MeetingDetail';

interface WorkspaceMeetingsProps {
  workspaceId: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isVirtual: boolean;
  location?: string;
  participants: { avatar: string; name: string }[];
  totalParticipants: number;
  rsvpStatus: 'Attending' | 'Pending' | 'Declined';
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'HACCP Protocol Review Meeting',
    date: 'Jan 8, 2026',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    isVirtual: true,
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', name: 'Sarah' },
      { avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', name: 'Maria' },
      { avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', name: 'James' },
    ],
    totalParticipants: 12,
    rsvpStatus: 'Attending',
  },
  {
    id: '2',
    title: 'Q1 Compliance Audit Preparation',
    date: 'Jan 10, 2026',
    startTime: '2:00 PM',
    endTime: '3:00 PM',
    isVirtual: false,
    location: 'Conference Room A',
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', name: 'Emily' },
      { avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', name: 'Michael' },
    ],
    totalParticipants: 8,
    rsvpStatus: 'Pending',
  },
  {
    id: '3',
    title: 'Monthly Team Sync',
    date: 'Jan 15, 2026',
    startTime: '9:00 AM',
    endTime: '10:00 AM',
    isVirtual: true,
    participants: [
      { avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', name: 'Sarah' },
      { avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', name: 'Maria' },
    ],
    totalParticipants: 24,
    rsvpStatus: 'Attending',
  },
];

export function WorkspaceMeetings({ workspaceId }: WorkspaceMeetingsProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);

  if (selectedMeeting) {
    return <MeetingDetail meetingId={selectedMeeting} onBack={() => setSelectedMeeting(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Filter Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'calendar')}>
          <TabsList className="w-full grid grid-cols-2 bg-[#F5F5F5]">
            <TabsTrigger 
              value="list" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32] flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#2E7D32] flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* List View */}
      {view === 'list' && (
        <div className="px-4 py-4">
          {/* Upcoming Section */}
          <div className="mb-6">
            <h3 className="mb-3">Upcoming</h3>
            <div className="space-y-3">
              {mockMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onClick={() => setSelectedMeeting(meeting.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="px-4 py-4">
          {/* Month Selector */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3>January 2026</h3>
              <button className="text-[#2E7D32]">Today</button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-center text-xs text-[#757575] py-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const hasMeeting = [8, 10, 15].includes(day);
                const isToday = day === 5;
                return (
                  <button
                    key={i}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                      day < 1 || day > 31
                        ? 'text-[#BDBDBD]'
                        : isToday
                        ? 'bg-[#2E7D32] text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {day > 0 && day <= 31 && day}
                    {hasMeeting && !isToday && (
                      <span className="absolute bottom-1 w-1 h-1 bg-[#2E7D32] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Meetings */}
          <div>
            <h3 className="mb-3">January 5, 2026</h3>
            <div className="space-y-3">
              {mockMeetings.slice(0, 1).map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onClick={() => setSelectedMeeting(meeting.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#1B5E20] rounded-full shadow-lg flex items-center justify-center z-40">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

function MeetingCard({ meeting, onClick }: { meeting: Meeting; onClick: () => void }) {
  const getRsvpColor = (status: string) => {
    switch (status) {
      case 'Attending':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Pending':
        return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'Declined':
        return 'bg-[#FFEBEE] text-[#D32F2F]';
      default:
        return 'bg-[#F5F5F5] text-[#757575]';
    }
  };

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Time */}
      <div className="flex items-center gap-2 mb-2">
        <CalendarIcon className="w-4 h-4 text-[#757575]" />
        <span className="text-sm text-[#757575]">{meeting.date}</span>
        <span className="text-sm text-[#757575]">
          {meeting.startTime} - {meeting.endTime}
        </span>
      </div>

      {/* Title */}
      <h4 className="mb-2">{meeting.title}</h4>

      {/* Location/Virtual */}
      <div className="flex items-center gap-2 mb-3">
        {meeting.isVirtual ? (
          <>
            <Video className="w-4 h-4 text-[#2196F3]" />
            <span className="text-sm text-[#2196F3]">Virtual Meeting</span>
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 text-[#757575]" />
            <span className="text-sm text-[#757575]">{meeting.location}</span>
          </>
        )}
      </div>

      {/* Participants and RSVP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-2">
            {meeting.participants.map((participant, index) => (
              <Avatar key={index} className="w-6 h-6 border-2 border-white">
                <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
              </Avatar>
            ))}
          </div>
          <span className="text-xs text-[#757575]">
            +{meeting.totalParticipants - meeting.participants.length} more
          </span>
        </div>
        <Badge variant="secondary" className={`${getRsvpColor(meeting.rsvpStatus)} text-xs`}>
          {meeting.rsvpStatus}
        </Badge>
      </div>
    </article>
  );
}
