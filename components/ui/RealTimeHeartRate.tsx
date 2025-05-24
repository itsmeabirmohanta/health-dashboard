import React from 'react';
import { HeartRateMonitor } from './HeartRateMonitor';

interface HeartRateMetrics {
  current: number;
  min: number;
  max: number;
  avg: number;
  resting: number;
}

interface RealTimeHeartRateProps {
  metrics: HeartRateMetrics;
  className?: string;
  timeFrame?: 'Live' | 'Last 24h';
  onTimeFrameChange?: (timeFrame: 'Live' | 'Last 24h') => void;
}

export function RealTimeHeartRate({ 
  metrics, 
  className = '', 
  timeFrame = 'Live',
  onTimeFrameChange = () => {}
}: RealTimeHeartRateProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Real-time Heart Rate</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onTimeFrameChange('Live')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              timeFrame === 'Live' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Live
          </button>
          <button 
            onClick={() => onTimeFrameChange('Last 24h')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              timeFrame === 'Last 24h' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Last 24h
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
        {/* Heart Rate Monitor */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <HeartRateMonitor 
              value={metrics.current} 
              showAnimation={true}
              size="lg"
            />
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Min Today</div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {metrics.min} <span className="text-gray-500 text-base font-normal">bpm</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Max Today</div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {metrics.max} <span className="text-gray-500 text-base font-normal">bpm</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Today</div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {metrics.avg} <span className="text-gray-500 text-base font-normal">bpm</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">Resting HR</div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {metrics.resting} <span className="text-gray-500 text-base font-normal">bpm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealTimeHeartRate; 