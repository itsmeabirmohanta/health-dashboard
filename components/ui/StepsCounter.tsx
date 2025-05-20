"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Footprints } from "lucide-react";

interface StepsCounterProps {
  value: number;
  goal?: number;
  className?: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StepsCounter({
  value,
  goal = 10000,
  className,
  animate = true,
  size = "md"
}: StepsCounterProps) {
  const [displayedValue, setDisplayedValue] = useState(0);
  
  // Animate the counter
  useEffect(() => {
    if (!animate) {
      setDisplayedValue(value);
      return;
    }
    
    let startValue = displayedValue;
    const endValue = value;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    
    const animateCount = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use a ease-out cubic function for more natural counting
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(progress);
      
      const currentCount = Math.floor(startValue + (endValue - startValue) * easedProgress);
      setDisplayedValue(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [value, animate, displayedValue]);
  
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.max(0, (value / goal) * 100));
  
  // Get progress status
  const getProgressStatus = () => {
    if (progressPercent >= 100) return "completed";
    if (progressPercent >= 75) return "advanced";
    if (progressPercent >= 50) return "halfway";
    if (progressPercent >= 25) return "started";
    return "beginning";
  };
  
  const status = getProgressStatus();
  const statusColors = {
    beginning: {
      primary: "text-blue-500",
      secondary: "text-blue-400",
      progress: "from-blue-200 to-blue-400",
      background: "bg-blue-50",
      border: "border-blue-100"
    },
    started: {
      primary: "text-indigo-500",
      secondary: "text-indigo-400",
      progress: "from-indigo-200 to-indigo-400",
      background: "bg-indigo-50",
      border: "border-indigo-100"
    },
    halfway: {
      primary: "text-purple-500",
      secondary: "text-purple-400",
      progress: "from-purple-200 to-purple-400",
      background: "bg-purple-50",
      border: "border-purple-100"
    },
    advanced: {
      primary: "text-orange-500",
      secondary: "text-orange-400",
      progress: "from-orange-200 to-orange-400",
      background: "bg-orange-50",
      border: "border-orange-100"
    },
    completed: {
      primary: "text-green-500",
      secondary: "text-green-400",
      progress: "from-green-200 to-green-400",
      background: "bg-green-50",
      border: "border-green-100"
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: "h-28 w-28",
      icon: "w-4 h-4",
      value: "text-xl",
      label: "text-xs",
      thickness: "h-2"
    },
    md: {
      container: "h-36 w-36",
      icon: "w-5 h-5",
      value: "text-2xl",
      label: "text-sm",
      thickness: "h-3"
    },
    lg: {
      container: "h-44 w-44",
      icon: "w-6 h-6",
      value: "text-3xl",
      label: "text-base",
      thickness: "h-4"
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn(
        "relative rounded-full overflow-hidden border flex flex-col items-center justify-center",
        statusColors[status].border,
        statusColors[status].background,
        sizeClasses[size].container
      )}>
        {/* Progress circle */}
        <svg 
          className="absolute top-0 left-0 transform -rotate-90"
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="5"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={`url(#${status}Gradient)`}
            strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 45 * progressPercent / 100} ${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
            strokeLinecap="round"
          />
          
          {/* Define gradient */}
          <defs>
            <linearGradient id={`${status}Gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`stop-${statusColors[status].progress.split(' ')[0]}`} />
              <stop offset="100%" className={`stop-${statusColors[status].progress.split(' ')[1]}`} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Content */}
        <div className="z-10 flex flex-col items-center justify-center">
          <Footprints className={cn(
            sizeClasses[size].icon,
            statusColors[status].primary
          )} />
          
          <div className="mt-2 text-center">
            <span className={cn(
              "font-bold",
              statusColors[status].primary,
              sizeClasses[size].value
            )}>
              {formatNumber(displayedValue)}
            </span>
            
            <div className={cn(
              "mt-1 font-medium",
              statusColors[status].secondary,
              sizeClasses[size].label
            )}>
              / {formatNumber(goal)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className="mt-3 text-center">
        <p className="font-semibold text-gray-800">
          Steps
        </p>
        <p className={cn(
          "text-sm",
          statusColors[status].primary
        )}>
          {status === "completed" && "Goal completed!"}
          {status === "advanced" && "Almost there!"}
          {status === "halfway" && "Halfway there!"}
          {status === "started" && "Good progress!"}
          {status === "beginning" && "Just starting!"}
        </p>
      </div>
    </div>
  );
} 