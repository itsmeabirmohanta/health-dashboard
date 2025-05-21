"use client";

import { InlineMetricCard } from "@/components/ui/InlineMetricCard";
import { MetricData } from "@/types";

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
    max: 120,
    color: "#ef4444",
    unit: "bpm",
  },
  bloodOxygen: {
    title: "Blood Oxygen",
    min: 90,
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
    title: "Body Temp",
    min: 95,
    max: 104,
    color: "#d946ef",
    unit: "°F",
  },
  caloriesBurned: {
    title: "Calories",
    min: 0,
    max: 3000,
    color: "#f97316",
    unit: "kcal",
  },
  bloodPressureSystolic: {
    title: "BP Systolic",
    min: 70,
    max: 180,
    color: "#f43f5e",
    unit: "mmHg",
  },
  bloodPressureDiastolic: {
    title: "BP Diastolic",
    min: 40,
    max: 110,
    color: "#ec4899",
    unit: "mmHg",
  },
};

export function MetricsGrid({ metrics, limit }: MetricsGridProps) {
  const displayableMetrics = Object.entries(metrics)
    .filter(([type, data]) => typeof data.value === 'number' && metricsConfig[type])
    .slice(0, limit || Object.keys(metricsConfig).length);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayableMetrics.map(([type, data]) => {
        const config = metricsConfig[type];
        if (!config) return null;

        const numericValue = typeof data.value === 'number' ? data.value : parseFloat(String(data.value));
        const percentage = Math.max(0, Math.min(100, ((numericValue - config.min) / (config.max - config.min)) * 100));

        return (
          <InlineMetricCard
            key={type}
            title={config.title}
            value={numericValue}
            unit={config.unit}
            percentage={percentage}
            color={config.color}
          />
        );
      })}
    </div>
  );
} 