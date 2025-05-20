"use client";

import { useState } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check, Clock, Dumbbell, User, ArrowRight, Moon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScheduleActivity {
  id: string;
  title: string;
  time: string; // Format: "HH:MM AM/PM"
  details?: string;
  status: "completed" | "in-progress" | "upcoming";
  type: "workout" | "run" | "sleep" | "other";
  date: Date;
}

interface ScheduleCardProps {
  activities: ScheduleActivity[];
  onAddActivity?: () => void;
  className?: string;
}

export function ScheduleCard({ activities = [], onAddActivity, className }: ScheduleCardProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  // Generate week days starting from the selected date
  const generateWeekDays = () => {
    const startDay = viewMode === "week" 
      ? startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start from Monday
      : selectedDate;
    
    return Array.from({ length: viewMode === "week" ? 7 : 1 }).map((_, index) => {
      const date = addDays(startDay, index);
      const dayName = format(date, "EEE");
      const dayNumber = format(date, "d");
      const isToday = isSameDay(date, today);
      
      return { date, dayName, dayNumber, isToday };
    });
  };

  const weekDays = generateWeekDays();
  
  // Filter activities for the selected date(s)
  const filteredActivities = activities.filter((activity) => {
    if (viewMode === "day") {
      return isSameDay(activity.date, selectedDate);
    } else {
      // For week view, check if activity date is within the displayed week
      return weekDays.some(day => isSameDay(activity.date, day.date));
    }
  });

  // Sort activities by time
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return new Date(`1970/01/01 ${a.time}`).getTime() - new Date(`1970/01/01 ${b.time}`).getTime();
  });

  // Navigate to previous/next day or week
  const navigatePrevious = () => {
    const days = viewMode === "week" ? 7 : 1;
    setSelectedDate(prev => addDays(prev, -days));
  };

  const navigateNext = () => {
    const days = viewMode === "week" ? 7 : 1;
    setSelectedDate(prev => addDays(prev, days));
  };

  // Get activity icon based on type
  const getActivityIcon = (type: ScheduleActivity["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="w-4 h-4" />;
      case "run":
        return <User className="w-4 h-4" />;
      case "sleep":
        return <Moon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          My Schedule
        </h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === "day" ? "week" : "day")}
            className="flex items-center text-sm text-gray-500 gap-1 bg-white/50 px-2 py-1 rounded-lg hover:bg-white/70 transition-colors"
          >
            {viewMode === "day" ? "Day" : "Week"} View
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <div className="flex bg-white/50 rounded-lg">
            <button 
              onClick={navigatePrevious}
              className="p-1.5 hover:bg-white/70 rounded-l-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-2 py-1 text-xs font-medium text-gray-700 hover:bg-white/70 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={navigateNext}
              className="p-1.5 hover:bg-white/70 rounded-r-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar Day Selector */}
      <div className="flex justify-between mb-5 bg-white/30 p-2 rounded-xl">
        {weekDays.map(day => (
          <button
            key={day.dayName + day.dayNumber}
            onClick={() => viewMode === "week" && setSelectedDate(day.date)}
            className={cn(
              "w-full flex flex-col items-center py-2 rounded-lg transition-colors",
              isSameDay(day.date, selectedDate) 
                ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-sm" 
                : "text-gray-700 hover:bg-white/70",
            )}
          >
            <span className="text-xs font-medium">{day.dayName}</span>
            <span className={cn(
              "w-7 h-7 flex items-center justify-center rounded-full mt-1 text-sm",
              day.isToday && !isSameDay(day.date, selectedDate) && "ring-2 ring-red-500/30"
            )}>
              {day.dayNumber}
            </span>
          </button>
        ))}
      </div>
      
      {/* Activities Timeline */}
      <div className="space-y-3">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="relative pl-6 pb-4 border-l border-gray-100 last:border-0 last:pb-0"
            >
              {/* Status indicator */}
              <div className={cn(
                "absolute top-0 -left-1.5 w-3 h-3 rounded-full",
                activity.status === "completed" ? "bg-green-500" : 
                activity.status === "in-progress" ? "bg-blue-500" : 
                "bg-gray-300"
              )}>
                {activity.status === "completed" && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              
              {/* Activity time */}
              <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.time}
              </div>
              
              {/* Activity details */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-5 h-5 rounded-md flex items-center justify-center",
                      activity.type === "workout" ? "bg-red-100 text-red-600" :
                      activity.type === "run" ? "bg-green-100 text-green-600" :
                      activity.type === "sleep" ? "bg-blue-100 text-blue-600" :
                      "bg-purple-100 text-purple-600"
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  </div>
                  <p className={cn(
                    "text-xs ml-6.5",
                    activity.status === "completed" ? "text-green-500" : 
                    activity.status === "in-progress" ? "text-blue-500" : 
                    "text-gray-500"
                  )}>
                    {activity.status === "completed" ? "Completed" : 
                     activity.status === "in-progress" ? "In Progress" : 
                     "Upcoming"}
                  </p>
                </div>
                {activity.details && (
                  <div className="text-xs text-gray-500 max-w-[40%] text-right">{activity.details}</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500 text-sm">
            <div className="flex justify-center mb-3">
              <Calendar className="w-12 h-12 text-gray-300" />
            </div>
            <p>No activities scheduled for {format(selectedDate, "MMMM d")}.</p>
            <p className="mt-1">Click "Add New Activity" to create one.</p>
          </div>
        )}
      </div>
      
      {/* Add activity button */}
      <button 
        onClick={onAddActivity}
        className="w-full mt-6 py-2.5 bg-white border border-gray-100 rounded-xl text-gray-700 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Activity</span>
      </button>
    </div>
  );
} 