"use client";

import { useState } from "react";
import { MetricsChart } from "./MetricsChart";
import { HistoricalDataPoint } from "@/types";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HealthTrendCardProps {
  historicalData: HistoricalDataPoint[];
  title?: string;
  defaultMetrics?: string[];
  selectableMetrics?: Array<{id: string, name: string, color: string, unit: string}>;
  selectedTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export function HealthTrendCard({
  historicalData,
  title = "Health Trends",
  defaultMetrics = ["heartRate"],
  selectableMetrics = [
    {id: "heartRate", name: "Heart Rate", color: "#ef4444", unit: "bpm"},
    {id: "bloodOxygen", name: "Blood Oxygen", color: "#3b82f6", unit: "%"},
    {id: "steps", name: "Steps", color: "#22c55e", unit: "steps"},
    {id: "sleep", name: "Sleep", color: "#8b5cf6", unit: "hrs"},
    {id: "bloodPressureSys", name: "Systolic BP", color: "#f43f5e", unit: "mmHg"},
    {id: "bloodPressureDia", name: "Diastolic BP", color: "#a855f7", unit: "mmHg"},
    {id: "temperature", name: "Temperature", color: "#f97316", unit: "°C"},
  ],
  selectedTimeRange = "24h",
  onTimeRangeChange = () => {},
}: HealthTrendCardProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(defaultMetrics);
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>(defaultMetrics);
  
  // Generate proper time format based on time range
  const getTimeFormat = (range: string): string => {
    switch (range) {
      case "24h": return "HH:mm";
      case "7d": return "EEE";
      case "30d":
      case "90d": 
      default: return "MMM dd";
    }
  };

  // Calculate some basic stats
  const getStatsForMetric = (metricId: string) => {
    if (historicalData.length === 0) return { latest: 0, average: 0, min: 0, max: 0, change: 0 };
    
    const values = historicalData.map(point => {
      const value = point[metricId as keyof HistoricalDataPoint];
      return typeof value === 'number' ? value : 0;
    }).filter(v => v !== undefined && v !== null);

    if (values.length === 0) return { latest: 0, average: 0, min: 0, max: 0, change: 0 };
    
    const sum = values.reduce((a, b) => a + b, 0);
    const latest = values[values.length - 1];
    const previous = values.length > 1 ? values[values.length - 2] : latest;
    const change = latest - previous;
    
    return {
      latest: latest,
      average: Math.round((sum / values.length) * 10) / 10,
      min: Math.min(...values),
      max: Math.max(...values),
      change: Math.round(change * 10) / 10,
    };
  };

  const timeRanges = [
    { id: "24h", label: "24H" },
    { id: "7d", label: "7D" },
    { id: "30d", label: "30D" },
    { id: "90d", label: "90D" },
  ];

  const toggleMetricSelection = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) ? prev.filter(id => id !== metricId) : [...prev, metricId]
    );
    // Keep metric expanded if selected, collapse if deselected
    if (!selectedMetrics.includes(metricId)) {
      setExpandedMetrics(prev => [...prev, metricId]);
    } else {
      setExpandedMetrics(prev => prev.filter(id => id !== metricId));
    }
  };

  const toggleMetricExpansion = (metricId: string) => {
    setExpandedMetrics(prev => 
      prev.includes(metricId) ? prev.filter(id => id !== metricId) : [...prev, metricId]
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        {title && <h2 className="card-title">{title}</h2>}
        <div className="flex space-x-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-lg shadow-sm">
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => onTimeRangeChange(range.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                selectedTimeRange === range.id 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/60'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {historicalData.length > 0 ? (
        <>
          <div className="h-[280px] mb-6 relative min-w-0">
            <MetricsChart 
              data={historicalData}
              metrics={selectedMetrics}
              height={280}
              timeFormat={getTimeFormat(selectedTimeRange)}
            />
          </div>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {selectableMetrics.map(metric => {
              const isSelected = selectedMetrics.includes(metric.id);
              const isExpanded = expandedMetrics.includes(metric.id);
              const stats = getStatsForMetric(metric.id);

              return (
                <div key={metric.id} className={`p-3 rounded-lg transition-all duration-200 ${
                  isSelected ? 'bg-white/60 dark:bg-gray-700/50 shadow-sm' : 'bg-white/30 dark:bg-gray-800/30'
                }`}>
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMetricExpansion(metric.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleMetricSelection(metric.id)}
                        onClick={(e) => e.stopPropagation()} // Prevent expansion toggle when clicking checkbox
                        className="form-checkbox h-4 w-4 rounded text-red-500 focus:ring-red-500/50 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-red-500 transition-colors duration-150"
                        style={{'--tw-ring-color': metric.color} as React.CSSProperties}
                      />
                      <span 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: metric.color }}
                      ></span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{metric.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stats.latest} <span className="text-xs text-gray-500 dark:text-gray-400">{metric.unit}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs min-w-0">
                        <div className="flex flex-col min-w-0">
                          <span className="text-gray-500 dark:text-gray-400 truncate">Avg</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-200 truncate">{stats.average} {metric.unit}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-gray-500 dark:text-gray-400 truncate">Min</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-200 truncate">{stats.min} {metric.unit}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-gray-500 dark:text-gray-400 truncate">Max</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-200 truncate">{stats.max} {metric.unit}</span>
                        </div>
                        <div className={`flex flex-col col-span-2 sm:col-span-1 ${stats.change >= 0 ? 'text-green-500' : 'text-red-500'} min-w-0`}>
                          <span className="text-gray-500 dark:text-gray-400 truncate">Change</span>
                          <span className="font-semibold truncate">
                            {stats.change >= 0 ? '+' : ''}{stats.change} {metric.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[350px] bg-white/30 dark:bg-gray-800/30 rounded-xl min-w-0">
          <p className="text-gray-500 dark:text-gray-400">No historical data available</p>
        </div>
      )}
    </div>
  );
} 