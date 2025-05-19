"use client";

import React from "react";

interface DataPoint {
  time: string;
  value: number;
}

interface ActivityChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  activeBar?: number;
}

export function ActivityChart({ 
  data, 
  height = 120, 
  color = "#ef4444", 
  activeBar = 5 
}: ActivityChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 100);

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="h-full flex items-end space-x-1">
        {data.map((point, i) => {
          const heightPercent = (point.value / maxValue) * 100;
          return (
            <div 
              key={point.time} 
              className="flex-1 flex flex-col items-center"
            >
              <div 
                className={`w-full rounded-t-md ${i === activeBar ? 'bg-gradient-to-t from-red-500 to-red-400' : 'bg-gray-200'}`}
                style={{ height: `${heightPercent}%` }}
              ></div>
              <div className="text-xs text-gray-400 mt-1">{point.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 