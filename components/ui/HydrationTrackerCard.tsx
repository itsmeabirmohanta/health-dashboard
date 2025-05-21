"use client";

import React, { useState } from 'react';
import { HydrationSummary, HydrationLog } from '@/types';
import { Droplet, GlassWater, PlusCircle, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface HydrationTrackerCardProps {
  summary?: HydrationSummary;
  className?: string;
  onLogWater?: (amount: number) => void; // Mock handler for logging water
}

export const HydrationTrackerCard: React.FC<HydrationTrackerCardProps> = ({ summary, className, onLogWater }) => {
  // Use internal state if you want the card to manage its own data after initial prop
  // For now, it directly uses the summary prop.

  const [isLoading, setIsLoading] = useState(false); // For mock logging delay

  const handleLogWaterClick = (amount: number) => {
    if (onLogWater) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        onLogWater(amount);
        setIsLoading(false);
        // In a real app, summary would update via props from a store
      }, 500);
    }
  };

  if (!summary) {
    return (
      <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <GlassWater className="w-5 h-5 mr-2 text-blue-500" />
          Hydration Tracker
        </h2>
        <div className="text-center py-4">
            <Info className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No hydration data for today.</p>
        </div>
      </div>
    );
  }

  const { totalIntake, targetIntake = 2000, logs } = summary;
  const progressPercentage = targetIntake > 0 ? Math.min((totalIntake / targetIntake) * 100, 100) : 0;
  const isGoalReached = totalIntake >= targetIntake;

  return (
    <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <GlassWater className="w-5 h-5 mr-2 text-blue-500" />
          Hydration Tracker
        </h2>
        {isGoalReached && <Check className="w-5 h-5 text-green-500" />}
      </div>

      {/* Progress Bar / Visual */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline text-sm mb-1">
          <span className="font-medium text-gray-700 dark:text-gray-200">Daily Intake:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {totalIntake.toLocaleString()}ml / {targetIntake.toLocaleString()}ml
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3.5 relative overflow-hidden">
          <div 
            className="bg-blue-500 h-3.5 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
            style={{ width: `${progressPercentage}%` }}
          >
            {progressPercentage > 10 && (
                <span className="text-xs font-medium text-white/80">{progressPercentage.toFixed(0)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
        {[150, 250, 500].map(amount => (
          <button 
            key={amount}
            onClick={() => handleLogWaterClick(amount)}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-white/50 dark:bg-gray-700/60 border border-gray-200/80 dark:border-gray-600/80 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-700/50 hover:border-blue-300 dark:hover:border-blue-500 transition-all text-blue-600 dark:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-4 h-4" /> {amount}ml
          </button>
        ))}
      </div>

      {/* Recent Logs (Optional - could be a toggle) */}
      {logs && logs.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Recent logs:</p>
          <div className="space-y-1 max-h-24 overflow-y-auto pr-1 text-xs">
            {logs.slice().reverse().slice(0, 3).map(log => (
              <div key={log.id} className="flex justify-between items-center p-1.5 bg-gray-50 dark:bg-gray-700/30 rounded-md">
                <span className="text-gray-600 dark:text-gray-300">{format(new Date(log.timestamp), 'h:mm a')}</span>
                <span className="font-medium text-blue-500 dark:text-blue-400">+{log.amount}ml</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}; 