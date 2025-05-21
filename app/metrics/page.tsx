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
  Filter
} from "lucide-react";
import { HealthGraph } from "@/components/HealthGraph";

export default function MetricsPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>("all");
  
  const { 
    currentMetrics,
    historicalData,
    fetchHistoricalData,
    selectedTimeRange
  } = useHealthStore(state => ({
    currentMetrics: state.currentMetrics,
    historicalData: state.historicalData,
    fetchHistoricalData: state.fetchHistoricalData,
    selectedTimeRange: state.selectedTimeRange
  }));

  // Initial data fetch
  useEffect(() => {
    fetchHistoricalData('24h');
  }, [fetchHistoricalData]);

  // Time range options
  const timeRangeOptions: { label: string; value: '24h' | '7d' | '30d' | '90d' }[] = [
    { label: "24 Hours", value: "24h" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  // Available metrics filters
  const metricFilters = [
    { id: "all", label: "All Metrics", icon: Filter },
    { id: "heartRate", label: "Heart Rate", icon: Heart },
    { id: "bloodOxygen", label: "Blood Oxygen", icon: Droplets },
    { id: "steps", label: "Steps", icon: Activity },
    { id: "sleep", label: "Sleep", icon: Moon },
    { id: "temperature", label: "Temperature", icon: Thermometer },
    { id: "weight", label: "Weight", icon: Scale }
  ];

  // Get metrics based on selection
  const getFilteredMetrics = () => {
    if (selectedMetric === "all") {
      return [
        {
          key: "heartRate",
          name: "Heart Rate",
          color: "#ef4444",
          yAxisId: "heartRate",
          domain: [40, 180],
          referenceValue: 70,
          referenceLabel: "Resting HR",
          unit: "bpm"
        },
        {
          key: "bloodOxygen",
          name: "Blood Oxygen",
          color: "#3b82f6", 
          yAxisId: "bloodOxygen",
          domain: [85, 100],
          referenceValue: 95,
          referenceLabel: "Normal SpO2",
          unit: "%"
        },
        {
          key: "steps",
          name: "Steps",
          color: "#22c55e",
          yAxisId: "steps",
          domain: [0, 'dataMax'],
          referenceValue: 10000,
          referenceLabel: "Daily Goal",
          unit: ""
        },
        {
          key: "sleep",
          name: "Sleep",
          color: "#8b5cf6",
          yAxisId: "sleep",
          domain: [0, 12],
          referenceValue: 8,
          referenceLabel: "Optimal Sleep",
          unit: "h"
        },
        {
          key: "temperature",
          name: "Temperature",
          color: "#f59e0b",
          yAxisId: "temperature",
          domain: [96, 104],
          referenceValue: 98.6,
          referenceLabel: "Normal",
          unit: "°F"
        },
        {
          key: "weight",
          name: "Weight",
          color: "#8b5cf6",
          yAxisId: "weight",
          domain: ['dataMin - 10', 'dataMax + 10'],
          referenceValue: null,
          referenceLabel: "",
          unit: "lbs"
        }
      ].filter(metric => selectedMetric === "all" || metric.key === selectedMetric);
    } else {
      // Return only the selected metric
      const metricConfig = {
        heartRate: {
          key: "heartRate",
          name: "Heart Rate",
          color: "#ef4444",
          yAxisId: "heartRate",
          domain: [40, 180],
          referenceValue: 70,
          referenceLabel: "Resting HR",
          unit: "bpm"
        },
        bloodOxygen: {
          key: "bloodOxygen",
          name: "Blood Oxygen",
          color: "#3b82f6", 
          yAxisId: "bloodOxygen",
          domain: [85, 100],
          referenceValue: 95,
          referenceLabel: "Normal SpO2",
          unit: "%"
        },
        steps: {
          key: "steps",
          name: "Steps",
          color: "#22c55e",
          yAxisId: "steps",
          domain: [0, 'dataMax'],
          referenceValue: 10000,
          referenceLabel: "Daily Goal",
          unit: ""
        },
        sleep: {
          key: "sleep",
          name: "Sleep",
          color: "#8b5cf6",
          yAxisId: "sleep",
          domain: [0, 12],
          referenceValue: 8,
          referenceLabel: "Optimal Sleep",
          unit: "h"
        },
        temperature: {
          key: "temperature",
          name: "Temperature",
          color: "#f59e0b",
          yAxisId: "temperature",
          domain: [96, 104],
          referenceValue: 98.6,
          referenceLabel: "Normal",
          unit: "°F"
        },
        weight: {
          key: "weight",
          name: "Weight",
          color: "#8b5cf6",
          yAxisId: "weight",
          domain: ['dataMin - 10', 'dataMax + 10'],
          referenceValue: null,
          referenceLabel: "",
          unit: "lbs"
        }
      };
      
      return [metricConfig[selectedMetric as keyof typeof metricConfig]];
    }
  };

  // Get title based on selected metric
  const getDetailTitle = () => {
    if (selectedMetric === "all") return "All Health Metrics";
    const metric = metricFilters.find(m => m.id === selectedMetric);
    return metric ? `${metric.label} Details` : "Metric Details";
  };

  const filteredMetrics = getFilteredMetrics();

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Health Metrics</h1>
          <p className="text-sm text-gray-500 mt-1">Track and analyze your health data</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl hover:bg-white/70 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            <span>Filter Metrics</span>
          </button>
        </div>
      </div>

      {/* Metric Filters */}
      <div className="glass rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          {metricFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  selectedMetric === filter.id
                    ? "bg-white/50 text-gray-700 border border-white/20"
                    : "text-gray-600 hover:bg-white/50 hover:border hover:border-white/20"
                }`}
                onClick={() => setSelectedMetric(filter.id)}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Range Controls */}
      <div className="glass rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-wrap gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedTimeRange === option.value
                  ? "bg-white/50 text-gray-700 border border-white/20"
                  : "text-gray-600 hover:bg-white/50 hover:border hover:border-white/20"
              }`}
              onClick={() => fetchHistoricalData(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {Object.entries(currentMetrics).map(([key, metric]) => {
          const Icon = metricFilters.find(f => f.id === key)?.icon || Filter;
          return (
            <div key={key} className="glass rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{metricFilters.find(f => f.id === key)?.label}</h2>
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {typeof metric.value === 'object' 
                  ? `${(metric.value as any).sys}/${(metric.value as any).dia}`
                  : (
                     <>
                       {metric.value}
                       {metric.unit && <span className="text-sm font-normal ml-1">{metric.unit}</span>}
                     </>
                   )
                }
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(metric.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Data Graph */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Historical Data</h2>
          <div className="flex items-center gap-2">
            {metricFilters.slice(1).map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  className={`p-2 rounded-lg transition-all ${
                    selectedMetric === filter.id
                      ? "bg-white/50 text-gray-700 border border-white/20"
                      : "text-gray-600 hover:bg-white/50 hover:border hover:border-white/20"
                  }`}
                  onClick={() => setSelectedMetric(filter.id)}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-96">
          <HealthGraph 
            data={historicalData}
            metrics={[
              {
                key: selectedMetric === "all" ? "heartRate" : selectedMetric,
                name: metricFilters.find(f => f.id === (selectedMetric === "all" ? "heartRate" : selectedMetric))?.label || "",
                color: "#ef4444",
                yAxisId: selectedMetric === "all" ? "heartRate" : selectedMetric,
                domain: [0, 'dataMax'],
                unit: ""
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
} 