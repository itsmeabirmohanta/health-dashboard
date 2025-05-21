"use client";

import { useState } from "react";
import Link from "next/link";
import { format, addDays, startOfWeek, isSameDay, parse } from "date-fns";
import { 
  Calendar, ChevronDown, ChevronLeft, ChevronRight, 
  Check, Clock, Dumbbell, User, Moon, Plus, Filter as FilterIcon,
  ArrowRight, Info
} from "lucide-react";
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

const activityTypes: ScheduleActivity['type'][] = ["workout", "run", "sleep", "other"];

export function ScheduleCard({ activities = [], onAddActivity, className }: ScheduleCardProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [activeFilters, setActiveFilters] = useState<ScheduleActivity['type'][]>([]);

  const handleFilterToggle = (type: ScheduleActivity['type']) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    );
  };

  const generateWeekDays = () => {
    const startDay = viewMode === "week" 
      ? startOfWeek(selectedDate, { weekStartsOn: 1 })
      : selectedDate;
    
    return Array.from({ length: viewMode === "week" ? 7 : 1 }).map((_, index) => {
      const date = addDays(startDay, index);
      const dayName = format(date, "EEE");
      const dayNumber = format(date, "d");
      const isTodayFlag = isSameDay(date, today);
      
      return { date, dayName, dayNumber, isToday: isTodayFlag };
    });
  };

  const weekDays = generateWeekDays();
  
  const filteredActivities = activities.filter((activity) => {
    const dateMatch = viewMode === "day" 
      ? isSameDay(activity.date, selectedDate)
      : weekDays.some(day => isSameDay(activity.date, day.date));
    
    const typeMatch = activeFilters.length === 0 || activeFilters.includes(activity.type);
    
    return dateMatch && typeMatch;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    const timeA = parse(a.time, "hh:mm a", new Date());
    const timeB = parse(b.time, "hh:mm a", new Date());
    return timeA.getTime() - timeB.getTime();
  });

  const navigatePrevious = () => {
    const days = viewMode === "week" ? 7 : 1;
    setSelectedDate(prev => addDays(prev, -days));
  };

  const navigateNext = () => {
    const days = viewMode === "week" ? 7 : 1;
    setSelectedDate(prev => addDays(prev, days));
  };

  const getActivityIcon = (type: ScheduleActivity["type"], iconClassName?: string) => {
    const baseClass = "w-4 h-4";
    switch (type) {
      case "workout":
        return <Dumbbell className={cn(baseClass, iconClassName)} />;
      case "run":
        return <User className={cn(baseClass, iconClassName)} />;
      case "sleep":
        return <Moon className={cn(baseClass, iconClassName)} />;
      default:
        return <Clock className={cn(baseClass, iconClassName)} />;
    }
  };

  const handleActivityClick = (activity: ScheduleActivity) => {
    console.log("Activity Clicked:", activity);
    alert(`Activity: ${activity.title}\\nTime: ${activity.time}\\nDetails: ${activity.details || 'N/A'}`);
  };

  return (
    <div className={cn("glass rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          My Schedule
        </h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === "day" ? "week" : "day")}
            className="flex items-center text-xs text-gray-600 dark:text-gray-300 gap-1 bg-white/60 dark:bg-gray-700/50 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
          >
            {viewMode === "day" ? "Day View" : "Week View"}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex bg-white/60 dark:bg-gray-700/50 rounded-lg shadow-sm">
            <button 
              onClick={navigatePrevious}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600/50 rounded-l-lg transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={() => setSelectedDate(today)}
              className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
            >
              Today
            </button>
            <button 
              onClick={navigateNext}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600/50 rounded-r-lg transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Calendar Day Selector */}
      <div className={cn("flex justify-between mb-3 bg-white/40 dark:bg-gray-700/40 p-1.5 rounded-xl", viewMode === "day" && "justify-center")}>
        {weekDays.map(day => (
          <button
            key={day.dayName + day.dayNumber}
            onClick={() => setSelectedDate(day.date)}
            className={cn(
              "w-full flex flex-col items-center py-1.5 rounded-lg transition-all duration-150 ease-in-out",
              viewMode === "day" && "max-w-[120px]",
              isSameDay(day.date, selectedDate) 
                ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md scale-105" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-600/40",
              day.isToday && !isSameDay(day.date, selectedDate) && "font-semibold"
            )}
          >
            <span className="text-xs">{day.dayName}</span>
            <span className={cn(
              "w-7 h-7 flex items-center justify-center rounded-full mt-0.5 text-sm font-medium",
               day.isToday && !isSameDay(day.date, selectedDate) && "ring-2 ring-purple-500/50 dark:ring-indigo-400/50"
            )}>
              {day.dayNumber}
            </span>
          </button>
        ))}
      </div>

      {/* Activity Type Filters */}
      <div className="flex items-center gap-2 mb-3">
        <FilterIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        {activityTypes.map(type => (
          <button
            key={type}
            onClick={() => handleFilterToggle(type)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-full border transition-colors flex items-center gap-1.5",
              activeFilters.includes(type)
                ? "bg-purple-100 dark:bg-purple-700/50 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-200"
                : "bg-white/50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50"
            )}
          >
            {getActivityIcon(type, activeFilters.includes(type) ? "text-purple-600 dark:text-purple-300" : "text-gray-500 dark:text-gray-400")}
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>
      
      {/* Activities Timeline */}
      <div className="space-y-2.5 flex-grow overflow-y-auto max-h-[250px] pr-1.5 custom-scrollbar">
        {sortedActivities.length > 0 ? (
          sortedActivities.map((activity, index) => (
            <button 
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className="w-full text-left relative pl-7 group"
            >
              {/* Status indicator line and dot */}
              <div className={cn(
                "absolute top-1.5 -left-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800",
                activity.status === "completed" ? "bg-green-500" : 
                activity.status === "in-progress" ? "bg-blue-500" : 
                "bg-gray-400 dark:bg-gray-500"
              )}>
                {activity.status === "completed" && (
                  <Check className="w-2 h-2 text-white" />
                )}
              </div>
              {/* Vertical line connecting dots - not for last item */}
              {index < sortedActivities.length -1 && (
                 <div className={cn(
                    "absolute top-2.5 left-[3.5px] h-full w-0.5",
                     activity.status === "completed" ? "bg-green-200 dark:bg-green-700/50" :
                     activity.status === "in-progress" ? "bg-blue-200 dark:bg-blue-700/50" :
                     "bg-gray-200 dark:bg-gray-600/50"
                 )}></div>
              )}
              
              <div className="p-3 bg-white/60 dark:bg-gray-700/60 rounded-lg shadow-sm hover:shadow-md transition-all group-hover:bg-gray-50 dark:group-hover:bg-gray-700">
                {/* Activity time */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                  {activity.status === "in-progress" && isSameDay(activity.date, today) && (
                    <span className="ml-auto text-xs font-medium text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-600/30 px-1.5 py-0.5 rounded-full">In Progress</span>
                  )}
                   {activity.status === "completed" && (
                    <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-600/30 px-1.5 py-0.5 rounded-full">Completed</span>
                  )}
                </div>
                
                {/* Activity details */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center text-white",
                        activity.type === "workout" ? "bg-red-500" :
                        activity.type === "run" ? "bg-green-500" :
                        activity.type === "sleep" ? "bg-indigo-500" :
                        "bg-purple-500"
                      )}>
                        {getActivityIcon(activity.type, "w-3.5 h-3.5")}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">{activity.title}</h4>
                    </div>
                    {activity.details && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-7.5 max-w-xs truncate" title={activity.details}>
                            {activity.details}
                        </p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center justify-center h-full">
            <Info className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p>No activities scheduled for {format(selectedDate, "MMMM d")}</p>
            {activeFilters.length > 0 && <p className="text-xs mt-1">(with current filters)</p>}
            {onAddActivity && <p className="mt-2 text-xs">Try changing filters or click "Add New Activity".</p>}
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-200/70 dark:border-gray-700/50 flex items-center justify-between gap-2">
        {onAddActivity && (
            <button 
                onClick={onAddActivity}
                className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-700/40 dark:hover:bg-purple-700/70 border border-purple-200 dark:border-purple-600 rounded-lg text-purple-700 dark:text-purple-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Activity</span>
            </button>
        )}
        <Link href="/schedule" legacyBehavior>
          <a className="flex-1 py-2 px-3 bg-white/70 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-600/60 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
            <span>View Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </Link>
      </div>
    </div>
  );
} 