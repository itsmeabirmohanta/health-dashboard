"use client";

import { useState, useEffect } from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { 
  Heart, 
  Droplets, 
  Activity, 
  Moon, 
  Thermometer, 
  Scale,
  Filter as FilterIcon,
  BarChart3,
  CalendarDays,
  ChevronDown
} from "lucide-react";
import { HealthGraph } from "@/components/HealthGraph";
import { cn } from "@/lib/utils";

// Define a type for your metric configurations for clarity
interface MetricGraphConfig {
  key: string;
  name: string;
  color: string;
  yAxisId: string;
  domain: [number, number] | ['dataMin', 'dataMax'] | [number, 'dataMax'] | ['dataMin', number];
  referenceValue?: number;
  referenceLabel: string;
  unit: string;
  icon: React.ElementType;
}

export default function MetricsPage() {
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>("all");
  
  const { 
    historicalData,
    fetchHistoricalData,
    selectedTimeRange,
    setTimeRange
  } = useHealthStore(state => ({
    historicalData: state.historicalData,
    fetchHistoricalData: state.fetchHistoricalData,
    selectedTimeRange: state.selectedTimeRange,
    setTimeRange: state.setTimeRange
  }));

  // Initial data fetch
  useEffect(() => {
    if(selectedTimeRange) {
        fetchHistoricalData(selectedTimeRange);
    } else {
        fetchHistoricalData('24h');
    }
  }, [fetchHistoricalData, selectedTimeRange]);

  const timeRangeOptions: { label: string; value: '24h' | '7d' | '30d' | '90d' }[] = [
    { label: "24 Hours", value: "24h" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  const allMetricGraphConfigs: MetricGraphConfig[] = [
    { key: "heartRate", name: "Heart Rate", icon: Heart, color: "#ef4444", yAxisId: "heartRate", domain: [40, 180], referenceValue: 70, referenceLabel: "Resting HR", unit: "bpm" },
    { key: "bloodOxygen", name: "Blood Oxygen", icon: Droplets, color: "#3b82f6", yAxisId: "bloodOxygen", domain: [85, 100], referenceValue: 95, referenceLabel: "Normal SpO2", unit: "%" },
    { key: "steps", name: "Steps", icon: Activity, color: "#22c55e", yAxisId: "steps", domain: ['dataMin', 'dataMax'], referenceValue: 10000, referenceLabel: "Daily Goal", unit: "steps" },
    { key: "sleep", name: "Sleep", icon: Moon, color: "#8b5cf6", yAxisId: "sleep", domain: [0, 12], referenceValue: 8, referenceLabel: "Optimal Sleep", unit: "h" },
    { key: "temperature", name: "Body Temperature", icon: Thermometer, color: "#f59e0b", yAxisId: "temperature", domain: [95, 104], referenceValue: 98.6, referenceLabel: "Normal", unit: "°F" },
    { key: "bloodPressureSystolic", name: "BP Systolic", icon: Heart, color: "#f43f5e", yAxisId: "bloodPressure", domain: [70, 180], referenceValue: 120, referenceLabel: "Normal Sys.", unit: "mmHg" },
    { key: "bloodPressureDiastolic", name: "BP Diastolic", icon: Heart, color: "#ec4899", yAxisId: "bloodPressure", domain: [40, 110], referenceValue: 80, referenceLabel: "Normal Dia.", unit: "mmHg" },
  ];
  
  const metricFilterOptions = [
    { id: "all", label: "All Metrics", icon: BarChart3 },
    ...allMetricGraphConfigs.map(m => ({ id: m.key, label: m.name, icon: m.icon }))
  ];

  const displayMetricsConfig = selectedMetricKey === "all" 
    ? allMetricGraphConfigs 
    : allMetricGraphConfigs.filter(m => m.key === selectedMetricKey);

  const handleTimeRangeChange = (value: '24h' | '7d' | '30d' | '90d') => {
    fetchHistoricalData(value);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-primary-500" /> Detailed Health Metrics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Dive deeper into your health data trends over time.</p>
      </header>

      {/* Controls Section */}
      <section className="mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label htmlFor="metricFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Select Metric
            </label>
            <div className="relative">
              <select 
                id="metricFilter"
                value={selectedMetricKey}
                onChange={(e) => setSelectedMetricKey(e.target.value)}
                className="w-full appearance-none input-std pl-3 pr-10"
              >
                {metricFilterOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Time Range
            </label>
            <div className="flex flex-wrap gap-2">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-50",
                    selectedTimeRange === option.value
                      ? "bg-primary-600 text-white focus:ring-primary-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400"
                  )}
                  onClick={() => handleTimeRangeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graphs Section */}
      {historicalData.length === 0 && (
         <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No historical data available.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a time range to view metrics or check back later.</p>
        </div>
      )}

      <div className={cn(
          "grid gap-6",
          displayMetricsConfig.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
      )}>
        {historicalData.length > 0 && displayMetricsConfig.map((metricConfig) => (
          <div key={metricConfig.key} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl">
            <div className="flex items-center mb-4">
              <metricConfig.icon className={cn("w-6 h-6 mr-2.5", metricConfig.color ? "" : "text-primary-500")} style={{color: metricConfig.color || undefined }} />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {metricConfig.name}
              </h2>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              <HealthGraph
                data={historicalData}
                metrics={[metricConfig]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 