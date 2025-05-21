"use client";

import React, { useState, useMemo } from 'react';
import { ListChecks, Users, Filter, Search, Calendar, ArrowDownUp, Clock, Edit3, Trash2, TrendingUp, Zap, Flame, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Mock data - replace with actual data fetching and state management
interface ActivityLogEntry {
  id: string;
  type: 'workout' | 'run' | 'walk' | 'swim' | 'cycle' | 'sport' | 'other';
  title: string;
  date: string; // ISO string
  duration?: string; // e.g., "45 min", "1.5 hours"
  distance?: string; // e.g., "5 km", "3 miles"
  intensity?: 'low' | 'moderate' | 'high';
  caloriesBurned?: number;
  notes?: string;
}

const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'log1',
    type: 'run',
    title: 'Morning Jog',
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
    duration: '30 min',
    distance: '5 km',
    intensity: 'moderate',
    caloriesBurned: 300,
    notes: 'Felt good, consistent pace.'
  },
  {
    id: 'log2',
    type: 'workout',
    title: 'Strength Training - Full Body',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    duration: '1 hour',
    intensity: 'high',
    caloriesBurned: 450,
    notes: 'Focused on compound lifts.'
  },
  {
    id: 'log3',
    type: 'walk',
    title: 'Evening Stroll',
    date: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
    duration: '45 min',
    distance: '3 km',
    intensity: 'low',
    caloriesBurned: 150,
  },
   {
    id: 'log4',
    type: 'cycle',
    title: 'Weekend Bike Ride',
    date: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
    duration: '2 hours',
    distance: '30 km',
    intensity: 'moderate',
    caloriesBurned: 700,
    notes: 'Scenic route by the lake.'
  },
  {
    id: 'log5',
    type: 'swim',
    title: 'Pool Session',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    duration: '40 min',
    distance: '1500 m',
    intensity: 'high',
    caloriesBurned: 400,
  }
];

