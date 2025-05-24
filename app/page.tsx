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
  Bell,
  ClipboardList,
  FileText,
  Briefcase,
  Watch,
  Smartphone,
  Bluetooth
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
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import { cn } from "@/lib/utils";
import { generateCurrentMetrics, dataSets, HealthDataPoint } from '@/app/store/healthDataSets';
import { Modal } from '@/components/ui/Modal';
import { RadarScanModal } from '@/components/ui/RadarScanModal';
import { DeviceConnectAnimation } from '@/components/ui/DeviceConnectAnimation';
import { RealTimeHeartRate } from '@/components/ui/RealTimeHeartRate';

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

// --- Device Mock Data ---
interface Device {
  id: string;
  name: string;
  type: 'watch' | 'phone' | 'band';
  batteryLevel: number;
  lastSynced: Date;
  defaultConnected: boolean;
}

const MOCK_DEVICES: Device[] = [
  { id: "fitbit-sense", name: "Fitbit Sense", type: "watch", batteryLevel: 85, lastSynced: new Date(Date.now() - 3600 * 1000 * 2), defaultConnected: true },
  { id: "apple-watch-9", name: "Apple Watch S9", type: "watch", batteryLevel: 92, lastSynced: new Date(Date.now() - 3600 * 1000 * 1), defaultConnected: false },
  { id: "garmin-venu-3", name: "Garmin Venu 3", type: "watch", batteryLevel: 78, lastSynced: new Date(Date.now() - 3600 * 1000 * 5), defaultConnected: false },
  { id: "oura-ring-3", name: "Oura Ring Gen3", type: "band", batteryLevel: 60, lastSynced: new Date(Date.now() - 3600 * 1000 * 3), defaultConnected: false },
  { id: "galaxy-s23", name: "Galaxy S23 Ultra", type: "phone", batteryLevel: 70, lastSynced: new Date(Date.now() - 3600 * 1000 * 0.5), defaultConnected: false },
];

// Map deviceId to dataset
const DEVICE_DATASET_MAP: Record<string, 'normalDay' | 'highActivity' | 'illness' | 'recovery'> = {
  'fitbit-sense': 'normalDay',
  'apple-watch-9': 'highActivity',
  'garmin-venu-3': 'recovery',
  'oura-ring-3': 'illness',
  'galaxy-s23': 'normalDay',
};

