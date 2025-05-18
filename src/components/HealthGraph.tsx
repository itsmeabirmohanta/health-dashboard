import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { HistoricalDataPoint } from '../types/health';

interface HealthGraphProps {
  data: HistoricalDataPoint[];
  selectedMetrics: string[];
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm text-gray-600">
                <span className="font-medium">{entry.name}:</span> {entry.value}
                {entry.name === 'Heart Rate' && ' bpm'}
                {entry.name === 'Blood Oxygen' && '%'}
                {entry.name === 'Sleep' && ' hrs'}
                {entry.name === 'Temperature' && '°F'}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const HealthGraph: React.FC<HealthGraphProps> = ({ data, selectedMetrics }) => {
  const [opacity, setOpacity] = useState<{ [key: string]: number }>({
    heartRate: 1,
    bloodOxygen: 1,
    sleep: 1,
    steps: 1,
    temperature: 1
  });

  const formattedData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'h:mm a')
  }));

  const handleLegendClick = (dataKey: string) => {
    setOpacity({
      ...opacity,
      [dataKey]: opacity[dataKey] === 0 ? 1 : 0
    });
  };

  const metricConfig = {
    heartRate: { color: '#ef4444', name: 'Heart Rate' },
    bloodOxygen: { color: '#3b82f6', name: 'Blood Oxygen' },
    sleep: { color: '#6366f1', name: 'Sleep' },
    steps: { color: '#22c55e', name: 'Steps' },
    temperature: { color: '#f97316', name: 'Temperature' }
  };

  // Handle empty data gracefully
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        No data available to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="time" 
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        
        {/* Multiple YAxis for different metrics */}
        {selectedMetrics.includes('heartRate') && (
          <YAxis 
            yAxisId="heartRate" 
            orientation="left" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[40, 180]}
            hide={!selectedMetrics.includes('heartRate')}
          />
        )}
        
        {selectedMetrics.includes('bloodOxygen') && (
          <YAxis 
            yAxisId="bloodOxygen" 
            orientation="right" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[85, 100]}
            hide={!selectedMetrics.includes('bloodOxygen')}
          />
        )}
        
        {selectedMetrics.includes('sleep') && (
          <YAxis 
            yAxisId="sleep" 
            orientation="right" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[0, 12]}
            hide={!selectedMetrics.includes('sleep')}
          />
        )}
        
        {selectedMetrics.includes('steps') && (
          <YAxis 
            yAxisId="steps" 
            orientation="right" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[0, 'dataMax']}
            hide={!selectedMetrics.includes('steps')}
          />
        )}
        
        {selectedMetrics.includes('temperature') && (
          <YAxis 
            yAxisId="temperature" 
            orientation="right" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={[96, 104]}
            hide={!selectedMetrics.includes('temperature')}
          />
        )}
        
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          onClick={(e) => handleLegendClick(e.dataKey)}
          iconType="circle"
          wrapperStyle={{ fontSize: '12px' }}
        />
        
        {selectedMetrics.includes('heartRate') && (
          <Line
            type="monotone"
            dataKey="heartRate"
            name="Heart Rate"
            stroke={metricConfig.heartRate.color}
            yAxisId="heartRate"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={opacity.heartRate}
          />
        )}
        
        {selectedMetrics.includes('bloodOxygen') && (
          <Line
            type="monotone"
            dataKey="bloodOxygen"
            name="Blood Oxygen"
            stroke={metricConfig.bloodOxygen.color}
            yAxisId="bloodOxygen"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={opacity.bloodOxygen}
          />
        )}
        
        {selectedMetrics.includes('sleep') && (
          <Line
            type="monotone"
            dataKey="sleep"
            name="Sleep"
            stroke={metricConfig.sleep.color}
            yAxisId="sleep"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={opacity.sleep}
          />
        )}
        
        {selectedMetrics.includes('steps') && (
          <Line
            type="monotone"
            dataKey="steps"
            name="Steps"
            stroke={metricConfig.steps.color}
            yAxisId="steps"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={opacity.steps}
          />
        )}
        
        {selectedMetrics.includes('temperature') && (
          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature"
            stroke={metricConfig.temperature.color}
            yAxisId="temperature"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            strokeOpacity={opacity.temperature}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HealthGraph;