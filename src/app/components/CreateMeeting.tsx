import { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Link as LinkIcon } from 'lucide-react';
import { Avatar } from './ui/avatar';

interface CreateMeetingProps {
  onClose: () => void;
  workspaceId: string;
}

export function CreateMeeting({ onClose }: CreateMeetingProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingType, setMeetingType] = useState<'in-person' | 'virtual' | 'hybrid'>('virtual');

  const handleCreate = () => {
    const meetingData = {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      meetingLink,
      meetingType,
      timestamp: new Date().toISOString(),
    };
    console.log('Creating meeting:', meetingData);
    // In a real app, this would save to the backend
    onClose();
  };

  const isValid = title.trim() && date && startTime && endTime;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={onClose}>
            <X className="w-6 h-6 text-[#212121]" />
          </button>
          <h1>Schedule Meeting</h1>
          <button 
            onClick={handleCreate}
            className="text-[#36B9D0] font-semibold disabled:text-[#BDBDBD] disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            Create
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {/* User Info */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-10 h-10">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" alt="You" className="w-full h-full object-cover" />
            </Avatar>
            <div>
              <h4>You</h4>
              <p className="text-sm text-[#757575]">Organizing a meeting</p>
            </div>
          </div>

          {/* Meeting Type */}
          <div className="mb-4">
            <label className="text-sm text-[#757575] mb-2 block">Meeting Type</label>
            <div className="flex gap-2">
              {(['in-person', 'virtual', 'hybrid'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMeetingType(type)}
                  className={`flex-1 px-3 py-2 text-sm rounded border ${
                    meetingType === type
                      ? 'bg-[#36B9D0] text-white border-[#36B9D0]'
                      : 'border-gray-300 text-[#757575]'
                  }`}
                >
                  {type === 'in-person' ? 'In-Person' : type === 'virtual' ? 'Virtual' : 'Hybrid'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-sm text-[#757575] mb-2 block">Meeting Title</label>
            <input
              type="text"
              placeholder="e.g., HACCP Review Meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              autoFocus
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="text-sm text-[#757575] mb-2 block flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
            />
          </div>

          {/* Time Range */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#757575] mb-2 block flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              />
            </div>
            <div>
              <label className="text-sm text-[#757575] mb-2 block">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              />
            </div>
          </div>

          {/* Location (for in-person or hybrid) */}
          {(meetingType === 'in-person' || meetingType === 'hybrid') && (
            <div className="mb-4">
              <label className="text-sm text-[#757575] mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Conference Room A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              />
            </div>
          )}

          {/* Meeting Link (for virtual or hybrid) */}
          {(meetingType === 'virtual' || meetingType === 'hybrid') && (
            <div className="mb-4">
              <label className="text-sm text-[#757575] mb-2 block flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Meeting Link
              </label>
              <input
                type="url"
                placeholder="e.g., https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#36B9D0]"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-4">
            <label className="text-sm text-[#757575] mb-2 block">Description (Optional)</label>
            <textarea
              placeholder="Add agenda or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:border-[#36B9D0]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
