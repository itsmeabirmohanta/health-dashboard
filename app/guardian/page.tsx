"use client";

import { useState, useEffect } from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { MonitoredUser, UserNote, MetricType } from "@/app/types/health";
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  Heart, 
  Droplets, 
  Activity, 
  Moon, 
  Thermometer, 
  Scale,
  MessageSquare,
  PlusCircle,
  UserCheck
} from "lucide-react";

// Mock data for guardian mode
const MOCK_FAMILY_MEMBERS: MonitoredUser[] = [
  {
    id: "f1",
    name: "Mom (Sarah)",
    relationship: "parent",
    avatar: "/avatars/family1.png",
    lastUpdated: new Date(Date.now() - 35 * 60 * 1000), // 35 mins ago
    overallStatus: "healthy",
    metrics: {
      heartRate: { value: 68, unit: "bpm", timestamp: Date.now() - 35 * 60 * 1000, change: -2 },
      bloodOxygen: { value: 97, unit: "%", timestamp: Date.now() - 35 * 60 * 1000, change: 0 },
      steps: { value: 7230, timestamp: Date.now() - 35 * 60 * 1000, change: 5 },
    },
    notes: [
      {
        id: "n1",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        text: "Morning walk completed, feeling great today!",
        author: "Sarah",
        metric: "steps"
      }
    ],
    alerts: 0
  },
  {
    id: "f2",
    name: "Dad (Michael)",
    relationship: "parent",
    avatar: "/avatars/family2.png",
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    overallStatus: "caution",
    metrics: {
      heartRate: { value: 82, unit: "bpm", timestamp: Date.now() - 2 * 60 * 60 * 1000, change: 8 },
      bloodOxygen: { value: 95, unit: "%", timestamp: Date.now() - 2 * 60 * 60 * 1000, change: -1 },
      steps: { value: 3200, timestamp: Date.now() - 2 * 60 * 60 * 1000, change: -20 },
    },
    notes: [
      {
        id: "n2",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        text: "Feeling a bit tired today, will rest more",
        author: "Michael",
        metric: "heartRate"
      }
    ],
    alerts: 1
  },
  {
    id: "f3",
    name: "Grandma (Elizabeth)",
    relationship: "parent",
    avatar: "/avatars/family3.png",
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    overallStatus: "warning",
    metrics: {
      heartRate: { value: 78, unit: "bpm", timestamp: Date.now() - 4 * 60 * 60 * 1000, change: 5 },
      bloodOxygen: { value: 93, unit: "%", timestamp: Date.now() - 4 * 60 * 60 * 1000, change: -3 },
      steps: { value: 1500, timestamp: Date.now() - 4 * 60 * 60 * 1000, change: -10 },
    },
    notes: [
      {
        id: "n3",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        text: "Taking medication as prescribed, but feeling short of breath",
        author: "Elizabeth",
        metric: "bloodOxygen"
      }
    ],
    alerts: 2
  },
  {
    id: "f4",
    name: "Brother (Alex)",
    relationship: "other",
    avatar: "/avatars/family4.png",
    lastUpdated: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
    overallStatus: "healthy",
    metrics: {
      heartRate: { value: 65, unit: "bpm", timestamp: Date.now() - 25 * 60 * 1000, change: -5 },
      bloodOxygen: { value: 99, unit: "%", timestamp: Date.now() - 25 * 60 * 1000, change: 1 },
      steps: { value: 12500, timestamp: Date.now() - 25 * 60 * 1000, change: 30 },
    },
    notes: [
      {
        id: "n4",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        text: "Just finished a 5k run, new personal best!",
        author: "Alex",
        metric: "steps"
      }
    ],
    alerts: 0
  }
];

