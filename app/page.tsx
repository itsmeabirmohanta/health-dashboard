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
  Check,
  Database,
  BarChart,
  Settings,
  Bell
} from "lucide-react";
import Link from "next/link";
import { DeviceStatusCard } from "@/components/DeviceStatusCard";
import { HealthTrendCard } from "@/components/HealthTrendCard";
import { HeartRateMonitor } from "@/components/ui/HeartRateMonitor";
import { OxygenSaturationGauge } from "@/components/ui/OxygenSaturationGauge";
import { StepsCounter } from "@/components/ui/StepsCounter";
import { ScheduleCard } from "@/components/ui/ScheduleCard";
import { scheduleActivities } from "@/app/store/scheduleData";
import { MetricsGrid } from "@/components/MetricsGrid";
import { HealthGraph } from "@/components/HealthGraph";
import { MetricData, MetricType, MetricUnit } from "@/types";
import { GoalProgressCard } from "@/components/ui/GoalProgressCard";
import { mockGoals } from "@/app/store/mockDashboardData";
import { NutritionSummaryCard } from "@/components/ui/NutritionSummaryCard";
import { mockNutritionSummary } from "@/app/store/mockDashboardData";
import { MedicationCard } from "@/components/ui/MedicationCard";
import { mockMedications } from "@/app/store/mockDashboardData";
import { HydrationTrackerCard } from "@/components/ui/HydrationTrackerCard";
import { mockHydrationSummary } from "@/app/store/mockDashboardData";

// Define HealthMetric type matching the actual store data
interface HealthMetricFromStore {
  value: any;
  unit?: string;
  timestamp: string; // Assuming this is an ISO string from the store
}

// Adapter function to transform HealthMetric from store to MetricData for Grid
const adaptMetricsForGrid = (metrics: { [key: string]: HealthMetricFromStore }): Record<string, MetricData> => {
  return Object.entries(metrics).reduce((acc, [key, metric]) => {
    acc[key] = {
      id: key, 
      timestamp: metric.timestamp, // Use as is, assuming it's already an ISO string
      type: key as MetricType, 
      value: metric.value,
      unit: metric.unit as MetricUnit, 
    };
    return acc;
  }, {} as Record<string, MetricData>);
};

