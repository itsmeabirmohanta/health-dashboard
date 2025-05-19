"use client";

import React from 'react';
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
import { ChevronRight } from 'lucide-react';

export default function TrendsPage() {
  const trendData = {
    bloodPressure: [
      { date: '2024-01', systolic: 120, diastolic: 80 },
      { date: '2024-02', systolic: 118, diastolic: 78 },
      { date: '2024-03', systolic: 122, diastolic: 82 },
    ],
    weight: [
      { date: '2024-01', value: 70.5 },
      { date: '2024-02', value: 70.2 },
      { date: '2024-03', value: 69.8 },
    ],
    sleep: [
      { date: '2024-01', hours: 7.5 },
      { date: '2024-02', hours: 7.2 },
      { date: '2024-03', hours: 7.8 },
    ]
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Health Trends</h1>
          <p className="text-sm text-gray-500 mt-1">Visualize your health metrics over time</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-white/20 text-gray-700 rounded-xl hover:bg-white/70 transition-all shadow-sm">
            <ChevronRight className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Blood Pressure Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.bloodPressure}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Systolic"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Diastolic"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <button className="flex items-center text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
              View detailed report <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Weight Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.weight}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Weight (kg)"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <button className="flex items-center text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
              View detailed report <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Sleep Pattern</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData.sleep}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Sleep Duration"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <button className="flex items-center text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
              View detailed report <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Trend Analysis</h2>
          <div className="space-y-4">
            <div className="p-4 bg-white/50 rounded-xl shadow-sm">
              <h3 className="font-medium text-green-700">Positive Trends</h3>
              <p className="mt-2 text-sm text-gray-600">
                Weight is showing a steady decrease, indicating good progress towards fitness goals.
              </p>
            </div>
            
            <div className="p-4 bg-white/50 rounded-xl shadow-sm">
              <h3 className="font-medium text-blue-700">Recommendations</h3>
              <p className="mt-2 text-sm text-gray-600">
                Consider increasing sleep duration slightly to reach the optimal 8-hour target.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 