export default function GuardianPage() {
  const [familyMembers, setFamilyMembers] = useState<MonitoredUser[]>(MOCK_FAMILY_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<MonitoredUser | null>(null);
  const [newNote, setNewNote] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<MetricType | undefined>(undefined);

  // Initial setup
  useEffect(() => {
    // Set default selected family member
    if (familyMembers.length > 0) {
      setSelectedMember(familyMembers[0]);
    }
  }, [familyMembers]);

  // Add a new note to the selected family member
  const addNote = () => {
    if (!selectedMember || !newNote.trim()) return;
    
    const newNoteObj: UserNote = {
      id: `n${Date.now()}`,
      timestamp: new Date(),
      text: newNote,
      author: "You",
      metric: selectedMetric
    };
    
    const updatedMembers = familyMembers.map(member => {
      if (member.id === selectedMember.id) {
        return {
          ...member,
          notes: [newNoteObj, ...member.notes]
        };
      }
      return member;
    });
    
    setFamilyMembers(updatedMembers);
    setSelectedMember(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: [newNoteObj, ...prev.notes]
      };
    });
    
    setNewNote("");
    setSelectedMetric(undefined);
  };

  // Get status color based on family member's overall status
  const getStatusColor = (status: 'healthy' | 'caution' | 'warning' | 'critical') => {
    switch(status) {
      case 'healthy': return 'bg-green-500';
      case 'caution': return 'bg-amber-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
    }
  };

  // Get metric icon based on metric type
  const getMetricIcon = (type: MetricType | undefined) => {
    switch(type) {
      case 'heartRate': return <Heart className="w-5 h-5 text-red-500" />;
      case 'bloodOxygen': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'steps': return <Activity className="w-5 h-5 text-green-500" />;
      case 'sleep': return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'temperature': return <Thermometer className="w-5 h-5 text-amber-500" />;
      case 'weight': return <Scale className="w-5 h-5 text-purple-500" />;
      default: return null;
    }
  };

  // Format time difference for last updated
  const formatTimeDiff = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / (1000 * 60));
    
    if (mins < 60) return `${mins}m`;
    if (mins < 24 * 60) return `${Math.floor(mins / 60)}h`;
    return `${Math.floor(mins / (60 * 24))}d`;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCheck className="w-7 h-7 text-red-500" />
          Guardian Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and track your family members' health metrics
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Family Members List */}
        <div className="lg:w-1/3">
          <div className="glass rounded-2xl shadow-sm p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <span>Family Members</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {familyMembers.length} members
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {familyMembers.map(member => (
                <div
                  key={member.id}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                    selectedMember?.id === member.id 
                      ? 'bg-white/60 shadow-md' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setSelectedMember(member)}
                >
                  {/* Status indicator */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.name.split(' ')[0].charAt(0)}
                    </div>
                    <div className={`absolute -right-1 -bottom-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.overallStatus)}`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium truncate">{member.name}</h3>
                      {member.alerts > 0 && (
                        <span className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {member.alerts}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 
                      {formatTimeDiff(member.lastUpdated)} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Detail Panel */}
        {selectedMember && (
          <div className="lg:w-2/3">
            <div className="glass rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    {selectedMember.name.split(' ')[0].charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMember.name}</h2>
                    <p className="text-sm text-gray-500">
                      Last updated: {formatTimeDiff(selectedMember.lastUpdated)} ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedMember.overallStatus === 'healthy' ? 'bg-green-100 text-green-800' :
                    selectedMember.overallStatus === 'caution' ? 'bg-amber-100 text-amber-800' :
                    selectedMember.overallStatus === 'warning' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedMember.overallStatus.charAt(0).toUpperCase() + selectedMember.overallStatus.slice(1)}
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedMember.metrics.heartRate && (
                  <div className="bg-white/50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                          <Heart className="w-4 h-4 text-red-500" />
                        </div>
                        <span className="text-sm font-medium">Heart Rate</span>
                      </div>
                      <div className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        selectedMember.metrics.heartRate.change && selectedMember.metrics.heartRate.change > 0 
                          ? 'bg-amber-100 text-amber-800' 
                        : selectedMember.metrics.heartRate.change && selectedMember.metrics.heartRate.change < 0 
                          ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedMember.metrics.heartRate.change 
                          ? (selectedMember.metrics.heartRate.change > 0 
                              ? `+${selectedMember.metrics.heartRate.change}%` 
                              : `${selectedMember.metrics.heartRate.change}%`) 
                          : 'No change'}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">
                        {typeof selectedMember.metrics.heartRate.value === 'object' 
                          ? `${selectedMember.metrics.heartRate.value.sys}/${selectedMember.metrics.heartRate.value.dia}`
                          : selectedMember.metrics.heartRate.value}
                        <span className="text-sm font-normal text-gray-500">
                          {selectedMember.metrics.heartRate.unit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated {formatTimeDiff(new Date(selectedMember.metrics.heartRate.timestamp))} ago
                      </div>
                    </div>
                  </div>
                )}

                {selectedMember.metrics.bloodOxygen && (
                  <div className="bg-white/50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Droplets className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-sm font-medium">Blood Oxygen</span>
                      </div>
                      <div className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        selectedMember.metrics.bloodOxygen.change && selectedMember.metrics.bloodOxygen.change > 0 
                          ? 'bg-green-100 text-green-800' 
                        : selectedMember.metrics.bloodOxygen.change && selectedMember.metrics.bloodOxygen.change < 0 
                          ? 'bg-amber-100 text-amber-800' 
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedMember.metrics.bloodOxygen.change 
                          ? (selectedMember.metrics.bloodOxygen.change > 0 
                              ? `+${selectedMember.metrics.bloodOxygen.change}%` 
                              : `${selectedMember.metrics.bloodOxygen.change}%`)
                          : 'No change'}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">
                        {typeof selectedMember.metrics.bloodOxygen.value === 'object' 
                          ? `${selectedMember.metrics.bloodOxygen.value.sys}/${selectedMember.metrics.bloodOxygen.value.dia}`
                          : selectedMember.metrics.bloodOxygen.value}
                        <span className="text-sm font-normal text-gray-500">
                          {selectedMember.metrics.bloodOxygen.unit}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated {formatTimeDiff(new Date(selectedMember.metrics.bloodOxygen.timestamp))} ago
                      </div>
                    </div>
                  </div>
                )}

                {selectedMember.metrics.steps && (
                  <div className="bg-white/50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                          <Activity className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-sm font-medium">Steps</span>
                      </div>
                      <div className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        selectedMember.metrics.steps.change && selectedMember.metrics.steps.change > 0 
                          ? 'bg-green-100 text-green-800' 
                        : selectedMember.metrics.steps.change && selectedMember.metrics.steps.change < 0 
                          ? 'bg-amber-100 text-amber-800' 
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedMember.metrics.steps.change 
                          ? (selectedMember.metrics.steps.change > 0 
                              ? `+${selectedMember.metrics.steps.change}%` 
                              : `${selectedMember.metrics.steps.change}%`) 
                          : 'No change'}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-bold">
                        {selectedMember.metrics.steps.value.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Last updated {formatTimeDiff(new Date(selectedMember.metrics.steps.timestamp))} ago
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  <span>Family Notes</span>
                </h3>

                {/* Add Note Form */}
                <div className="mb-4 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    className="w-full px-4 py-2 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedMember.notes.length === 0 ? (
                    <p className="text-sm text-gray-500 p-3 bg-white/30 rounded-xl">No notes for this family member yet.</p>
                  ) : (
                    selectedMember.notes.map(note => (
                      <div key={note.id} className="p-3 bg-white/50 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              {note.metric && getMetricIcon(note.metric)}
                              <span className="text-sm font-medium">{note.author}</span>
                            </div>
                            <p className="text-sm mt-1">{note.text}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {note.timestamp.toLocaleDateString()} {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 