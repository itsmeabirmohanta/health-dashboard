"use client";

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { HistoricalDataPoint } from '@/types';
import { cn } from '@/lib/utils';

interface MetricConfig {
  key: string;
  name: string;
  color: string;
  yAxisId: string;
  domain: [number, number] | ['dataMin', 'dataMax'] | [number, 'dataMax'] | ['dataMin', number];
  includeArea?: boolean;
  referenceValue?: number;
  referenceLabel?: string;
  unit: string;
}

interface HealthGraphProps {
  data: HistoricalDataPoint[];
  title?: string;
  description?: string;
  metrics: MetricConfig[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl p-4 shadow-lg">
        <p className="font-medium text-gray-900 mb-2">
          {format(new Date(label), 'MMM d, h:mm a')}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">
                  {entry.name}:
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 ml-3">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
                {entry.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function HealthGraph({ data, title, description, metrics }: HealthGraphProps) {
  const [activeMetrics, setActiveMetrics] = useState<string[]>(metrics.map(m => m.key));

  const handleLegendClick = (entry: any) => {
    const { dataKey } = entry;
    
    setActiveMetrics(prev => {
      if (prev.includes(dataKey)) {
        return prev.filter(key => key !== dataKey);
      } else {
        return [...prev, dataKey];
      }
    });
  };

  // Format timestamps for display in the graph
  const formattedData = data.map(point => ({
    ...point,
    formattedTime: format(new Date(point.timestamp), 'MMM d, HH:mm')
  }));

  return (
    <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.2} vertical={false} />
            
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => format(new Date(value), 'h:mm a')}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#d1d5db"
              tickLine={false}
            />
            
            {/* Create a Y axis for each metric type */}
            {metrics.map(metric => (
              <YAxis
                key={metric.yAxisId}
                yAxisId={metric.yAxisId}
                orientation={metric.yAxisId === "heartRate" ? "left" : "right"}
                domain={metric.domain}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickLine={false}
                stroke="#d1d5db"
                hide={!activeMetrics.includes(metric.key)}
              />
            ))}
            
            <Tooltip 
              content={<CustomTooltip />} 
              wrapperStyle={{ outline: 'none' }}
            />
            
            <Legend 
              onClick={handleLegendClick}
              wrapperStyle={{ paddingTop: 10, fontSize: 12 }}
              formatter={(value, entry) => {
                // @ts-ignore - entry has a dataKey property
                const isActive = activeMetrics.includes(entry.dataKey);
                return (
                  <span className={cn(
                    isActive ? 'text-gray-900' : 'text-gray-400'
                  )}>
                    {value}
                  </span>
                );
              }}
            />
            
            {/* Reference lines for certain metrics */}
            {metrics
              .filter(m => m.referenceValue && activeMetrics.includes(m.key))
              .map(metric => (
                <ReferenceLine
                  key={`ref-${metric.key}`}
                  y={metric.referenceValue}
                  yAxisId={metric.yAxisId}
                  stroke={metric.color}
                  strokeDasharray="3 3"
                  label={{ 
                    value: metric.referenceLabel || `Target: ${metric.referenceValue}`,
                    fill: metric.color,
                    fontSize: 11,
                    position: 'insideBottomLeft'
                  }}
                />
              ))}
            
            {/* Lines for each metric */}
            {metrics.map(metric => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.name}
                yAxisId={metric.yAxisId}
                stroke={metric.color}
                activeDot={{ r: 5, stroke: metric.color, strokeWidth: 1 }}
                dot={{ r: 3, stroke: metric.color, strokeWidth: 1, fill: '#fff' }}
                strokeWidth={2}
                connectNulls
                hide={!activeMetrics.includes(metric.key)}
                unit={metric.unit}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 