"use client";

import React, { useState, useEffect } from 'react';
import { HeartRateMonitor } from '@/components/ui/HeartRateMonitor';
import { Activity, Droplets } from 'lucide-react';

export default function RealTimePage() {
  const [heartRate, setHeartRate] = useState(72);
  const [spo2, setSpo2] = useState(98);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Simulate real-time data changes
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(60, Math.min(100, prev + change));
      });
      
      setSpo2(prev => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(95, Math.min(100, prev + change));
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
        <p className="text-slate-500 dark:text-slate-400">
          View your real-time health metrics
        </p>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Heart Rate</h2>
          <div className="flex justify-center py-4">
            <HeartRateMonitor 
              value={heartRate}
              showAnimation={true}
              size="lg"
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Blood Oxygen</h2>
          <div className="flex justify-center items-center py-4">
            <div className="relative flex flex-col items-center p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-4">
                <Droplets className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {spo2}%
              </div>
              <div className="text-sm text-slate-500 mt-2">
                {spo2 >= 98 ? 'Optimal' : spo2 >= 95 ? 'Normal' : 'Low'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Activity Level</h2>
          <div className="flex items-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Current</div>
              <div className="text-2xl font-bold">Moderate</div>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Low</span>
            <span>Moderate</span>
            <span>High</span>
            <span>Intense</span>
          </div>
        </div>
      </div>
    </div>
  );
} 