import { useState } from 'react';
import { ArrowLeft, Edit, MoreVertical, Calendar as CalendarIcon, Clock, MapPin, Video, Check, X, Building } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MeetingDetailProps {
  meetingId: string;
  onBack: () => void;
}

const mockMeeting = {
  id: '1',
  title: 'HACCP Protocol Review Meeting',
  description: 'Comprehensive review of the updated HACCP protocol for allergen management. We will discuss the key changes, implementation timeline, and gather feedback from all facility managers.',
  date: 'January 8, 2026',
  startTime: '10:00 AM',
  endTime: '11:30 AM',
  duration: '1 hour 30 minutes',
  isVirtual: true,
  meetingLink: 'https://meet.foodsafer.com/haccp-review',
  agenda: [
    'Welcome and introduction (5 mins)',
    'Overview of FDA guideline updates (15 mins)',
    'New protocol walkthrough (30 mins)',
    'Q&A and feedback session (30 mins)',
    'Implementation timeline and next steps (10 mins)',
  ],
  participants: [
    { 
      id: '1',
      name: 'Dr. Maria Rodriguez', 
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      rsvpStatus: 'Attending'
    },
    { 
      id: '2',
      name: 'James Chen', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      rsvpStatus: 'Attending'
    },
    { 
      id: '3',
      name: 'Sarah Johnson', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rsvpStatus: 'Attending'
    },
    { 
      id: '4',
      name: 'Emily Davis', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      rsvpStatus: 'Virtual'
    },
    { 
      id: '5',
      name: 'Michael Brown', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rsvpStatus: 'Pending'
    },
    { 
      id: '6',
      name: 'Lisa Anderson', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      rsvpStatus: 'Declined'
    },
  ],
  files: [
    { name: 'HACCP_Protocol_Draft_v3.pdf', size: '2.4 MB' },
    { name: 'FDA_Guidelines_Summary.pdf', size: '1.8 MB' },
  ],
};

export function MeetingDetail({ meetingId, onBack }: MeetingDetailProps) {
  const [rsvpStatus, setRsvpStatus] = useState<'Attending' | 'Virtual' | 'InPerson' | 'NotAttending'>('Attending');

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
        <h1 className="mb-4">{mockMeeting.title}</h1>

        {/* Date & Time */}
        <div className="flex items-start gap-3 mb-3">
          <CalendarIcon className="w-5 h-5 text-[#757575] mt-0.5" />
          <div>
            <p className="text-[#212121]">{mockMeeting.date}</p>
            <p className="text-sm text-[#757575]">
              {mockMeeting.startTime} - {mockMeeting.endTime}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5 text-[#757575]" />
          <p className="text-[#212121]">{mockMeeting.duration}</p>
        </div>

        {/* Location/Virtual */}
        <div className="flex items-center gap-3 mb-4">
          {mockMeeting.isVirtual ? (
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
        {mockMeeting.isVirtual && (
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
          {mockMeeting.description}
        </p>
      </div>

      {/* Agenda */}
      <div className="bg-white px-4 py-4 mb-2">
        <h3 className="mb-3">Agenda</h3>
        <ul className="space-y-2">
          {mockMeeting.agenda.map((item, index) => (
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
        <h3 className="mb-3">Participants ({mockMeeting.participants.length})</h3>
        <div className="space-y-3">
          {mockMeeting.participants.map((participant) => (
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
          {mockMeeting.files.map((file, index) => (
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
