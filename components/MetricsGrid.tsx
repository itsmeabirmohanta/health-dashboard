"use client";

import { MiniMetricGauge } from "./MetricGauge";
import { MetricData, MetricType } from "@/types";

interface MetricsGridProps {
  metrics: Record<string, MetricData>;
  limit?: number;
}

interface MetricConfig {
  title: string;
  min: number;
  max: number;
  color: string;
  unit: string;
}

// Configuration for different types of metrics
const metricsConfig: Record<string, MetricConfig> = {
  heartRate: {
    title: "Heart Rate",
    min: 40,
    max: 200,
    color: "#ef4444",
    unit: "bpm",
  },
  bloodOxygen: {
    title: "Blood Oxygen",
    min: 85,
    max: 100,
    color: "#3b82f6",
    unit: "%",
  },
  steps: {
    title: "Steps",
    min: 0,
    max: 10000,
    color: "#22c55e",
    unit: "steps",
  },
  sleep: {
    title: "Sleep",
    min: 0,
    max: 12,
    color: "#8b5cf6",
    unit: "hours",
  },
  temperature: {
    title: "Temperature",
    min: 95,
    max: 105,
    color: "#f97316",
    unit: "°F",
  },
  caloriesBurned: {
    title: "Calories",
    min: 0,
    max: 3000,
    color: "#ec4899",
    unit: "kcal",
  },
};

export function MetricsGrid({ metrics, limit = 6 }: MetricsGridProps) {
  // Filter metrics that can be displayed as gauges (numeric values)
  const displayableMetrics = Object.entries(metrics)
    .filter(([type, data]) => typeof data.value === "number" && metricsConfig[type])
    .slice(0, limit);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {displayableMetrics.map(([type, data]) => {
        const config = metricsConfig[type];
        return (
          <div key={type} className="glass rounded-xl p-3 flex justify-center hover:shadow-md transition-shadow">
            <MiniMetricGauge
              value={data.value as number}
              min={config.min}
              max={config.max}
              title={config.title}
              unit={data.unit.toString()}
              color={config.color}
            />
          </div>
        );
      })}
    </div>
  );
} 