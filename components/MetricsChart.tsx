"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend
} from "recharts";
import { format, parseISO } from "date-fns";
import { HistoricalDataPoint } from "@/types";

interface MetricsChartProps {
  data: HistoricalDataPoint[];
  metrics: string[];
  height?: number;
  colors?: Record<string, string>;
  timeFormat?: string;
  showLegend?: boolean;
}

export function MetricsChart({
  data,
  metrics,
  height = 300,
  colors = {
    heartRate: "#ef4444",
    bloodOxygen: "#3b82f6",
    steps: "#22c55e",
    sleep: "#8b5cf6",
    temperature: "#f97316",
    bloodPressureSys: "#f43f5e",
    bloodPressureDia: "#a855f7",
    caloriesBurned: "#ec4899"
  },
  timeFormat = "HH:mm",
  showLegend = true
}: MetricsChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => {
      const timestamp = parseISO(point.timestamp);
      return {
        time: format(timestamp, timeFormat),
        date: format(timestamp, "MMM dd"),
        ...point
      };
    });
  }, [data, timeFormat]);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            {metrics.map(metric => (
              <linearGradient key={metric} id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[metric]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colors[metric]} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="time" 
            stroke="#888" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#888" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(255, 255, 255, 0.8)", 
              border: "none", 
              borderRadius: "8px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
            }} 
            formatter={(value, name) => [`${value}`, name]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          {showLegend && <Legend />}
          {metrics.map(metric => (
            <Area
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={colors[metric]}
              fillOpacity={1}
              fill={`url(#gradient-${metric})`}
              strokeWidth={2}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 