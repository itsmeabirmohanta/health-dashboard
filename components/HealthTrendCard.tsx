"use client";

import { useState } from "react";
import { MetricsChart } from "./MetricsChart";
import { HistoricalDataPoint } from "@/types";
import { format, parseISO } from "date-fns";

interface HealthTrendCardProps {
  historicalData: HistoricalDataPoint[];
  title?: string;
  defaultMetrics?: string[];
  selectableMetrics?: Array<{id: string, name: string, color: string}>;
  selectedTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export function HealthTrendCard({
  historicalData,
  title = "Health Trends",
  defaultMetrics = ["heartRate"],
  selectableMetrics = [
    {id: "heartRate", name: "Heart Rate", color: "#ef4444"},
    {id: "bloodOxygen", name: "Blood Oxygen", color: "#3b82f6"},
    {id: "steps", name: "Steps", color: "#22c55e"},
    {id: "sleep", name: "Sleep", color: "#8b5cf6"},
    {id: "bloodPressureSys", name: "Sys Blood Pressure", color: "#f43f5e"},
    {id: "bloodPressureDia", name: "Dia Blood Pressure", color: "#a855f7"},
    {id: "temperature", name: "Temperature", color: "#f97316"},
  ],
  selectedTimeRange = "24h",
  onTimeRangeChange = () => {},
}: HealthTrendCardProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(defaultMetrics);
  
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
  const getStatsForMetric = (metric: string) => {
    if (historicalData.length === 0) return { latest: 0, average: 0, min: 0, max: 0 };
    
    const values = historicalData.map(point => {
      const value = point[metric as keyof HistoricalDataPoint];
      return typeof value === 'number' ? value : 0;
    });
    
    const sum = values.reduce((a, b) => a + b, 0);
    
    return {
      latest: values[values.length - 1],
      average: Math.round((sum / values.length) * 10) / 10,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const timeRanges = [
    { id: "24h", label: "24h" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "90d", label: "90d" },
  ];

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => onTimeRangeChange(range.id)}
              className={`px-3 py-1 text-xs rounded-md transition-all ${
                selectedTimeRange === range.id 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                  : 'text-gray-600 hover:bg-white/70'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {historicalData.length > 0 ? (
        <>
          <div className="mb-6">
            <MetricsChart 
              data={historicalData}
              metrics={selectedMetrics}
              height={250}
              timeFormat={getTimeFormat(selectedTimeRange)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {selectableMetrics.map(metric => (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 ${
                  selectedMetrics.includes(metric.id)
                    ? 'bg-white/80 border border-gray-200 shadow-sm' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: metric.color }}
                ></span>
                {metric.name}
              </button>
            ))}
          </div>

          {selectedMetrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {selectedMetrics.map(metricId => {
                const metric = selectableMetrics.find(m => m.id === metricId);
                const stats = getStatsForMetric(metricId);
                
                return metric ? (
                  <div key={metricId} className="bg-white/40 p-3 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: metric.color }}
                      ></span>
                      <span className="text-sm font-medium">{metric.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500">Latest</div>
                        <div className="font-semibold">{stats.latest}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Average</div>
                        <div className="font-semibold">{stats.average}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Min</div>
                        <div className="font-semibold">{stats.min}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Max</div>
                        <div className="font-semibold">{stats.max}</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-60 bg-white/30 rounded-xl">
          <p className="text-gray-500">No historical data available</p>
        </div>
      )}
    </div>
  );
} 