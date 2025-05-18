import React, { useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import HealthGraph from '../components/HealthGraph';
import { useHealthDataStore } from '../stores/healthDataStore';
import { useSettingsStore } from '../stores/settingsStore';
import DashboardHeader from '../components/DashboardHeader';
import { HeartPulse, Droplets, Moon, Activity, Thermometer } from 'lucide-react';
import { getRandomValue } from '../utils/dataUtils';

const Dashboard: React.FC = () => {
  const { 
    healthData, 
    syncData, 
    selectedDateRange, 
    setSelectedDateRange,
    selectedMetrics,
    toggleMetric
  } = useHealthDataStore();
  
  const { syncFrequency } = useSettingsStore();

  // Simulate data syncing on component mount and at intervals
  useEffect(() => {
    // Initial sync
    syncData();
    
    // Set up interval for syncing
    const interval = setInterval(() => {
      syncData();
    }, syncFrequency * 1000);
    
    return () => clearInterval(interval);
  }, [syncData, syncFrequency]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard 
          title="Heart Rate" 
          value={`${healthData.currentData.heartRate} bpm`}
          icon={<HeartPulse className="text-red-500" />}
          change={getRandomValue(-5, 5)}
          color="red"
          thresholds={{
            warning: { min: 100, max: 120 },
            alert: { min: 120, max: Infinity }
          }}
          currentValue={healthData.currentData.heartRate}
        />
        
        <MetricCard 
          title="Blood Oxygen" 
          value={`${healthData.currentData.bloodOxygen}%`}
          icon={<Droplets className="text-blue-500" />}
          change={getRandomValue(-2, 2)}
          color="blue"
          thresholds={{
            warning: { min: -Infinity, max: 95 },
            alert: { min: -Infinity, max: 90 }
          }}
          currentValue={healthData.currentData.bloodOxygen}
        />
        
        <MetricCard 
          title="Sleep" 
          value={`${healthData.currentData.sleep} hrs`}
          icon={<Moon className="text-indigo-500" />}
          change={getRandomValue(-1, 1)}
          color="indigo"
          thresholds={{
            warning: { min: -Infinity, max: 6 },
            alert: { min: -Infinity, max: 5 }
          }}
          currentValue={healthData.currentData.sleep}
        />
        
        <MetricCard 
          title="Steps" 
          value={healthData.currentData.steps.toLocaleString()}
          icon={<Activity className="text-green-500" />}
          change={getRandomValue(100, 500)}
          color="green"
          thresholds={{
            warning: { min: -Infinity, max: 4000 },
            alert: { min: -Infinity, max: 2000 }
          }}
          currentValue={healthData.currentData.steps}
        />
        
        <MetricCard 
          title="Temperature" 
          value={`${healthData.currentData.temperature}°F`}
          icon={<Thermometer className="text-orange-500" />}
          change={getRandomValue(-0.5, 0.5)}
          color="orange"
          thresholds={{
            warning: { min: 99, max: 100 },
            alert: { min: 100, max: Infinity }
          }}
          currentValue={healthData.currentData.temperature}
        />
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Health Metrics Over Time</h2>
          
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <button 
              onClick={() => setSelectedDateRange('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedDateRange === 'day' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day
            </button>
            <button 
              onClick={() => setSelectedDateRange('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedDateRange === 'week' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setSelectedDateRange('month')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedDateRange === 'month' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => toggleMetric('heartRate')}
            className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
              selectedMetrics.includes('heartRate')
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <HeartPulse size={16} />
            Heart Rate
          </button>
          
          <button
            onClick={() => toggleMetric('bloodOxygen')}
            className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
              selectedMetrics.includes('bloodOxygen')
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Droplets size={16} />
            Blood Oxygen
          </button>
          
          <button
            onClick={() => toggleMetric('sleep')}
            className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
              selectedMetrics.includes('sleep')
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Moon size={16} />
            Sleep
          </button>
          
          <button
            onClick={() => toggleMetric('steps')}
            className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
              selectedMetrics.includes('steps')
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Activity size={16} />
            Steps
          </button>
          
          <button
            onClick={() => toggleMetric('temperature')}
            className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
              selectedMetrics.includes('temperature')
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Thermometer size={16} />
            Temperature
          </button>
        </div>
        
        <div className="h-[400px]">
          <HealthGraph 
            data={healthData.historicalData} 
            selectedMetrics={selectedMetrics} 
          />
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Health Insights</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800">Device Sync Status</h3>
            <p className="text-blue-700 mt-1">Last synced: Just now</p>
          </div>
          
          {healthData.currentData.heartRate > 100 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h3 className="font-medium text-yellow-800">Heart Rate Alert</h3>
              <p className="text-yellow-700 mt-1">Your heart rate is elevated at {healthData.currentData.heartRate} bpm. Consider resting.</p>
            </div>
          )}
          
          {healthData.currentData.bloodOxygen < 95 && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <h3 className="font-medium text-red-800">Blood Oxygen Alert</h3>
              <p className="text-red-700 mt-1">Your blood oxygen is below normal at {healthData.currentData.bloodOxygen}%. Consider consulting a doctor.</p>
            </div>
          )}
          
          {healthData.currentData.steps < 5000 && (
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <h3 className="font-medium text-indigo-800">Activity Reminder</h3>
              <p className="text-indigo-700 mt-1">You've taken {healthData.currentData.steps} steps today. Try to reach at least 10,000 steps.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;