const activityTypeIcons: Record<ActivityLogEntry['type'], React.ElementType> = {
    workout: Flame,
    run: TrendingUp,
    walk: Users, // Using Users as a placeholder for walking/steps type icon
    swim: Zap, // Placeholder
    cycle: Zap, // Placeholder
    sport: Zap, // Placeholder
    other: ListChecks,
};

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>(mockActivityLog);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'date_asc' | 'duration_desc' | 'duration_asc'>('date_desc');
  
  // Add/Edit Modal State (Simplified for brevity - ideally a separate component)
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityLogEntry | null>(null);
  const [formData, setFormData] = useState<Partial<ActivityLogEntry>>({});

  const filteredAndSortedActivities = useMemo(() => {
    let result = activities;
    if (searchTerm) {
      result = result.filter(act => act.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterType !== 'all') {
      result = result.filter(act => act.type === filterType);
    }
    // Sorting logic (simplified)
    result.sort((a, b) => {
        if (sortOrder === 'date_desc') return parseISO(b.date).getTime() - parseISO(a.date).getTime();
        if (sortOrder === 'date_asc') return parseISO(a.date).getTime() - parseISO(b.date).getTime();
        // Add more sorting options if needed (e.g. duration - requires parsing duration string)
        return 0;
    });
    return result;
  }, [activities, searchTerm, filterType, sortOrder]);
  
  const handleOpenModal = (activity?: ActivityLogEntry) => {
    setEditingActivity(activity || null);
    setFormData(activity || { type: 'other', date: new Date().toISOString().split('T')[0]});
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingActivity(null);
    setFormData({});
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.date) {
        alert("Please fill in Title, Type, and Date.");
        return;
    }
    if (editingActivity) {
        setActivities(prev => prev.map(act => act.id === editingActivity.id ? { ...act, ...formData } as ActivityLogEntry : act));
        alert("Activity updated (mock)!");
    } else {
        const newActivity: ActivityLogEntry = { 
            id: `log${Date.now()}`,
            ...formData 
        } as ActivityLogEntry; // Type assertion, ensure all required fields are there
        setActivities(prev => [newActivity, ...prev]);
        alert("Activity added (mock)!");
    }
    handleCloseModal();
  };
  
  const handleDeleteActivity = (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")){
        setActivities(prev => prev.filter(act => act.id !== id));
        alert("Activity deleted (mock)!");
    }
  };

  const uniqueActivityTypes = useMemo(() => 
    ['all', ...Array.from(new Set(mockActivityLog.map(act => act.type)))]
  , []);

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <ListChecks className="w-8 h-8 mr-3 text-primary-500" /> Activity Log
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View, manage, and add your logged activities.</p>
      </header>

      {/* Filters and Actions */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
                <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                    type="text" 
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
            </div>
            <div className="relative w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full appearance-none pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                >
                    {uniqueActivityTypes.map(type => (
                        <option key={type} value={type} className="capitalize">{type === 'all' ? 'All Types' : type}</option>
                    ))}
                </select>
            </div>
            <div className="relative w-full sm:w-auto">
                <ArrowDownUp className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                    className="w-full appearance-none pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                >
                    <option value="date_desc">Date (Newest First)</option>
                    <option value="date_asc">Date (Oldest First)</option>
                    {/* <option value="duration_desc">Duration (Longest First)</option> */}
                    {/* <option value="duration_asc">Duration (Shortest First)</option> */}
                </select>
            </div>
        </div>
        <button 
            onClick={() => handleOpenModal()} 
            className="w-full sm:w-auto mt-3 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
            <Plus className="w-5 h-5" /> Add Activity
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {filteredAndSortedActivities.length > 0 ? (
          filteredAndSortedActivities.map(activity => {
            const IconComponent = activityTypeIcons[activity.type] || ListChecks;
            return (
            <div key={activity.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <IconComponent className="w-7 h-7 mr-3 text-primary-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {activity.type} • {format(parseISO(activity.date), 'EEE, MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0 self-start sm:self-center">
                    <button onClick={() => handleOpenModal(activity)} className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-md transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteActivity(activity.id)} className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                {activity.duration && <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300"><Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"/> <strong>Duration:</strong> {activity.duration}</div>}
                {activity.distance && <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300"><TrendingUp className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"/> <strong>Distance:</strong> {activity.distance}</div>}
                {activity.intensity && <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 capitalize"><Zap className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"/> <strong>Intensity:</strong> {activity.intensity}</div>}
                {activity.caloriesBurned && <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300"><Flame className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"/> <strong>Calories:</strong> {activity.caloriesBurned} kcal</div>}
              </div>
              {activity.notes && <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md"><strong>Notes:</strong> {activity.notes}</p>}
            </div>
          )}) 
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <ListChecks className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No activities found matching your criteria.</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters, or add a new activity.</p>
          </div>
        )}
      </div>
      
      {/* Add/Edit Modal - Simplified */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
                    {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                </h2>
                <form onSubmit={handleSaveActivity} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="label-std">Title</label>
                        <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleFormChange} required className="input-std" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="label-std">Date</label>
                            <input type="date" name="date" id="date" value={formData.date ? format(parseISO(formData.date), 'yyyy-MM-dd') : ''} onChange={handleFormChange} required className="input-std" />
                        </div>
                        <div>
                            <label htmlFor="type" className="label-std">Type</label>
                            <select name="type" id="type" value={formData.type || 'other'} onChange={handleFormChange} className="input-std">
                                {Object.keys(activityTypeIcons).map(typeKey => (
                                    <option key={typeKey} value={typeKey} className="capitalize">{typeKey}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="duration" className="label-std">Duration (e.g., 45 min)</label>
                            <input type="text" name="duration" id="duration" value={formData.duration || ''} onChange={handleFormChange} className="input-std" />
                        </div>
                        <div>
                            <label htmlFor="distance" className="label-std">Distance (e.g., 5 km)</label>
                            <input type="text" name="distance" id="distance" value={formData.distance || ''} onChange={handleFormChange} className="input-std" />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="intensity" className="label-std">Intensity</label>
                            <select name="intensity" id="intensity" value={formData.intensity || 'moderate'} onChange={handleFormChange} className="input-std">
                                <option value="low">Low</option>
                                <option value="moderate">Moderate</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="caloriesBurned" className="label-std">Calories Burned (kcal)</label>
                            <input type="number" name="caloriesBurned" id="caloriesBurned" value={formData.caloriesBurned || ''} onChange={handleFormChange} className="input-std" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="notes" className="label-std">Notes</label>
                        <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleFormChange} rows={3} className="input-std"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCloseModal} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            {editingActivity ? 'Save Changes' : 'Add Activity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
       {/* Define .label-std and .input-std, .btn-primary, .btn-secondary in globals.css or here for demo */}
       <style jsx global>{`
        .label-std {
            display: block;
            margin-bottom: 0.25rem;
            font-size: 0.875rem; /* text-sm */
            font-weight: 500; /* font-medium */
            color: #374151; /* text-gray-700 */
        }
        .dark .label-std {
            color: #D1D5DB; /* dark:text-gray-300 */
        }
        .input-std {
            width: 100%;
            padding: 0.625rem 0.75rem; /* px-3 py-2.5 */
            background-color: #F9FAFB; /* bg-gray-50 */
            border: 1px solid #D1D5DB; /* border-gray-300 */
            border-radius: 0.5rem; /* rounded-lg */
            font-size: 0.875rem; /* text-sm */
            outline: none;
            transition: all 0.2s;
        }
        .dark .input-std {
            background-color: rgba(55, 65, 81, 0.6); /* dark:bg-gray-700/60 */
            border-color: #4B5563; /* dark:border-gray-600 */
            color: #F3F4F6; /* dark:text-gray-100 */
        }
        .input-std:focus {
            box-shadow: 0 0 0 1px #2563EB; /* focus:ring-1 focus:ring-primary-500 */
            border-color: #2563EB; /* focus:border-primary-500 */
        }
        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem; /* px-4 py-2 */
            background-color: #2563EB; /* bg-primary-600 */
            color: white;
            border-radius: 0.5rem; /* rounded-lg */
            box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); /* shadow-md */
            font-size: 0.875rem; /* text-sm */
            font-weight: 500; /* font-medium */
            transition: background-color 0.15s ease-in-out;
        }
        .btn-primary:hover {
            background-color: #1D4ED8; /* hover:bg-primary-700 */
        }
        .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem; /* px-4 py-2 */
            background-color: #F3F4F6; /* bg-gray-100 */
            color: #374151; /* text-gray-700 */
            border-radius: 0.5rem; /* rounded-lg */
            font-size: 0.875rem; /* text-sm */
            font-weight: 500; /* font-medium */
            transition: background-color 0.15s ease-in-out;
        }
        .dark .btn-secondary {
             background-color: #4B5563; /* dark:bg-gray-700 */
             color: #D1D5DB; /* dark:text-gray-300 */
        }
        .btn-secondary:hover {
            background-color: #E5E7EB; /* hover:bg-gray-200 */
        }
         .dark .btn-secondary:hover {
            background-color: #374151; /* dark:hover:bg-gray-600 */
        }
      `}</style>
    </div>
  );
} 