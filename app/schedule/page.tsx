"use client";

import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Edit2, Trash2, Video } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';

// Mock data - replace with actual data fetching and state management
interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  type: 'appointment' | 'medication' | 'activity' | 'task' | 'other';
  location?: string;
  description?: string;
  attendees?: string[];
  videoCallLink?: string;
}

const mockEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Doctor Appointment - Dr. Smith',
    startTime: addDays(new Date(), 2).toISOString(),
    endTime: addHours(addDays(new Date(), 2), 1).toISOString(),
    type: 'appointment',
    location: 'City General Hospital, Room 302',
    description: 'Follow-up checkup for recent blood tests.',
  },
  {
    id: '2',
    title: 'Take Morning Medication',
    startTime: setHours(new Date(), 8).toISOString(), // Today at 8 AM
    endTime: setHours(new Date(), 8, 5).toISOString(),
    type: 'medication',
    description: 'Lisinopril 10mg, Metformin 500mg'
  },
  {
    id: '3',
    title: 'Evening Walk',
    startTime: setHours(new Date(), 18).toISOString(), // Today at 6 PM
    endTime: setHours(new Date(), 18, 45).toISOString(),
    type: 'activity',
    location: 'Central Park'
  },
  {
    id: '4',
    title: 'Physical Therapy Session',
    startTime: setHours(addDays(new Date(), -1), 14).toISOString(), // Yesterday at 2 PM
    endTime: setHours(addDays(new Date(), -1), 15).toISOString(),
    type: 'appointment',
    location: 'Restore PT Clinic',
    videoCallLink: 'https://meet.example.com/ptsession'
  },
  {
    id: '5',
    title: 'Submit Insurance Claim',
    startTime: addDays(new Date(), 1).toISOString(), // Tomorrow, all day event (no specific time)
    endTime: addDays(new Date(), 1).toISOString(),
    type: 'task'
  },
];

// Helper function to set hours and minutes on a date
function setHours(date: Date, hours: number, minutes: number = 0, seconds: number = 0, ms: number = 0): Date {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, seconds, ms);
  return newDate;
}

// Helper function to add hours to a date
function addHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}