export default function DashboardPage() {
  const { 
    currentMetrics,
    syncMetrics,
    fetchHistoricalData,
    historicalData,
    selectedTimeRange,
    activeDataset,
    setActiveDataset,
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
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  // Device state
  const [availableDevices] = useState(MOCK_DEVICES);
  const [selectedDeviceId, setSelectedDeviceId] = useState(MOCK_DEVICES.find(d => d.defaultConnected)?.id || MOCK_DEVICES[0]?.id || "");
  const [isConnected, setIsConnected] = useState(MOCK_DEVICES.find(d => d.id === selectedDeviceId)?.defaultConnected || false);

  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showConnectionAnimation, setShowConnectionAnimation] = useState(false);
  const [connectionAnimationType, setConnectionAnimationType] = useState<'connect' | 'disconnect'>('connect');
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(null);

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

  // Listen to "showAddDeviceModal" events from the layout
  useEffect(() => {
    const handleShowAddDeviceModal = () => {
      setShowAddDeviceModal(true);
    };
    
    document.addEventListener('showAddDeviceModal', handleShowAddDeviceModal);
    
    return () => {
      document.removeEventListener('showAddDeviceModal', handleShowAddDeviceModal);
    };
  }, []);

  useEffect(() => {
    // Update connection status when selected device changes
    const currentDevice = availableDevices.find(d => d.id === selectedDeviceId);
    if (currentDevice) {
      setIsConnected(currentDevice.defaultConnected);
    }
  }, [selectedDeviceId, availableDevices]);

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

  // Device change handler
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };
  // Connect/disconnect handler
  const handleToggleConnection = () => {
    setConnectionAnimationType(isConnected ? 'disconnect' : 'connect');
    setShowConnectionAnimation(true);
    setTimeout(() => {
      setIsConnected((prev) => !prev);
      setShowConnectionAnimation(false);
    }, 1800);
  };

  // Add Device button handler - no longer needed, handled by sidebar
  const handleAddDevice = () => {
    setShowAddDeviceModal(true);
  };

  // Radar scan modal connect handler
  const handleRadarConnect = (device: Device) => {
    setConnectingDeviceId(device.id);
    setTimeout(() => {
      setSelectedDeviceId(device.id);
      setShowAddDeviceModal(false);
      setConnectingDeviceId(null);
      setConnectionAnimationType('connect');
      setShowConnectionAnimation(true);
      setTimeout(() => {
        setIsConnected(true);
        setShowConnectionAnimation(false);
      }, 1800);
    }, 900); // allow time for blip to center
  };

  // Get dataset for selected device
  const selectedDataset = DEVICE_DATASET_MAP[selectedDeviceId] || 'normalDay';
  // Get current metrics for selected device
  const currentMetricsForDevice = isConnected ? generateCurrentMetrics(selectedDataset) : null;

  // Get historical heart rate data for the selected device and timeframe
  const selectedDatasetGenerator = dataSets[selectedDataset].generator;
  const heartRateHistory: HealthDataPoint[] = isConnected ? selectedDatasetGenerator(selectedTimeframe as '24h' | '7d' | '30d' | '90d') : [];
  const heartRates = heartRateHistory.map(d => d.heartRate).filter(hr => typeof hr === 'number') as number[];
  const minHR = heartRates.length ? Math.min(...heartRates) : null;
  const maxHR = heartRates.length ? Math.max(...heartRates) : null;
  const avgHR = heartRates.length ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : null;
  const restingHR = heartRateHistory.length ? heartRateHistory[heartRateHistory.length - 1].restingHeartRate : null;

  const handleTimeFrameChange = (newTimeFrame: 'Live' | 'Last 24h') => {
    // Handle time frame changes for the heart rate monitor
    console.log(`Changed time frame to: ${newTimeFrame}`);
    if (newTimeFrame === 'Last 24h') {
      handleTimeRangeChange('24h');
    }
  };

  const handleStartWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
    console.log(isWorkoutActive ? "Workout Ended" : "Workout Started");
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      {isLoading && <DashboardSkeleton />}
      
      <div className={cn("page-transition", !isLoading ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <DeviceConnectAnimation visible={showConnectionAnimation} type={connectionAnimationType} />
        <RadarScanModal
          isOpen={showAddDeviceModal}
          onClose={() => setShowAddDeviceModal(false)}
          devices={availableDevices}
          onConnect={handleRadarConnect}
          connectingDeviceId={connectingDeviceId || undefined}
        />
        
        {/* Quick Actions Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-sm p-4 md:p-6 mb-6 border border-gray-100/50 dark:border-gray-700/50">
          <div className="mb-4 md:mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" strokeWidth={2.5} />
              Quick Actions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Access your most important tools</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            <button 
              onClick={() => syncMetrics()}
              className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/30 rounded-lg p-4 border border-blue-100 dark:border-blue-800/50 shadow-sm hover:shadow transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/20 rounded-full mb-3 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors">
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform group-hover:rotate-90" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Refresh Data</span>
            </button>

            <Link href="/activity-log" passHref
              className="flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20 hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-800/40 dark:hover:to-indigo-700/30 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/50 shadow-sm hover:shadow transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full mb-3 group-hover:bg-indigo-500/20 dark:group-hover:bg-indigo-500/30 transition-colors">
                <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Log Activity</span>
            </Link>
            
            <button 
              onClick={handleStartWorkout}
              className={`flex flex-col items-center justify-center rounded-lg p-4 border shadow-sm hover:shadow transition-all group ${
                isWorkoutActive 
                ? 'bg-gradient-to-b from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/30 border-red-200 dark:border-red-800/50'
                : 'bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/30 border-green-200 dark:border-green-800/50'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-3 transition-colors ${
                isWorkoutActive
                ? 'bg-red-500/10 dark:bg-red-500/20 group-hover:bg-red-500/20 dark:group-hover:bg-red-500/30'
                : 'bg-green-500/10 dark:bg-green-500/20 group-hover:bg-green-500/20 dark:group-hover:bg-green-500/30'
              }`}>
                <Zap className={`w-5 h-5 ${
                  isWorkoutActive 
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
                }`} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {isWorkoutActive ? 'End Workout' : 'Start Workout'}
              </span>
            </button>

            <Link href="/reports" passHref
              className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/30 rounded-lg p-4 border border-purple-100 dark:border-purple-800/50 shadow-sm hover:shadow transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-purple-500/10 dark:bg-purple-500/20 rounded-full mb-3 group-hover:bg-purple-500/20 dark:group-hover:bg-purple-500/30 transition-colors">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">View Reports</span>
            </Link>

            <Link href="/settings" passHref
              className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/60 dark:hover:to-gray-600/40 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow transition-all group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-gray-500/10 dark:bg-gray-500/20 rounded-full mb-3 group-hover:bg-gray-500/20 dark:group-hover:bg-gray-500/30 transition-colors">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Settings</span>
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6 overflow-hidden">
                {/* If device is not connected, show message/skeleton */}
                {!isConnected ? (
                  <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-md min-h-[300px]">
                    <span className="text-3xl mb-2">🔌</span>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Device not connected</h2>
                    <p className="text-gray-500">Please connect a device to view your health dashboard.</p>
                  </div>
                ) : (
                  <>
                    {/* Quick Stats - Redesigned */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { 
                          title: "Heart Rate", 
                          value: currentMetricsForDevice?.heartRate ? `${currentMetricsForDevice.heartRate.value}` : "-", 
                          unit: "bpm",
                          icon: <Heart className="w-6 h-6 text-red-500" />,
                          bgColor: "bg-red-100/50",
                          textColor: "text-red-700",
                          trend: "+2%",
                          trendUp: true
                        },
                        { 
                          title: "Blood Oxygen", 
                          value: currentMetricsForDevice?.bloodOxygen ? `${currentMetricsForDevice.bloodOxygen.value}` : "-", 
                          unit: "%",
                          icon: <Droplets className="w-6 h-6 text-blue-500" />,
                          bgColor: "bg-blue-100/50",
                          textColor: "text-blue-700",
                          trend: "stable",
                          trendUp: null
                        },
                        { 
                          title: "Calories Burned", 
                          value: currentMetricsForDevice?.caloriesBurned ? `${currentMetricsForDevice.caloriesBurned.value}` : "-", 
                          unit: "kcal",
                          icon: <Flame className="w-6 h-6 text-orange-500" />,
                          bgColor: "bg-orange-100/50",
                          textColor: "text-orange-700",
                          trend: "+12%",
                          trendUp: true
                        },
                        { 
                          title: "Active Steps", 
                          value: currentMetricsForDevice?.steps ? `${currentMetricsForDevice.steps.value}` : "-", 
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

                    {/* Heart Rate Monitor Card using new component */}
                    <RealTimeHeartRate 
                      metrics={{
                        current: currentMetricsForDevice?.heartRate?.value ? Number(currentMetricsForDevice.heartRate.value) : 71,
                        min: minHR || 63, 
                        max: maxHR || 93,
                        avg: avgHR || 70,
                        resting: restingHR || 62
                      }}
                      timeFrame="Live"
                      onTimeFrameChange={handleTimeFrameChange}
                    />

                    <NutritionSummaryCard summary={mockNutritionSummary} />
                    <HydrationTrackerCard summary={mockHydrationSummary} onLogWater={(amount) => console.log("Logged water (mock):", amount, "ml")} />

                    {/* Other components for Overview tab can go here */}
                    <HealthTrendCard title="Sleep Patterns" historicalData={historicalData || []} selectedTimeRange={selectedTimeframe} />
                  </>
                )}
              </div>

              {/* Right Sidebar - Placeholder */}
              <div className="lg:col-span-4 space-y-6">
                <DeviceStatusCard
                  availableDevices={availableDevices}
                  selectedDeviceId={selectedDeviceId}
                  isConnected={isConnected}
                  onDeviceChange={handleDeviceChange}
                  onToggleConnection={handleToggleConnection}
                />
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
    </div>
  );
} 