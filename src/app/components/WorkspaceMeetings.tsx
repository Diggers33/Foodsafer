import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, List, Video, MapPin, Users as UsersIcon, Loader2 } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { MeetingDetail } from './MeetingDetail';
import { api } from '@/api';

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

const API_BASE = 'https://test.foodsafer.com/api';

function formatMeetingDate(dateString: string): string {
  if (!dateString) return '';
  let date: Date;
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    date = new Date(`${year}-${month}-${day}`);
  } else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateString: string): string {
  if (!dateString) return '';
  let date: Date;
  const ddmmyyyyMatch = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year, hour, min, sec] = ddmmyyyyMatch;
    date = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
  } else {
    date = new Date(dateString);
  }
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function mapMeeting(m: any): Meeting {
  const participants = (m.participants || m.attendees || []).slice(0, 3).map((p: any) => {
    const user = p.user || p;
    return {
      avatar: user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : '',
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Participant',
    };
  });

  return {
    id: m.id,
    title: m.title || m.name || 'Untitled Meeting',
    date: formatMeetingDate(m.startDate || m.date || m.createdAt),
    startTime: formatTime(m.startDate || m.startTime) || '',
    endTime: formatTime(m.endDate || m.endTime) || '',
    isVirtual: m.isVirtual ?? m.isOnline ?? true,
    location: m.location || m.address || '',
    participants,
    totalParticipants: m.participantsCount || m.numParticipants || participants.length,
    rsvpStatus: m.rsvpStatus || 'Pending',
  };
}

export function WorkspaceMeetings({ workspaceId }: WorkspaceMeetingsProps) {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, [workspaceId]);

  const fetchMeetings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get meetings for a wide date range (1 year back to 1 year forward)
      const now = Date.now();
      const yearMs = 365 * 24 * 60 * 60 * 1000;
      const startDate = now - yearMs;
      const endDate = now + yearMs;
      const data = await api.get<any[]>(`/queries/workspaces/${workspaceId}/meetings/${startDate}/${endDate}`);
      const meetingsArray = Array.isArray(data) ? data : [];
      setMeetings(meetingsArray.map(mapMeeting));
    } catch (err) {
      console.error('Failed to load meetings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedMeeting) {
    return <MeetingDetail meetingId={selectedMeeting} onBack={() => setSelectedMeeting(null)} />;
  }

  return (
    <div className="bg-[#F5F5F5]">
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#2E7D32]" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : meetings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#757575]">No meetings scheduled</p>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="mb-3">Meetings</h3>
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onClick={() => setSelectedMeeting(meeting.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="px-4 py-4">
          <div className="text-center py-8">
            <p className="text-[#757575]">Calendar view coming soon</p>
            <button onClick={() => setView('list')} className="text-[#2E7D32] mt-2">View as list</button>
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
