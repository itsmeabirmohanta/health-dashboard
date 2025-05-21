"use client";

import React, { useState } from 'react';
import { NutritionSummary, LoggedMeal } from '@/types';
import { ChevronDown, ChevronUp, Utensils, Apple, Beef, Drumstick, Fish, Carrot, GlassWater, CakeSlice, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NutritionSummaryCardProps {
  summary?: NutritionSummary;
  className?: string;
}

const MacroCircle: React.FC<{ value: number; total: number; label: string; color: string; unit?: string }> = 
  ({ value, total, label, color, unit = 'g' }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const circumference = 2 * Math.PI * 20; // Assuming radius of 20
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 44 44">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="22"
            cy="22"
          />
          <circle
            className={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="20"
            cx="22"
            cy="22"
            transform="rotate(-90 22 22)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{value.toFixed(0)}{unit}</span>
        </div> 
      </div>
      <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
};

const MealTypeIcon: React.FC<{type: LoggedMeal['type'], className?: string}> = ({ type, className }) => {
  const defaultClass = "w-4 h-4";
  switch(type) {
    case 'breakfast': return <Apple className={cn(defaultClass, "text-green-500", className)} />;
    case 'lunch': return <Drumstick className={cn(defaultClass, "text-orange-500", className)} />;
    case 'dinner': return <Fish className={cn(defaultClass, "text-blue-500", className)} />;
    case 'snack': return <CakeSlice className={cn(defaultClass, "text-purple-500", className)} />;
    default: return <Utensils className={cn(defaultClass, "text-gray-500", className)} />;
  }
};

export const NutritionSummaryCard: React.FC<NutritionSummaryCardProps> = ({ summary, className }) => {
  const [showMeals, setShowMeals] = useState(false);

  if (!summary) {
    return (
      <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Utensils className="w-5 h-5 mr-2 text-green-500" />
          Nutrition Summary
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">No nutrition data logged for today yet.</p>
      </div>
    );
  }

  const { totalCalories, targetCalories = 0, protein = 0, carbs = 0, fats = 0, meals } = summary;
  const calorieProgress = targetCalories > 0 ? (totalCalories / targetCalories) * 100 : 0;
  const totalMacros = (protein || 0) + (carbs || 0) + (fats || 0);

  return (
    <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Utensils className="w-5 h-5 mr-2 text-green-500" />
          Today's Nutrition
        </h2>
        {/* Optional: Date if not always today */}
      </div>

      {/* Calories Summary */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">{totalCalories.toLocaleString()} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">kcal</span></span>
          {targetCalories > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">Target: {targetCalories.toLocaleString()} kcal</span>
          )}
        </div>
        {targetCalories > 0 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(calorieProgress, 100)}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Macronutrients */}
      {totalMacros > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-200/60 dark:border-gray-700/60">
            <MacroCircle value={protein} total={totalMacros} label="Protein" color="text-red-500" />
            <MacroCircle value={carbs} total={totalMacros} label="Carbs" color="text-blue-500" />
            <MacroCircle value={fats} total={totalMacros} label="Fats" color="text-yellow-500" />
          </div>
      )}

      {/* Logged Meals Toggle */}
      {meals && meals.length > 0 && (
        <div className="mt-3">
          <button 
            onClick={() => setShowMeals(!showMeals)}
            className="w-full flex justify-between items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2"
          >
            <span>Logged Meals ({meals.length})</span>
            {showMeals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showMeals && (
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1">
              {meals.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(meal => (
                <div key={meal.id} className="p-2.5 bg-white/30 dark:bg-gray-700/40 rounded-lg text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MealTypeIcon type={meal.type} />
                      <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">{meal.type}</span>
                      <span className="text-gray-500 dark:text-gray-400">({format(new Date(meal.timestamp), 'h:mm a')})</span>
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{meal.totalCalories} kcal</span>
                  </div>
                  {/* Optional: show meal items on hover/click */}
                   <div className="pl-5 mt-1 text-gray-500 dark:text-gray-400">
                    {meal.items.map(item => item.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
       {(!meals || meals.length === 0) && totalMacros === 0 && (
        <div className="text-center py-4">
            <Info className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No meals logged for today.</p>
        </div>
      )}
    </div>
  );
}; 