"use client";

import {
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface MetricGaugeProps {
  value: number;
  min: number;
  max: number;
  title: string;
  unit: string;
  color?: string;
  size?: number;
}

export function MetricGauge({
  value,
  min,
  max,
  title,
  unit,
  color = "#ef4444",
  size = 200,
}: MetricGaugeProps) {
  // Calculate percentage for the gauge
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Data for the radial chart
  const data = [
    { name: "value", value: percentage },
  ];
  
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={15} 
          data={data} 
          startAngle={180} 
          endAngle={-180}
        >
          <RadialBar
            background={{ fill: "#f3f4f6" }}
            dataKey="value"
            cornerRadius={15}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={color} />
            ))}
          </RadialBar>
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
        <span className="text-base font-medium mt-2">{title}</span>
      </div>
    </div>
  );
}

// Used for smaller metric displays
export function MiniMetricGauge({
  value,
  min,
  max,
  title,
  unit,
  color = "#ef4444",
  size = 100,
}: MetricGaugeProps) {
  // Calculate percentage for the gauge
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  
  // Data for the pie chart
  const data = [
    { name: "value", value: percentage },
    { name: "remaining", value: 100 - percentage },
  ];
  
  return (
    <div className="flex flex-col items-center" style={{ width: size, height: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#f3f4f6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold">{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <span className="text-xs font-medium mt-1">{title}</span>
    </div>
  );
} 