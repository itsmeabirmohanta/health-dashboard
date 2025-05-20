"use client";

import { useEffect, useState } from "react";
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
  Check,
  Zap,
  Flame,
  RefreshCw,
  Medal,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeviceStatusCard } from "@/components/DeviceStatusCard";
import { ActivityChart } from "@/components/ActivityChart";
import { MetricsGrid } from "@/components/MetricsGrid";
import { MetricGauge } from "@/components/MetricGauge";
import { HealthTrendCard } from "@/components/HealthTrendCard";
import Image from "next/image";

export default function DashboardPage() {
  const { 
    currentMetrics,
    syncMetrics,
    fetchHistoricalData,
    historicalData,
    selectedTimeRange,
  } = useHealthStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await syncMetrics();
      await fetchHistoricalData('24h');
      setIsLoading(false);
    };
    
    loadData();
    
    // Set up periodic data refresh
    const intervalId = setInterval(() => {
      syncMetrics();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [syncMetrics, fetchHistoricalData]);

  // Extract heart rate data for the activity chart
  const heartRateData = historicalData
    .slice(-10) // Get last 10 data points
    .map(point => ({
      time: format(new Date(point.timestamp), 'HH:mm'),
      value: point.heartRate || 0
    }));

  const handleTimeRangeChange = (range: string) => {
    fetchHistoricalData(range as '24h' | '7d' | '30d' | '90d');
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <div className="mb-6 md:mb-8">
        <div className="glass rounded-2xl p-5 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your vitals and performance metrics in real-time</p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button 
                onClick={() => syncMetrics()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white shadow-sm border border-gray-100 hover:border-red-100 text-gray-700 rounded-xl hover:bg-white/90 transition-all group"
              >
                <RefreshCw className="w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-500" />
                <span>Refresh Data</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex mt-8 gap-1 bg-white/50 p-1 rounded-lg max-w-md">
            {[
              { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
              { id: "metrics", label: "Metrics", icon: <Heart className="w-4 h-4" /> },
              { id: "activity", label: "Activity", icon: <Zap className="w-4 h-4" /> },
              { id: "insights", label: "Insights", icon: <TrendingUp className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg flex-1 text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-white/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                title: "Heart Rate", 
                value: currentMetrics.heartRate ? `${currentMetrics.heartRate.value}` : "-", 
                unit: "bpm",
                icon: <Heart className="w-5 h-5 text-red-500" />,
                bgColor: "bg-red-50",
                trend: "+2%",
                trendUp: true
              },
              { 
                title: "Blood Oxygen", 
                value: currentMetrics.bloodOxygen ? `${currentMetrics.bloodOxygen.value}` : "-", 
                unit: "%",
                icon: <Droplets className="w-5 h-5 text-blue-500" />,
                bgColor: "bg-blue-50",
                trend: "stable",
                trendUp: null
              },
              { 
                title: "Calories", 
                value: currentMetrics.caloriesBurned ? `${currentMetrics.caloriesBurned.value}` : "-", 
                unit: "kcal",
                icon: <Flame className="w-5 h-5 text-orange-500" />,
                bgColor: "bg-orange-50",
                trend: "+12%",
                trendUp: true
              },
              { 
                title: "Steps", 
                value: currentMetrics.steps ? `${currentMetrics.steps.value}` : "-", 
                unit: "steps",
                icon: <Activity className="w-5 h-5 text-green-500" />,
                bgColor: "bg-green-50",
                trend: "-5%",
                trendUp: false
              }
            ].map((stat, index) => (
              <div key={index} className="glass rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                  {stat.trend && (
                    <div className={`text-xs font-medium flex items-center ${
                      stat.trendUp === true ? 'text-green-500' : 
                      stat.trendUp === false ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {stat.trendUp === true && <TrendingUp className="w-3 h-3 mr-1" />}
                      {stat.trendUp === false && <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />}
                      {stat.trend}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-sm text-gray-500 ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{stat.title}</p>
                </div>
              </div>
            ))}
          </div>

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

          {/* Health Trends Card */}
          <HealthTrendCard 
            historicalData={historicalData}
            title="Health Metrics"
            defaultMetrics={["heartRate", "bloodOxygen"]}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={handleTimeRangeChange}
          />

          {/* Metrics Grid */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-red-500" />
                Current Metrics
              </h2>
              <button 
                onClick={() => syncMetrics()} 
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
            {Object.keys(currentMetrics).length > 0 ? (
              <MetricsGrid metrics={currentMetrics} />
            ) : (
              <div className="flex items-center justify-center h-40 bg-white/30 rounded-xl">
                <p className="text-gray-500">No metrics available</p>
              </div>
            )}
          </div>

          {/* Performance Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                Weekly Performance
              </h2>
              <button className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1">
                <ChevronRight className="w-4 h-4" />
                Details
              </button>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
              <div className="flex-1 text-center p-4 bg-white/70 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-gray-900">26%</div>
                <div className="text-sm text-gray-600 mt-1">Improvement</div>
              </div>
              <div className="flex-1 text-center p-4 bg-white/70 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-gray-900">-10%</div>
                <div className="text-sm text-gray-600 mt-1">Since last day</div>
              </div>
              <div className="flex-1 text-center p-4 bg-white/70 rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-red-500">4%</div>
                <div className="text-sm text-gray-600 mt-1">Weekly goal</div>
              </div>
            </div>
            
            <div className="mt-4 bg-white/70 rounded-xl p-4 relative z-10">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress to goal</span>
                <span className="text-sm font-medium text-gray-700">42%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-red-500 to-red-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Schedule and Metrics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Heart Rate Gauge */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-red-400/10 to-transparent rounded-full"></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Heart Rate
              </h2>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 bg-white/70 rounded-full px-2 py-0.5">Real-time</span>
                <div className="pulse w-2 h-2 rounded-full bg-red-500 ml-2"></div>
              </div>
            </div>
            <div className="flex justify-center">
              {currentMetrics.heartRate ? (
                <MetricGauge
                  value={currentMetrics.heartRate.value as number}
                  min={40}
                  max={200}
                  title="Heart Rate"
                  unit="bpm"
                  color="#ef4444"
                  size={180}
                />
              ) : (
                <div className="h-[180px] w-full flex items-center justify-center">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2 relative z-10">
              <div className="bg-white/70 p-2 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-900">72</div>
                <div className="text-xs text-gray-500">Resting</div>
              </div>
              <div className="bg-white/70 p-2 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-900">110</div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
              <div className="bg-white/70 p-2 rounded-lg text-center">
                <div className="text-sm font-medium text-gray-900">160</div>
                <div className="text-xs text-gray-500">Maximum</div>
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                My Schedule
              </h2>
              <select className="text-sm text-gray-600 bg-white/70 border border-white/20 rounded-lg p-1 focus:ring-red-500/20 focus:border-red-500 cursor-pointer">
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
                  className={`text-center px-2 py-3 rounded-xl cursor-pointer transition-all ${
                    item.active 
                      ? 'gradient-animated text-white shadow-md' 
                      : 'bg-white/50 hover:bg-white/70 shadow-sm'
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
              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer group">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Kettlebell Swing</h3>
                  <p className="text-xs text-gray-600">4/4 Sets Logged</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-700">10:00 AM</span>
                  <span className="text-xs text-green-500">Completed</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer group">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Outdoor Run</h3>
                  <p className="text-xs text-gray-600">3.5 miles</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-700">14:30 PM</span>
                  <span className="text-xs text-blue-500">In Progress</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all shadow-sm cursor-pointer group">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Moon className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">Sleep Analysis</h3>
                  <p className="text-xs text-gray-600">8h 42m • 97% quality</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-gray-700">23:00 PM</span>
                  <span className="text-xs text-gray-500">Upcoming</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group">
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                Add New Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 