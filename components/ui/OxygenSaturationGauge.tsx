"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Droplets } from "lucide-react";

interface OxygenSaturationGaugeProps {
  value: number;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  unit?: string;
  animate?: boolean;
}

export function OxygenSaturationGauge({
  value,
  min = 90,
  max = 100,
  size = "md",
  className,
  unit = "%",
  animate = true
}: OxygenSaturationGaugeProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  
  // Determine oxygen status
  const getOxygenStatus = () => {
    if (value < 90) return "critical";
    if (value < 95) return "warning";
    return "normal";
  };
  
  const status = getOxygenStatus();
  const statusColors = {
    critical: {
      text: "text-red-600",
      bg: "bg-red-50",
      fill: "bg-gradient-to-t from-red-600 to-red-400",
      border: "border-red-200",
    },
    warning: {
      text: "text-amber-600",
      bg: "bg-amber-50",
      fill: "bg-gradient-to-t from-amber-500 to-amber-300",
      border: "border-amber-200",
    },
    normal: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      fill: "bg-gradient-to-t from-blue-600 to-blue-400",
      border: "border-blue-200",
    }
  };
  
  // Calculate the height of the liquid based on the value
  const fillPercent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  // Animate the fill level when component mounts or value changes
  useEffect(() => {
    if (!animate) {
      setAnimatedLevel(fillPercent);
      return;
    }
    
    let startValue = animatedLevel;
    const endValue = fillPercent;
    const duration = 1000; // 1 second animation
    const startTime = performance.now();
    
    const animateFill = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentLevel = startValue + (endValue - startValue) * easedProgress;
      setAnimatedLevel(currentLevel);
      
      if (progress < 1) {
        requestAnimationFrame(animateFill);
      }
    };
    
    requestAnimationFrame(animateFill);
  }, [value, animate, fillPercent, animatedLevel]);
  
  // Size classes
  const sizeClasses = {
    sm: {
      container: "h-32 w-24",
      droplet: "w-3 h-3",
      value: "text-xl",
      unit: "text-xs",
    },
    md: {
      container: "h-40 w-28",
      droplet: "w-4 h-4",
      value: "text-2xl",
      unit: "text-sm",
    },
    lg: {
      container: "h-48 w-32",
      droplet: "w-5 h-5",
      value: "text-3xl",
      unit: "text-base",
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Oxygen container with liquid animation */}
      <div className="relative flex flex-col items-center">
        <div className={cn(
          "relative rounded-2xl overflow-hidden border-2 shadow-md",
          statusColors[status].border,
          sizeClasses[size].container
        )}>
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0",
            statusColors[status].bg
          )}></div>
          
          {/* Animated liquid */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 right-0 transition-all duration-300",
              statusColors[status].fill,
              "shadow-lg"
            )} 
            style={{ height: `${animatedLevel}%` }}
          >
            {/* Bubbles animation */}
            {animate && (
              <>
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute bg-white/30 rounded-full animate-bubble opacity-60"
                    style={{
                      width: `${Math.random() * 8 + 4}px`,
                      height: `${Math.random() * 8 + 4}px`,
                      bottom: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${Math.random() * 3 + 3}s`
                    }}
                  ></div>
                ))}
              </>
            )}
          </div>
          
          {/* Measurement lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-3 px-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center w-full">
                <div className="h-px w-3 bg-gray-400/30"></div>
                <div className="h-px flex-grow bg-gray-400/30"></div>
                <span className="text-[8px] text-gray-500 ml-1">
                  {max - ((max - min) / 5) * i}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Droplet icon at top */}
        <div className={cn(
          "absolute -top-4 rounded-full p-2",
          statusColors[status].bg,
          "border-2 shadow-md",
          statusColors[status].border
        )}>
          <Droplets className={cn(
            statusColors[status].text,
            sizeClasses[size].droplet
          )} />
        </div>
      </div>
      
      {/* Value display */}
      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center">
          <span className={cn(
            "font-bold",
            statusColors[status].text,
            sizeClasses[size].value
          )}>
            {value}
          </span>
          <span className={cn(
            "ml-1 text-gray-500",
            sizeClasses[size].unit
          )}>
            {unit}
          </span>
        </div>
        
        <p className={cn(
          "text-sm mt-1",
          statusColors[status].text
        )}>
          {status === "critical" && "Low - Seek Help"}
          {status === "warning" && "Below Normal"}
          {status === "normal" && "Normal"}
        </p>
      </div>
    </div>
  );
} 