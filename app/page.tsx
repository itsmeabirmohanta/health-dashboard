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
  Bluetooth,
  BarChart3
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

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid rendering during SSR to prevent hydration mismatch
  }

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
    <div className="space-y-6">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Health Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Monitor your health metrics and track your progress.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Heart Rate</h3>
              <p className="text-2xl font-bold">72 BPM</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-xs mt-2 text-slate-500">Normal range</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Activity</h3>
              <p className="text-2xl font-bold">8,243 steps</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
          </div>
          <p className="text-xs mt-2 text-slate-500">Target: 10,000 steps</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium">Sleep</h3>
              <p className="text-2xl font-bold">7h 23m</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-xs mt-2 text-slate-500">Good quality</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-0 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full mr-4">
                  <RefreshCw className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="font-medium">Daily sync completed</p>
                  <p className="text-sm text-slate-500">{i} hour{i > 1 ? 's' : ''} ago</p>
                </div>
              </div>
              <Link href="#" className="text-blue-500 text-sm hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 