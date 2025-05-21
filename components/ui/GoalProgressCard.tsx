"use client";

import React from 'react';
import { Goal, GoalType } from '@/types';
import { CheckCircle, TrendingUp, AlertTriangle, PlayCircle, Target, Bike, Footprints, BedDouble, Zap, Droplet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalProgressCardProps {
  goals: Goal[];
  className?: string;
}

const GoalIcon: React.FC<{ type: GoalType, className?: string }> = ({ type, className }) => {
  const defaultClassName = "w-5 h-5";
  switch (type) {
    case 'steps':
      return <Footprints className={cn(defaultClassName, className)} />;
    case 'activeMinutes':
      return <Bike className={cn(defaultClassName, className)} />;
    case 'sleepHours':
      return <BedDouble className={cn(defaultClassName, className)} />;
    case 'caloriesBurned':
      return <Zap className={cn(defaultClassName, className)} />;
    case 'hydration':
      return <Droplet className={cn(defaultClassName, className)} />;
    default:
      return <Target className={cn(defaultClassName, className)} />;
  }
};

const StatusIcon: React.FC<{ status: Goal['status'], className?: string }> = ({ status, className }) => {
  const defaultClassName = "w-4 h-4";
  switch (status) {
    case 'achieved':
      return <CheckCircle className={cn(defaultClassName, "text-green-500", className)} />;
    case 'onTrack':
      return <TrendingUp className={cn(defaultClassName, "text-blue-500", className)} />;
    case 'atRisk':
      return <AlertTriangle className={cn(defaultClassName, "text-yellow-500", className)} />;
    case 'notStarted':
      return <PlayCircle className={cn(defaultClassName, "text-gray-400", className)} />;
    default:
      return null;
  }
};

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goals, className }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2 text-indigo-500" />
          Active Goals
        </h2>
        <p className="text-sm text-gray-500">No active goals set yet. Set some goals to track your progress!</p>
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Target className="w-5 h-5 mr-2 text-indigo-500" />
        Active Goals
      </h2>
      <div className="space-y-4">
        {goals.map((goal) => {
          const progressPercentage = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
          let progressBarColor = 'bg-blue-500';
          if (goal.status === 'achieved') progressBarColor = 'bg-green-500';
          if (goal.status === 'atRisk') progressBarColor = 'bg-yellow-500';
          if (goal.status === 'notStarted') progressBarColor = 'bg-gray-300';

          return (
            <div key={goal.id} className="p-3 bg-white/30 rounded-lg">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center">
                  <GoalIcon type={goal.type} className="mr-2 text-indigo-600" />
                  <span className="font-medium text-sm text-gray-800">{goal.title}</span>
                </div>
                <StatusIcon status={goal.status} />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-1">
                <div 
                  className={`h-2.5 rounded-full ${progressBarColor}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 flex justify-between">
                <span>{`${goal.currentValue.toLocaleString()} / ${goal.targetValue.toLocaleString()} ${goal.unit}`}</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 