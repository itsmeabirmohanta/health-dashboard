"use client";

import { useEffect } from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { 
  Heart, 
  Droplets, 
  Activity, 
  Moon, 
  Clock,
  Calendar,
  Download,
  MoreVertical,
  Plus,
  ChevronRight,
  MapPin,
  Check
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeviceStatusCard } from "@/components/DeviceStatusCard";
import { ActivityChart } from "@/components/ActivityChart";
import Image from "next/image";

export default function DashboardPage() {
  const { 
    currentMetrics,
    syncMetrics,
    fetchHistoricalData,
  } = useHealthStore();

  useEffect(() => {
    syncMetrics();
    fetchHistoricalData('24h');
  }, [syncMetrics, fetchHistoricalData]);

  // Mock chart data
  const heartRateData = [
    { time: '08:00', value: 72 },
    { time: '09:00', value: 68 },
    { time: '10:00', value: 75 },
    { time: '11:00', value: 82 },
    { time: '12:00', value: 78 },
    { time: '13:00', value: 90 },
    { time: '14:00', value: 86 },
    { time: '15:00', value: 75 },
    { time: '16:00', value: 70 },
    { time: '17:00', value: 72 }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics Statistics</h1>
          <p className="text-sm text-gray-500 mt-1">Track your health metrics and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl hover:bg-white/70 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Report</span>
          </button>
          <button className="p-2 bg-white/50 border border-white/20 text-gray-600 hover:bg-white/70 rounded-xl transition-all shadow-sm">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-8 space-y-6">
          {/* Device Status Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <DeviceStatusCard
              deviceName="FitPulse Watch Pro"
              deviceType="watch"
              batteryLevel={85}
              isConnected={true}
              lastSynced={new Date()}
            />
          </div>

          {/* Analytics Graph */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-sm">Today</button>
                <div className="text-gray-700">{format(new Date(), 'dd MMMM yyyy')}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <button className="p-2 bg-white/50 border border-white/20 hover:bg-white/70 rounded-xl transition-all shadow-sm">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 bg-white/50 border border-white/20 hover:bg-white/70 rounded-xl transition-all shadow-sm">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <ActivityChart data={heartRateData} height={180} />
            </div>
            
            {/* Metrics Display */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer">
                <div className="bg-red-100 p-2 rounded-xl shadow-sm">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <span className="text-sm font-medium flex-1">Heart Rate (bpm)</span>
                <span className="text-sm text-gray-600">69.44</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer">
                <div className="bg-green-100 p-2 rounded-xl shadow-sm">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-sm font-medium flex-1">Calories (kcal)</span>
                <span className="text-sm text-gray-600">1600</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer">
                <div className="bg-blue-100 p-2 rounded-xl shadow-sm">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm font-medium flex-1">Blood Pressure (mm/Hg)</span>
                <span className="text-sm text-gray-600">130/85</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Performance</h2>
              <button className="text-sm text-gray-600 hover:text-red-500 transition-colors">View Details</button>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
              <div className="flex-1 text-center p-4 bg-white/50 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-gray-900">26%</div>
                <div className="text-sm text-gray-600 mt-1">Improvement</div>
              </div>
              <div className="flex-1 text-center p-4 bg-white/50 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-gray-900">-10%</div>
                <div className="text-sm text-gray-600 mt-1">Since last day</div>
              </div>
              <div className="flex-1 text-center p-4 bg-white/50 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-red-500">4%</div>
                <div className="text-sm text-gray-600 mt-1">Weekly goal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Schedule */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Schedule</h2>
              <select className="text-sm text-gray-600 bg-white/50 border border-white/20 rounded-lg p-1 focus:ring-red-500/20 focus:border-red-500 cursor-pointer">
                <option>Last Week</option>
                <option>This Week</option>
                <option>Next Week</option>
              </select>
            </div>

            {/* Calendar Strip */}
            <div className="flex justify-between mb-6">
              {[
                { day: 'Mon', date: '12' },
                { day: 'Tue', date: '13' },
                { day: 'Wed', date: '14' },
                { day: 'Thu', date: '15', active: true },
                { day: 'Fri', date: '16' },
                { day: 'Sat', date: '17' }
              ].map((item) => (
                <div 
                  key={item.day} 
                  className={`text-center p-2 rounded-xl cursor-pointer transition-all ${
                    item.active 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md' 
                      : 'bg-white/30 hover:bg-white/50 shadow-sm'
                  }`}
                >
                  <div className="text-xs">{item.day}</div>
                  <div className={`text-lg font-medium ${!item.active && 'text-gray-900'}`}>
                    {item.date}
                  </div>
                </div>
              ))}
            </div>

            {/* Workout List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Activity className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Kettlebell Swing</h3>
                  <p className="text-xs text-gray-600">4/4 Sets Logged</p>
                </div>
                <span className="text-xs font-medium text-gray-500">10:00 AM</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Outdoor Run</h3>
                  <p className="text-xs text-gray-600">3.5 miles</p>
                </div>
                <span className="text-xs font-medium text-gray-500">14:30 PM</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Moon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Sleep Analysis</h3>
                  <p className="text-xs text-gray-600">8h 42m • 97% quality</p>
                </div>
                <span className="text-xs font-medium text-gray-500">23:00 PM</span>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full py-3 bg-gradient-to-br from-red-500 to-red-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Activity
              </button>
            </div>
          </div>

          {/* Tasks & Goals Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tasks & Goals</h2>
              <Link href="/goals" className="text-sm text-gray-600 hover:text-red-500 transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                <button className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-gray-300">
                  <Check className="w-3 h-3 text-white" />
                </button>
                <span className="text-sm flex-1">Drink 8 glasses of water</span>
                <span className="text-xs text-gray-500">2/8</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                <button className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </button>
                <span className="text-sm flex-1 line-through text-gray-500">Morning Meditation</span>
                <span className="text-xs text-gray-500">Done</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                <button className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-gray-300">
                  <Check className="w-3 h-3 text-white" />
                </button>
                <span className="text-sm flex-1">10,000 steps</span>
                <span className="text-xs text-gray-500">6.7k/10k</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 