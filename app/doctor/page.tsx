"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
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
  PlusCircle
} from "lucide-react";

// Mock data for doctor/guardian mode
const MOCK_PATIENTS: MonitoredUser[] = [
  {
    id: "p1",
    name: "John Smith",
    relationship: "patient",
    avatar: "/avatars/patient1.png",
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
    overallStatus: "healthy",
    metrics: {
      heartRate: { value: 72, unit: "bpm", timestamp: Date.now() - 15 * 60 * 1000, change: 0 },
      bloodOxygen: { value: 98, unit: "%", timestamp: Date.now() - 15 * 60 * 1000, change: 0 },
      steps: { value: 8540, timestamp: Date.now() - 15 * 60 * 1000, change: 12 },
    },
    notes: [
      {
        id: "n1",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        text: "Patient reported feeling well after medication adjustment",
        author: "Dr. Wilson",
        metric: "heartRate"
      }
    ],
    alerts: 0
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    relationship: "patient",
    avatar: "/avatars/patient2.png",
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
    overallStatus: "caution",
    metrics: {
      heartRate: { value: 88, unit: "bpm", timestamp: Date.now() - 45 * 60 * 1000, change: 8 },
      bloodOxygen: { value: 94, unit: "%", timestamp: Date.now() - 45 * 60 * 1000, change: -2 },
      steps: { value: 2100, timestamp: Date.now() - 45 * 60 * 1000, change: -30 },
    },
    notes: [
      {
        id: "n2",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        text: "Patient reported increased fatigue, monitoring oxygen levels",
        author: "Dr. Wilson",
        metric: "bloodOxygen"
      }
    ],
    alerts: 1
  },
  {
    id: "p3",
    name: "Robert Chen",
    relationship: "patient",
    avatar: "/avatars/patient3.png",
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    overallStatus: "warning",
    metrics: {
      heartRate: { value: 95, unit: "bpm", timestamp: Date.now() - 3 * 60 * 60 * 1000, change: 15 },
      bloodOxygen: { value: 92, unit: "%", timestamp: Date.now() - 3 * 60 * 60 * 1000, change: -3 },
      steps: { value: 1200, timestamp: Date.now() - 3 * 60 * 60 * 1000, change: -45 },
    },
    notes: [
      {
        id: "n3",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        text: "Patient experiencing shortness of breath, scheduled follow-up",
        author: "Dr. Wilson",
        metric: "bloodOxygen"
      }
    ],
    alerts: 3
  },
  {
    id: "p4",
    name: "Emily Davis",
    relationship: "patient",
    avatar: "/avatars/patient4.png",
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    overallStatus: "critical",
    metrics: {
      heartRate: { value: 112, unit: "bpm", timestamp: Date.now() - 30 * 60 * 1000, change: 25 },
      bloodOxygen: { value: 89, unit: "%", timestamp: Date.now() - 30 * 60 * 1000, change: -6 },
      steps: { value: 400, timestamp: Date.now() - 30 * 60 * 1000, change: -80 },
    },
    notes: [
      {
        id: "n4",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        text: "Critical alert: Patient reporting chest pain, contacted emergency services",
        author: "Dr. Wilson",
        metric: "heartRate"
      }
    ],
    alerts: 5
  }
];

export default function DoctorPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [patients, setPatients] = useState<MonitoredUser[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<MonitoredUser | null>(null);
  const [newNote, setNewNote] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<MetricType | undefined>(undefined);

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Initial setup
  useEffect(() => {
    // Check system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    
    // Set default selected patient
    if (patients.length > 0) {
      setSelectedPatient(patients[0]);
    }
  }, [patients]);

  // Add a new note to the selected patient
  const addNote = () => {
    if (!selectedPatient || !newNote.trim()) return;
    
    const newNoteObj: UserNote = {
      id: `n${Date.now()}`,
      timestamp: new Date(),
      text: newNote,
      author: "Dr. Wilson",
      metric: selectedMetric
    };
    
    const updatedPatients = patients.map(patient => {
      if (patient.id === selectedPatient.id) {
        return {
          ...patient,
          notes: [newNoteObj, ...patient.notes]
        };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
    setSelectedPatient(prev => {
      if (!prev) return null;
      return {
        ...prev,
        notes: [newNoteObj, ...prev.notes]
      };
    });
    
    setNewNote("");
    setSelectedMetric(undefined);
  };

  // Get status color based on patient's overall status
  const getStatusColor = (status: 'healthy' | 'caution' | 'warning' | 'critical') => {
    switch(status) {
      case 'healthy': return 'bg-green-500';
      case 'caution': return 'bg-amber-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
    }
  };

  // Get metric icon based on metric type
  const getMetricIcon = (type: MetricType) => {
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
    
    if (mins < 60) return `${mins}m ago`;
    if (mins < 24 * 60) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / (60 * 24))}d ago`;
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage patient health data</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl hover:bg-white/70 transition-all shadow-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Patient List Panel */}
        <div className="lg:w-1/3">
          <div className="glass rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <span>Patient List</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {patients.length} patients
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedPatient?.id === patient.id
                      ? "bg-white/50 border border-white/20"
                      : "hover:bg-white/50 hover:border hover:border-white/20"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(patient.overallStatus)}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">
                        Last updated: {formatTimeDiff(patient.lastUpdated)}
                      </p>
                    </div>
                    {patient.alerts > 0 && (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">{patient.alerts}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient Details Panel */}
        <div className="lg:flex-1">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Overview */}
              <div className="glass rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-medium text-gray-600">
                          {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(selectedPatient.overallStatus)}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                      <p className="text-sm text-gray-500">
                        Last updated: {formatTimeDiff(selectedPatient.lastUpdated)}
                      </p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl hover:bg-white/70 transition-all shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(selectedPatient.metrics).map(([key, metric]) => {
                    const Icon = getMetricIcon(key as MetricType);
                    return (
                      <div key={key} className="p-4 bg-white/50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {Icon}
                            <span className="text-sm font-medium text-gray-700">
                              {key === 'heartRate' ? 'Heart Rate' :
                               key === 'bloodOxygen' ? 'Blood Oxygen' :
                               key === 'steps' ? 'Steps' : key}
                            </span>
                          </div>
                          <span className={`text-sm font-medium ${
                            (metric.change ?? 0) > 0 ? 'text-green-500' :
                            (metric.change ?? 0) < 0 ? 'text-red-500' :
                            'text-gray-500'
                          }`}>
                            {(metric.change ?? 0) > 0 ? '+' : ''}{metric.change ?? 0}%
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          {typeof metric.value === 'object' 
                            ? `${metric.value.sys}/${metric.value.dia}`
                            : `${metric.value}${metric.unit || ''}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Patient Notes */}
              <div className="glass rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Notes</h3>
                
                <div className="space-y-4 mb-6">
                  {selectedPatient.notes.map((note) => (
                    <div key={note.id} className="p-4 bg-white/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {note.metric && getMetricIcon(note.metric)}
                          <span className="text-sm font-medium text-gray-700">{note.author}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {note.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{note.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <select
                    className="flex-1 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={selectedMetric || ''}
                    onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
                  >
                    <option value="">Select Metric</option>
                    <option value="heartRate">Heart Rate</option>
                    <option value="bloodOxygen">Blood Oxygen</option>
                    <option value="steps">Steps</option>
                    <option value="sleep">Sleep</option>
                    <option value="temperature">Temperature</option>
                    <option value="weight">Weight</option>
                  </select>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl shadow-sm p-6 flex items-center justify-center">
              <p className="text-gray-500">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 