export default function DashboardPage() {
  const { 
    currentMetrics,
    syncMetrics,
    fetchHistoricalData,
    historicalData,
    selectedTimeRange,
    activeDataset,
    setActiveDataset
  } = useHealthStore(state => ({
    currentMetrics: state.currentMetrics as { [key: string]: HealthMetricFromStore }, // Cast to the actual shape
    syncMetrics: state.syncMetrics,
    fetchHistoricalData: state.fetchHistoricalData,
    historicalData: state.historicalData,
    selectedTimeRange: state.selectedTimeRange,
    activeDataset: state.activeDataset,
    setActiveDataset: state.setActiveDataset,
  }));
  
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

  // Mock performance data
  const performanceData = {
    improvement: "26%",
    lastDay: "-10%",
    weeklyGoal: "4%",
    progress: 42
  };

  const datasets = [
    { id: 'normalDay', name: 'Normal Day' },
    { id: 'highActivity', name: 'High Activity' },
    { id: 'illness', name: 'Illness/Stress' },
    { id: 'recovery', name: 'Recovery Day' }
  ];

  // Configuration for HealthGraph
  const metricDisplayConfig = {
    heartRate: { key: 'heartRate', name: 'Heart Rate', color: '#ef4444', yAxisId: 'hr', domain: [40, 180] as [number, number], unit: 'bpm' },
    bloodOxygen: { key: 'bloodOxygen', name: 'Blood Oxygen', color: '#3b82f6', yAxisId: 'bo', domain: [85, 100] as [number, number], unit: '%' },
    steps: { key: 'steps', name: 'Steps', color: '#22c55e', yAxisId: 'steps', domain: [0, 'dataMax'] as [number, 'dataMax'], unit: 'steps' },
    caloriesBurned: { key: 'caloriesBurned', name: 'Calories Burned', color: '#f97316', yAxisId: 'cal', domain: [0, 'dataMax'] as [number, 'dataMax'], unit: 'kcal' },
    // Add other metrics as needed
  };

  const metricsForGraph = Object.values(metricDisplayConfig);

  // Adapt currentMetrics for MetricsGrid
  const adaptedMetrics = currentMetrics ? adaptMetricsForGrid(currentMetrics) : {};

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* New Header */}
      <header className="mb-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Demo User!</p> 
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            {/* Demo User Avatar */}
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold">
              DU
            </div> 
          </div>
        </div>
      </header>

      {/* Main Content Area - Simplified for now */}
      <div className="glass rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-green-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2> 
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select 
                  value={activeDataset}
                  onChange={(e) => setActiveDataset(e.target.value as any)}
                  className="flex items-center gap-2 px-3 py-2 bg-white shadow-sm border border-gray-100 text-gray-700 rounded-xl hover:bg-white/90 transition-all appearance-none pr-8 text-sm font-medium"
                >
                  {datasets.map(dataset => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
                <Database className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              
              <button 
                onClick={() => syncMetrics()}
                className="flex items-center gap-2 px-3 py-2 bg-white shadow-sm border border-gray-100 hover:border-red-100 text-gray-700 rounded-xl hover:bg-white/90 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-red-500" />
                <span>Refresh Data</span>
              </button>
              
              <button 
                onClick={() => {
                  console.log("Exporting Report:");
                  console.log("Current Metrics:", currentMetrics);
                  console.log("Historical Data:", historicalData);
                  alert("Report data logged to console. (Demo)");
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
          
          {/* Tabs Navigation - Simplified for new design */}
          <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-200 pb-3">
            {[
              { id: "overview", label: "Overview", icon: <Activity className="w-4 h-4" /> },
              { id: "metrics", label: "Detailed Metrics", icon: <BarChart className="w-4 h-4" /> },
              { id: "activity", label: "Log Activity", icon: <Plus className="w-4 h-4" /> },
              { id: "insights", label: "AI Insights", icon: <TrendingUp className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center font-medium gap-1.5 px-3 py-2 rounded-md text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-red-500 text-red-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Main Content - Left Side (Overview) */}
            <div className="lg:col-span-8 space-y-6 overflow-hidden">
              {/* Quick Stats - Redesigned */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { 
                    title: "Heart Rate", 
                    value: currentMetrics.heartRate ? `${currentMetrics.heartRate.value}` : "-", 
                    unit: "bpm",
                    icon: <Heart className="w-6 h-6 text-red-500" />,
                    bgColor: "bg-red-100/50",
                    textColor: "text-red-700",
                    trend: "+2%",
                    trendUp: true
                  },
                  { 
                    title: "Blood Oxygen", 
                    value: currentMetrics.bloodOxygen ? `${currentMetrics.bloodOxygen.value}` : "-", 
                    unit: "%",
                    icon: <Droplets className="w-6 h-6 text-blue-500" />,
                    bgColor: "bg-blue-100/50",
                    textColor: "text-blue-700",
                    trend: "stable",
                    trendUp: null
                  },
                  { 
                    title: "Calories Burned", 
                    value: currentMetrics.caloriesBurned ? `${currentMetrics.caloriesBurned.value}` : "-", 
                    unit: "kcal",
                    icon: <Flame className="w-6 h-6 text-orange-500" />,
                    bgColor: "bg-orange-100/50",
                    textColor: "text-orange-700",
                    trend: "+12%",
                    trendUp: true
                  },
                  { 
                    title: "Active Steps", 
                    value: currentMetrics.steps ? `${currentMetrics.steps.value}` : "-", 
                    unit: "steps",
                    icon: <Activity className="w-6 h-6 text-green-500" />,
                    bgColor: "bg-green-100/50",
                    textColor: "text-green-700",
                    trend: "-5%",
                    trendUp: false
                  }
                ].map((stat, index) => (
                  <div key={index} className={`p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col justify-between ${stat.bgColor}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        {stat.icon}
                      </div>
                      {stat.trend && (
                        <div className={`text-xs font-semibold flex items-center ${
                          stat.trendUp === true ? 'text-green-600' : 
                          stat.trendUp === false ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {stat.trendUp === true && <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
                          {stat.trendUp === false && <TrendingUp className="w-3.5 h-3.5 mr-0.5 transform rotate-180" />}
                          {stat.trend}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${stat.textColor} mb-0.5`}>{stat.title}</p>
                      <div className="flex items-baseline">
                        <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
                        <span className={`text-sm ${stat.textColor}/80 ml-1`}>{stat.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Heart Rate Monitor Card - Redesigned */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Real-time Heart Rate</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Live</span>
                    <select 
                      value={selectedTimeframe}
                      onChange={(e) => handleTimeRangeChange(e.target.value)}
                      className="text-xs px-2 py-1 bg-gray-100 border-gray-200 text-gray-600 rounded-md hover:bg-gray-200 transition-all appearance-none pr-7"
                    >
                      <option value="24h">Last 24h</option>
                      <option value="7d">Last 7d</option>
                      <option value="30d">Last 30d</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1 flex flex-col items-center justify-center">
                    <HeartRateMonitor value={currentMetrics.heartRate?.value ? Number(currentMetrics.heartRate.value) : 78} size="lg" />
                    <div className="text-center mt-3">
                      <div className="text-5xl font-bold text-gray-800">{currentMetrics.heartRate?.value || 78}</div>
                      <div className="text-sm text-green-500 font-medium mt-1">Normal</div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    {/* Placeholder for a simple line chart or more detailed stats */}
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                       <p className="text-gray-400 text-sm">Heart rate trend chart coming soon</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                      {[ 
                        { label: "Min Today", value: "N/A", unit:"bpm" },
                        { label: "Max Today", value: "N/A", unit:"bpm" },
                        { label: "Avg Today", value: "N/A", unit:"bpm" },
                        { label: "Resting HR", value: "62 bpm" }
                      ].map(item => (
                        <div key={item.label} className="bg-gray-50 p-2 rounded-md">
                          <p className="text-gray-500">{item.label}</p>
                          <p className="font-semibold text-gray-700 text-sm">{item.value}{item.unit ? <span className="text-gray-500 text-xs"> {item.unit}</span> : ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <NutritionSummaryCard summary={mockNutritionSummary} />
              <HydrationTrackerCard summary={mockHydrationSummary} onLogWater={(amount) => console.log("Logged water (mock):", amount, "ml")} />

              {/* Other components for Overview tab can go here */}
              <HealthTrendCard title="Sleep Patterns" historicalData={historicalData || []} selectedTimeRange={selectedTimeframe} />
              
            </div>

            {/* Right Sidebar - Placeholder */}
            <div className="lg:col-span-4 space-y-6">
              <DeviceStatusCard deviceName="Smartwatch" deviceType="watch" batteryLevel={85} isConnected={true} lastSynced={new Date()} />
              <ScheduleCard activities={scheduleActivities.slice(0,3)} />
              <GoalProgressCard goals={mockGoals} />
              <MedicationCard medications={mockMedications} />
              {/* Placeholder for additional insights or summary */}
               <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Performance Snapshot</h2>
                <div className="space-y-3">
                    {[ 
                        {label: "Improvement vs Last Week", value: performanceData.improvement, color: "text-green-500"},
                        {label: "Activity vs Yesterday", value: performanceData.lastDay, color: "text-red-500"},
                        {label: "Weekly Goal Progress", value: `${performanceData.progress}%`, color: "text-blue-500"}
                    ].map(item => (
                        <div key={item.label} className="flex justify-between items-center text-sm">
                            <p className="text-gray-600">{item.label}</p>
                            <p className={`font-semibold ${item.color}`}>{item.value}</p>
                        </div>
                    ))}
                    <div className="pt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${performanceData.progress}%`}}></div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Metric Values</h2>
              {isLoading ? (
                <p>Loading metrics...</p>
              ) : (
                <MetricsGrid metrics={adaptedMetrics} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Historical Trends</h2>
              {isLoading ? (
                <p>Loading historical data...</p>
              ) : (
                <div className="h-[400px]"> {/* Ensure HealthGraph has a defined height */}
                  <HealthGraph data={historicalData || []} metrics={metricsForGraph} title="All Metrics Over Time" />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          // Placeholder for Log Activity content
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Log New Activity</h2>
            <p className="text-gray-600">Form to log new activities, workouts, meals, etc. will be here. (Coming Soon)</p>
          </div>
        )}

        {activeTab === "insights" && (
          // Placeholder for AI Insights content
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Insights</h2>
            <p className="text-gray-600">Personalized insights and recommendations based on your health data. (Coming Soon)</p>
          </div>
        )}
      </div>
    </div>
  );
} 