export default function SchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<ScheduleEvent[]>(mockEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null); // Clear selected event for new entry
    setShowEventModal(true);
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        alert("Event deleted (mock)!");
    }
  };

  const handleSaveEvent = (eventData: Omit<ScheduleEvent, 'id'> & { id?: string }) => {
    if (eventData.id) { // Editing existing event
      setEvents(prev => prev.map(e => e.id === eventData.id ? { ...e, ...eventData } : e));
      alert("Event updated (mock)!");
    } else { // Adding new event
      const newEvent: ScheduleEvent = { ...eventData, id: `evt${Date.now()}` };
      setEvents(prev => [...prev, newEvent]);
      alert("Event added (mock)!");
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const eventsOnSelectedDate = events.filter(event => 
    isSameDay(parseISO(event.startTime), selectedDate)
  );

  const getEventTypeColor = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'appointment': return 'bg-blue-500';
      case 'medication': return 'bg-green-500';
      case 'activity': return 'bg-yellow-500';
      case 'task': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <CalendarDays className="w-8 h-8 mr-3 text-primary-500" /> My Schedule
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your appointments and scheduled activities.</p>
        </div>
        <button 
            onClick={handleAddEvent}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors duration-150"
        >
            <Plus className="w-5 h-5" /> Add New Event
        </button>
      </header>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl flex flex-col lg:flex-row gap-6">
        {/* Calendar View */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
              <div key={dayName} className="py-2 text-center text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
                {dayName}
              </div>
            ))}
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={`p-1.5 sm:p-2 min-h-[6rem] sm:min-h-[7rem] cursor-pointer transition-colors bg-white dark:bg-gray-800 
                           ${!isSameMonth(day, currentMonth) ? 'bg-gray-50 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                           ${isSameDay(day, selectedDate) ? 'ring-2 ring-primary-500 dark:ring-primary-400 z-10 relative' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <span className={`text-xs sm:text-sm font-medium ${isSameDay(day, new Date()) ? 'text-primary-600 dark:text-primary-300 font-bold' : 'text-gray-700 dark:text-gray-200'}`}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 space-y-0.5">
                  {events
                    .filter(event => isSameDay(parseISO(event.startTime), day))
                    .slice(0, 2) // Show max 2 events directly on calendar cell
                    .map(event => (
                      <div key={event.id} className={`px-1 py-0.5 text-xs rounded truncate text-white ${getEventTypeColor(event.type)}`}>
                        {event.title}
                      </div>
                    ))}
                  {events.filter(event => isSameDay(parseISO(event.startTime), day)).length > 2 && (
                     <div className="px-1 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-center">+ more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event List for Selected Date */}
        <div className="lg:w-1/3 lg:border-l lg:pl-6 border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
            Events on {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You have {eventsOnSelectedDate.length} event(s) scheduled.</p>
          {eventsOnSelectedDate.length > 0 ? (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {eventsOnSelectedDate.map(event => (
                <li key={event.id} className={`p-3 rounded-lg shadow-sm border-l-4 ${getEventTypeColor(event.type).replace('bg-', 'border-')}`}>
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">{event.title}</h4>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleEditEvent(event)} title="Edit" className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteEvent(event.id)} title="Delete" className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 
                    {format(parseISO(event.startTime), 'h:mm a')} - {format(parseISO(event.endTime), 'h:mm a')}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {event.location}
                    </p>
                  )}
                  {event.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>}
                  {event.videoCallLink && 
                    <a href={event.videoCallLink} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                        <Video className="w-3.5 h-3.5" /> Join Video Call
                    </a>
                   }
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-center py-10 text-gray-500 dark:text-gray-400">
              No events scheduled for this day.
            </p>
          )}
        </div>
      </div>

      {/* Event Modal (Add/Edit) */}
      {showEventModal && (
        <EventModal 
            event={selectedEvent} 
            onClose={() => { setShowEventModal(false); setSelectedEvent(null); }}
            onSave={handleSaveEvent} 
            selectedDate={selectedDate} 
        />
      )}
    </div>
  );
}

// EventModal Component (could be in its own file)
interface EventModalProps {
  event: ScheduleEvent | null;
  onClose: () => void;
  onSave: (eventData: Omit<ScheduleEvent, 'id'> & { id?: string }) => void;
  selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSave, selectedDate }) => {
    const [title, setTitle] = useState(event?.title || '');
    const [startTime, setStartTime] = useState(event ? format(parseISO(event.startTime), "HH:mm") : '09:00');
    const [endTime, setEndTime] = useState(event ? format(parseISO(event.endTime), "HH:mm") : '10:00');
    const [type, setType] = useState<ScheduleEvent['type']>(event?.type || 'other');
    const [location, setLocation] = useState(event?.location || '');
    const [description, setDescription] = useState(event?.description || '');
    const [videoCallLink, setVideoCallLink] = useState(event?.videoCallLink || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startTime || !endTime) {
            alert("Please fill in Title, Start Time, and End Time.");
            return;
        }
        
        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);

        const finalStartTime = setHours(new Date(selectedDate), startH, startM).toISOString();
        const finalEndTime = setHours(new Date(selectedDate), endH, endM).toISOString();

        onSave({
            id: event?.id,
            title,
            startTime: finalStartTime,
            endTime: finalEndTime,
            type,
            location,
            description,
            videoCallLink
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 opacity-100">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {event ? 'Edit Event' : 'Add New Event'}
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" /> {/* Using ChevronLeft as a close icon for now */}
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="eventTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="eventTitle" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full input-std" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="eventStartTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
                            <input type="time" id="eventStartTime" value={startTime} onChange={e => setStartTime(e.target.value)} required className="mt-1 w-full input-std" />
                        </div>
                        <div>
                            <label htmlFor="eventEndTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
                            <input type="time" id="eventEndTime" value={endTime} onChange={e => setEndTime(e.target.value)} required className="mt-1 w-full input-std" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                        <select id="eventType" value={type} onChange={e => setType(e.target.value as ScheduleEvent['type'])} className="mt-1 w-full input-std">
                            <option value="appointment">Appointment</option>
                            <option value="medication">Medication</option>
                            <option value="activity">Activity</option>
                            <option value="task">Task</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location (Optional)</label>
                        <input type="text" id="eventLocation" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 w-full input-std" />
                    </div>
                    <div>
                        <label htmlFor="eventVideoLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video Call Link (Optional)</label>
                        <input type="url" id="eventVideoLink" value={videoCallLink} onChange={e => setVideoCallLink(e.target.value)} placeholder="https://..." className="mt-1 w-full input-std" />
                    </div>
                    <div>
                        <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                        <textarea id="eventDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 w-full input-std"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
                            {event ? 'Save Changes' : 'Add Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Add a basic style for input-std for demo if not globally defined in globals.css
// You might want to add this to your globals.css instead:
// .input-std {
//   @apply px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors;
// } 