import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, MoreVertical, Calendar as CalendarIcon, Clock, MapPin, Video, Check, X, Building, Loader2, Users } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { api } from '@/api';

interface MeetingDetailProps {
  meetingId: string;
  onBack: () => void;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  isVirtual: boolean;
  meetingLink: string;
  agenda: string[];
  participants: { id: string; name: string; avatar: string; rsvpStatus: string }[];
  files: { name: string; size: string }[];
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
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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

function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  if (hours > 0 && mins > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${mins} minutes`;
}

function mapMeeting(m: any): Meeting {
  const participants = (m.participants || m.attendees || []).map((p: any) => {
    const user = p.user || p;
    const avatar = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE}${user.avatar}`) : '';
    return {
      id: user.id || p.userId,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Participant',
      avatar,
      rsvpStatus: p.rsvpStatus || p.status || 'Pending',
    };
  });

  const files = (m.attachments || m.files || []).map((f: any) => ({
    name: f.name || f.filename || 'File',
    size: f.size ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : '',
  }));

  return {
    id: m.id,
    title: m.title || m.name || 'Untitled Meeting',
    description: m.description || m.content || '',
    date: formatMeetingDate(m.startDate || m.date),
    startTime: formatTime(m.startDate || m.startTime),
    endTime: formatTime(m.endDate || m.endTime),
    duration: calculateDuration(m.startDate, m.endDate) || m.duration || '',
    isVirtual: m.isVirtual ?? m.isOnline ?? true,
    meetingLink: m.meetingLink || m.link || '',
    agenda: m.agenda || [],
    participants,
    files,
  };
}

export function MeetingDetail({ meetingId, onBack }: MeetingDetailProps) {
  const [rsvpStatus, setRsvpStatus] = useState<'Attending' | 'Virtual' | 'InPerson' | 'NotAttending'>('Attending');
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeeting();
  }, [meetingId]);

  const fetchMeeting = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<any>(`/queries/meetings/${meetingId}`);
      setMeeting(mapMeeting(data));
    } catch (err) {
      console.error('Failed to load meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting');
    } finally {
      setIsLoading(false);
    }
  };

  const getRsvpColor = (status: string) => {
    switch (status) {
      case 'Attending':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Virtual':
        return 'bg-[#E3F2FD] text-[#2196F3]';
      case 'Pending':
        return 'bg-[#FFF3E0] text-[#FF9800]';
      case 'Declined':
        return 'bg-[#FFEBEE] text-[#D32F2F]';
      default:
        return 'bg-[#F5F5F5] text-[#757575]';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2E7D32]" />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center px-4 h-14">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
            <h2 className="ml-3">Meeting</h2>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-600">{error || 'Meeting not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-6 h-6 text-[#757575]" />
            </button>
            <h2>Meeting</h2>
          </div>
          <div className="flex items-center gap-3">
            <button>
              <Edit className="w-6 h-6 text-[#757575]" />
            </button>
            <button>
              <MoreVertical className="w-6 h-6 text-[#757575]" />
            </button>
          </div>
        </div>
      </header>

      {/* Meeting Info Card */}
      <div className="bg-white px-4 py-4 mb-2">
        <h1 className="mb-4">{meeting.title}</h1>

        {/* Date & Time */}
        <div className="flex items-start gap-3 mb-3">
          <CalendarIcon className="w-5 h-5 text-[#757575] mt-0.5" />
          <div>
            <p className="text-[#212121]">{meeting.date}</p>
            <p className="text-sm text-[#757575]">
              {meeting.startTime} - {meeting.endTime}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-[#757575]" />
          <p className="text-[#212121]">{meeting.duration}</p>
        </div>

        {/* Location/Virtual */}
        <div className="flex items-center gap-3 mb-4">
          {meeting.isVirtual ? (
            <>
              <Video className="w-5 h-5 text-[#2196F3]" />
              <p className="text-[#2196F3]">Virtual Meeting</p>
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5 text-[#757575]" />
              <p className="text-[#212121]">Conference Room A</p>
            </>
          )}
        </div>

        {/* Join Meeting Button */}
        {meeting.isVirtual && (
          <Button className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] mb-4">
            <Video className="w-5 h-5 mr-2" />
            Join Meeting
          </Button>
        )}
      </div>

      {/* Description */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="mb-2">Description</h3>
        <p className="text-[#212121] leading-relaxed">
          {meeting.description}
        </p>
      </div>

      {/* Agenda */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="mb-3">Agenda</h3>
        <ul className="space-y-2">
          {meeting.agenda.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                {index + 1}
              </span>
              <p className="text-[#212121] pt-0.5">{item}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* RSVP Section */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="mb-3">Your Response</h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setRsvpStatus('Attending')}
            className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 ${
              rsvpStatus === 'Attending'
                ? 'border-[#2E7D32] bg-[#E8F5E9]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Check className={`w-5 h-5 mb-1 ${rsvpStatus === 'Attending' ? 'text-[#2E7D32]' : 'text-[#757575]'}`} />
            <span className={`text-xs ${rsvpStatus === 'Attending' ? 'text-[#2E7D32]' : 'text-[#757575]'}`}>
              Yes
            </span>
          </button>
          <button
            onClick={() => setRsvpStatus('Virtual')}
            className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 ${
              rsvpStatus === 'Virtual'
                ? 'border-[#2196F3] bg-[#E3F2FD]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Video className={`w-5 h-5 mb-1 ${rsvpStatus === 'Virtual' ? 'text-[#2196F3]' : 'text-[#757575]'}`} />
            <span className={`text-xs ${rsvpStatus === 'Virtual' ? 'text-[#2196F3]' : 'text-[#757575]'}`}>
              Virtual
            </span>
          </button>
          <button
            onClick={() => setRsvpStatus('InPerson')}
            className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 ${
              rsvpStatus === 'InPerson'
                ? 'border-[#2E7D32] bg-[#E8F5E9]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Building className={`w-5 h-5 mb-1 ${rsvpStatus === 'InPerson' ? 'text-[#2E7D32]' : 'text-[#757575]'}`} />
            <span className={`text-xs ${rsvpStatus === 'InPerson' ? 'text-[#2E7D32]' : 'text-[#757575]'}`}>
              In-Person
            </span>
          </button>
          <button
            onClick={() => setRsvpStatus('NotAttending')}
            className={`flex flex-col items-center justify-center py-3 rounded-lg border-2 ${
              rsvpStatus === 'NotAttending'
                ? 'border-[#D32F2F] bg-[#FFEBEE]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <X className={`w-5 h-5 mb-1 ${rsvpStatus === 'NotAttending' ? 'text-[#D32F2F]' : 'text-[#757575]'}`} />
            <span className={`text-xs ${rsvpStatus === 'NotAttending' ? 'text-[#D32F2F]' : 'text-[#757575]'}`}>
              No
            </span>
          </button>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="mb-3">Participants ({meeting.participants.length})</h3>
        <div className="space-y-3">
          {meeting.participants.map((participant) => (
            <div key={participant.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                </Avatar>
                <h4>{participant.name}</h4>
              </div>
              <Badge variant="secondary" className={`${getRsvpColor(participant.rsvpStatus)} text-xs`}>
                {participant.rsvpStatus}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Files */}
      <div className="bg-white px-4 py-4 mb-20">
        <h3 className="mb-3">Files</h3>
        <div className="space-y-2">
          {meeting.files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-lg">
              <div className="w-10 h-10 bg-[#D32F2F] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">PDF</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{file.name}</p>
                <p className="text-xs text-[#757575]">{file.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add to Calendar Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <Button variant="outline" className="w-full h-12 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9]">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
}
