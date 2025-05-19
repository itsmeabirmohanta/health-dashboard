"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

// Simulated real-time data generation
function generateRandomData(current: number, variance: number): number {
  return Math.max(0, current + (Math.random() - 0.5) * variance);
}

export default function RealTimePage() {
  const [heartRate, setHeartRate] = useState(75);
  const [bloodOxygen, setBloodOxygen] = useState(98);
  const [activity, setActivity] = useState({ type: "Walking", duration: 15 });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => Math.round(generateRandomData(prev, 4)));
      setBloodOxygen(prev => Math.min(100, Math.round(generateRandomData(prev, 1))));
      setActivity(prev => ({
        ...prev,
        duration: prev.duration + 1/60
      }));
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Real-Time Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Heart Rate Monitor */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Heart Rate</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
              Live
            </span>
          </div>
          <div className="text-4xl font-bold text-center my-8">
            {heartRate} <span className="text-lg font-normal text-gray-500">BPM</span>
          </div>
          <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
            <div className="flex items-center justify-center h-full text-gray-500">
              Live Heart Rate Graph
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </Card>

        {/* Blood Oxygen */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Blood Oxygen</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
              Live
            </span>
          </div>
          <div className="text-4xl font-bold text-center my-8">
            {bloodOxygen}<span className="text-lg font-normal text-gray-500">%</span>
          </div>
          <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
            <div className="flex items-center justify-center h-full text-gray-500">
              Live SpO2 Graph
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </Card>

        {/* Activity Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Activity Status</h2>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
              Live
            </span>
          </div>
          <div className="text-center my-8">
            <div className="text-2xl font-semibold">{activity.type}</div>
            <div className="text-gray-500 mt-2">
              Duration: {Math.floor(activity.duration)} minutes
            </div>
          </div>
          <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
            <div className="flex items-center justify-center h-full text-gray-500">
              Live Activity Graph
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </Card>
      </div>

      {/* Alert Panel */}
      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">Real-Time Alerts</h2>
        <div className="space-y-4">
          {heartRate > 90 && (
            <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <div>
                <h3 className="font-medium text-yellow-700 dark:text-yellow-300">
                  Elevated Heart Rate
                </h3>
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                  Heart rate above normal range. Consider taking a break.
                </p>
              </div>
            </div>
          )}
          {bloodOxygen < 95 && (
            <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              <div>
                <h3 className="font-medium text-red-700 dark:text-red-300">
                  Low Blood Oxygen
                </h3>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Blood oxygen level below normal range.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Connection Status */}
      <div className="mt-6 flex items-center text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Connected to Device
        <span className="ml-4">Signal Strength: Excellent</span>
      </div>
    </div>
  );
} 