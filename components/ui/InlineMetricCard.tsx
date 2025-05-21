"use client";

import { cn } from "@/lib/utils";

interface InlineMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  percentage: number; // 0-100
  color?: string; // stroke color for the progress ring
  size?: number; // Diameter of the circle
  strokeWidth?: number;
  className?: string;
}

export function InlineMetricCard({
  title,
  value,
  unit,
  percentage,
  color = "text-blue-500", // Default color
  size = 100, // Default size
  strokeWidth = 8, // Default stroke width
  className,
}: InlineMetricCardProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const ringColorClass = color.startsWith("#") ? undefined : color;
  const ringStyle = color.startsWith("#") ? { stroke: color } : {};

  return (
    <div className={cn("flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className="text-gray-200"
            fill="transparent"
            stroke="currentColor"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            className={cn("transition-all duration-500 ease-out", ringColorClass)}
            style={ringStyle}
            fill="transparent"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-700">{title}</p>
    </div>
  );
} 