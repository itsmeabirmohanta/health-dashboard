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
  ChevronRight,
  RefreshCw,
  Zap,
  Flame,
  TrendingUp,
  ChevronDown,
  Plus,
  Check
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DeviceStatusCard } from "@/components/DeviceStatusCard";
import { HealthTrendCard } from "@/components/HealthTrendCard";
import { HeartRateMonitor } from "@/components/ui/HeartRateMonitor";
import { OxygenSaturationGauge } from "@/components/ui/OxygenSaturationGauge";
import { StepsCounter } from "@/components/ui/StepsCounter";

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
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

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

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeframe(range);
    fetchHistoricalData(range as '24h' | '7d' | '30d' | '90d');
  };

  // Mock schedule data
  const scheduleData = [
    {
      id: 1,
      title: "Kettlebell Swing",
      time: "10:00 AM",
      completed: true,
      details: "5/4 sets • Logged"
    },
    {
      id: 2,
      title: "Outdoor Run",
      time: "14:30 PM",
      completed: false,
      details: "3.3 miles",
      inProgress: true
    },
    {
      id: 3,
      title: "Sleep Analysis",
      time: "23:00 PM",
      completed: false,
      details: "8+ hours • 95% quality",
      upcoming: true
    }
  ];

  // Mock performance data
  const performanceData = {
    improvement: "26%",
    lastDay: "-10%",
    weeklyGoal: "4%",
    progress: 42
  };

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <div className="mb-6">
        <div className="glass rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your vitals and performance metrics in real-time</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <button 
                onClick={() => syncMetrics()}
                className="flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-gray-100 hover:border-red-100 text-gray-700 rounded-xl hover:bg-white/90 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-red-500" />
                <span>Refresh Data</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex mt-6 gap-1 bg-white/50 p-1 rounded-lg max-w-md">
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

          {/* Health Metrics Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
              
              <div className="flex">
                <button 
                  onClick={() => handleTimeRangeChange('24h')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeframe === '24h' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  24h
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('7d')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeframe === '7d' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  7d
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('30d')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeframe === '30d' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  30d
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('90d')}
                  className={`px-3 py-1 text-sm rounded-md ${selectedTimeframe === '90d' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  90d
                </button>
              </div>
            </div>
            
            {historicalData.length > 0 ? (
              <HealthTrendCard 
                historicalData={historicalData}
                title=""
                defaultMetrics={["heartRate", "bloodOxygen"]}
                selectedTimeRange={selectedTimeRange}
                onTimeRangeChange={handleTimeRangeChange}
              />
            ) : (
              <div className="flex items-center justify-center h-40 bg-white/30 rounded-xl">
                <p className="text-gray-500">No historical data available</p>
              </div>
            )}
          </div>

          {/* Current Metrics */}
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
            
            <div className="flex items-center justify-center h-40 bg-white/30 rounded-xl">
              <p className="text-gray-500">No metrics available</p>
            </div>
          </div>

          {/* Weekly Performance */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-yellow-500" />
                Weekly Performance
              </h2>
              <Link 
                href="#" 
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                Details
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{performanceData.improvement}</div>
                <div className="text-sm text-gray-500 mt-1">Improvement</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{performanceData.lastDay}</div>
                <div className="text-sm text-gray-500 mt-1">Since last day</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500">{performanceData.weeklyGoal}</div>
                <div className="text-sm text-gray-500 mt-1">Weekly goal</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Progress to goal</span>
                <span className="text-gray-700">{performanceData.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" 
                  style={{width: `${performanceData.progress}%`}}
                ></div>
              </div>
            </div>
          </div>

          {/* Heart Rate Monitor */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Heart Rate Monitor</h2>
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 flex items-center justify-center">
                <HeartRateMonitor value={currentMetrics.heartRate?.value ? Number(currentMetrics.heartRate.value) : 0} />
              </div>
              
              <div className="w-full md:w-2/3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Heart Rate Zones</h3>
                <div className="space-y-3">
                  {[
                    { name: "Rest", range: "40-60 bpm", color: "bg-blue-500" },
                    { name: "Fat Burn", range: "60-70 bpm", color: "bg-green-500" },
                    { name: "Cardio", range: "70-85 bpm", color: "bg-yellow-500" },
                    { name: "Peak", range: "85+ bpm", color: "bg-red-500" }
                  ].map((zone, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${zone.color} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700 w-16">{zone.name}</span>
                      <span className="text-sm text-gray-500 ml-auto">{zone.range}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                  <p className="text-sm text-gray-600">Your heart rate is within normal range.</p>
                  <p className="text-xs text-gray-500 mt-1">Last updated: 5:30:34 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Blood Oxygen */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Blood Oxygen Level</h2>
              <span className="text-sm text-gray-500">Real-time</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 flex items-center justify-center">
                <OxygenSaturationGauge value={currentMetrics.bloodOxygen?.value ? Number(currentMetrics.bloodOxygen.value) : 0} />
              </div>
              
              <div className="w-full md:w-2/3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Blood Oxygen Range</h3>
                <div className="space-y-3">
                  {[
                    { name: "Normal", range: "95-100%", color: "bg-blue-500" },
                    { name: "Below Normal", range: "90-94%", color: "bg-yellow-500" },
                    { name: "Low", range: "Below 90%", color: "bg-red-500" }
                  ].map((range, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${range.color} mr-2`}></div>
                      <span className="text-sm font-medium text-gray-700 w-24">{range.name}</span>
                      <span className="text-sm text-gray-500 ml-auto">{range.range}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Understanding Blood Oxygen</h3>
                  <p className="text-sm text-gray-600">Your blood oxygen is at a healthy level, indicating good respiratory function.</p>
                  <p className="text-xs text-gray-500 mt-1">Last updated: 5:30:34 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Heart Rate Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Heart Rate
              </h2>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1"></span>
                <span className="text-xs text-gray-500">Real-time</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">72</span>
                  <span className="text-gray-500 ml-1">bpm</span>
                </div>
                <span className="text-xs text-gray-500">Resting</span>
              </div>
              
              <div className="text-right">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-gray-700">110</span>
                  <span className="text-gray-500 ml-1">bpm</span>
                </div>
                <span className="text-xs text-gray-500">Average</span>
              </div>
              
              <div className="text-right">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-gray-700">160</span>
                  <span className="text-gray-500 ml-1">bpm</span>
                </div>
                <span className="text-xs text-gray-500">Maximum</span>
              </div>
            </div>
            
            <div className="h-40 flex items-center justify-center bg-white/30 rounded-xl">
              <p className="text-gray-500">No data available</p>
            </div>
          </div>
          
          {/* Schedule Card */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                My Schedule
              </h2>
              <button className="flex items-center text-sm text-gray-500 gap-1">
                Last Week
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
                const isToday = index === 3; // Thursday is today for demo
                return (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day}</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-red-500 text-white' : 'text-gray-700'
                    }`}>
                      {12 + index}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-3 mt-6">
              {scheduleData.map((item) => (
                <div key={item.id} className="relative pl-6 pb-4 border-l border-gray-100 last:border-0 last:pb-0">
                  <div className={`absolute top-0 -left-1.5 w-3 h-3 rounded-full ${
                    item.completed ? 'bg-green-500' : 
                    item.inProgress ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {item.completed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-1">{item.time}</div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className={`text-xs ${
                        item.completed ? 'text-green-500' : 
                        item.inProgress ? 'text-blue-500' : 'text-gray-500'
                      }`}>
                        {item.completed ? 'Completed' : 
                         item.inProgress ? 'In Progress' : 'Upcoming'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">{item.details}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-white border border-gray-100 rounded-xl text-gray-700 text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors">
              <span>Add New Activity</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 