"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { useHealthStore } from "@/store/useHealthStore";
import { HealthGraph } from "@/components/HealthGraph";
import { ChevronDown, CalendarDays, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [customTimeRange, setCustomTimeRange] = useState({ start: "", end: "" });
  
  const { 
    historicalData,
    fetchHistoricalData,
    selectedTimeRange
  } = useHealthStore(state => ({
    historicalData: state.historicalData,
    fetchHistoricalData: state.fetchHistoricalData,
    selectedTimeRange: state.selectedTimeRange
  }));

  // Handle theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Initial data fetch
  useEffect(() => {
    // Check system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    // Set default dates
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setCustomTimeRange({
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    });
  }, []);

  // Time range options
  const timeRangeOptions: { label: string; value: '24h' | '7d' | '30d' | '90d' }[] = [
    { label: "24 Hours", value: "24h" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
  ];

  // Generate some insights based on the data
  const generateInsights = () => {
    if (historicalData.length === 0) return [];
    
    // This would normally come from a more sophisticated algorithm
    // For now we'll create some example insights
    const insights = [
      {
        id: "sleep-correlation",
        title: "Sleep & Activity Correlation",
        description: "Our analysis shows a strong correlation between your sleep quality and activity levels. Days with 7+ hours of sleep show increased step counts.",
        type: "correlation",
        icon: TrendingUp,
        metrics: [
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
            key: "steps",
            name: "Steps",
            color: "#22c55e",
            yAxisId: "steps",
            domain: [0, 'dataMax'],
            referenceValue: 10000,
            referenceLabel: "Daily Goal",
            unit: ""
          }
        ]
      },
      {
        id: "heart-rate-trend",
        title: "Heart Rate Trend",
        description: "Your resting heart rate has been decreasing over the past month, indicating improved cardiovascular health.",
        type: "trend",
        icon: TrendingDown,
        metrics: [
          {
            key: "heartRate",
            name: "Heart Rate",
            color: "#ef4444",
            yAxisId: "heartRate",
            domain: [40, 180],
            referenceValue: 70,
            referenceLabel: "Resting HR",
            unit: "bpm"
          }
        ]
      },
      {
        id: "oxygen-alert",
        title: "Blood Oxygen Fluctuations",
        description: "We've detected some fluctuations in your blood oxygen levels that may require attention, especially during sleep hours.",
        type: "alert",
        icon: AlertCircle,
        metrics: [
          {
            key: "bloodOxygen",
            name: "Blood Oxygen",
            color: "#3b82f6",
            yAxisId: "bloodOxygen",
            domain: [85, 100],
            referenceValue: 95,
            referenceLabel: "Normal SpO2",
            unit: "%"
          }
        ]
      }
    ];
    
    return insights;
  };

  const insights = generateInsights();

  // Handle custom date range
  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would call a custom function on the store to fetch data for specific dates
    console.log(`Fetching data from ${customTimeRange.start} to ${customTimeRange.end}`);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">In-depth analysis of your health data and personalized insights</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl hover:bg-white/70 transition-all shadow-sm">
            <CalendarDays className="w-4 h-4" />
            <span>Custom Range</span>
          </button>
        </div>
      </div>

      {/* Date Range Controls */}
      <div className="glass rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1 text-sm rounded-md ${
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
      </div>

      {/* Health Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Heart Rate</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">72 BPM</div>
          <div className="text-sm text-gray-500 mt-1">Average over selected period</div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Blood Oxygen</h2>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">98%</div>
          <div className="text-sm text-gray-500 mt-1">Average over selected period</div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sleep Duration</h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900">7.5h</div>
          <div className="text-sm text-gray-500 mt-1">Average over selected period</div>
        </div>
      </div>

      {/* Health Graph */}
      <div className="glass rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Health Metrics Trend</h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm rounded-md bg-white/50 text-gray-700 border border-white/20">
              Heart Rate
            </button>
            <button className="px-3 py-1 text-sm rounded-md text-gray-600 hover:bg-white/50 hover:border hover:border-white/20">
              Blood Oxygen
            </button>
            <button className="px-3 py-1 text-sm rounded-md text-gray-600 hover:bg-white/50 hover:border hover:border-white/20">
              Sleep
            </button>
          </div>
        </div>
        <div className="h-96">
          <HealthGraph 
            data={historicalData}
            metrics={[
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
              }
            ]}
          />
        </div>
      </div>

      {/* Health Insights */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h2>
        <div className="space-y-4">
          {insights.map(insight => {
            const Icon = insight.icon;
            return (
              <div 
                key={insight.id}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedInsight === insight.id 
                    ? "bg-white/50 border border-white/20" 
                    : "hover:bg-white/50 hover:border hover:border-white/20"
                }`}
                onClick={() => setSelectedInsight(
                  selectedInsight === insight.id ? null : insight.id
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/50 rounded-lg">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 