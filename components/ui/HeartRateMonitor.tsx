"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface HeartRateMonitorProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  className?: string;
  showAnimation?: boolean;
  size?: "sm" | "md" | "lg";
}

export function HeartRateMonitor({
  value,
  min = 40,
  max = 180,
  unit = "bpm",
  className,
  showAnimation = true,
  size = "md",
}: HeartRateMonitorProps) {
  // Determine if current heart rate is normal, elevated, or low
  const getHeartRateStatus = () => {
    if (value < 60) return "low";
    if (value > 100) return "elevated";
    return "normal";
  };
  
  const status = getHeartRateStatus();
  const statusColors = {
    low: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      ring: "ring-blue-200",
      pulseColor: "from-blue-500/50 to-blue-500/0"
    },
    normal: {
      text: "text-green-600",
      bg: "bg-green-50",
      ring: "ring-green-200",
      pulseColor: "from-green-500/50 to-green-500/0"
    },
    elevated: {
      text: "text-red-600",
      bg: "bg-red-50",
      ring: "ring-red-200",
      pulseColor: "from-red-500/50 to-red-500/0"
    }
  };

  // Animation timing for the heart beat
  const [isBeating, setIsBeating] = useState(false);
  
  useEffect(() => {
    if (!showAnimation) return;
    
    // Calculate heart beat interval based on the BPM value
    const beatsPerMinute = value;
    const beatInterval = 60000 / beatsPerMinute; // Convert BPM to ms between beats
    
    const intervalId = setInterval(() => {
      setIsBeating(true);
      // Reset animation after a short delay, matching CSS animation duration
      setTimeout(() => setIsBeating(false), 600); // Changed from 500ms to 600ms
    }, beatInterval);
    
    return () => clearInterval(intervalId);
  }, [value, showAnimation]);

  // Size classes
  const sizeClasses = {
    sm: {
      container: "h-24 w-24",
      icon: "w-8 h-8",
      value: "text-xl",
      unit: "text-xs"
    },
    md: {
      container: "h-36 w-36",
      icon: "w-12 h-12",
      value: "text-3xl",
      unit: "text-sm"
    },
    lg: {
      container: "h-48 w-48",
      icon: "w-16 h-16",
      value: "text-4xl",
      unit: "text-base"
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className={cn(
        "relative rounded-full flex items-center justify-center",
        statusColors[status].bg,
        statusColors[status].ring,
        "ring-8",
        sizeClasses[size].container
      )}>
        {/* Pulsing animation */}
        {showAnimation && (
          <div className={cn(
            "absolute inset-0 rounded-full",
            isBeating ? "opacity-100" : "opacity-0",
            "transition-opacity duration-300"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-full bg-gradient-radial",
              statusColors[status].pulseColor
            )}></div>
          </div>
        )}
        
        {/* Heart icon with beating animation */}
        <div className={cn(
          "relative flex items-center justify-center",
          isBeating ? "scale-110" : "scale-100",
          "transition-transform duration-300 ease-in-out"
        )}>
          <Heart 
            className={cn(
              statusColors[status].text,
              sizeClasses[size].icon
            )}
            fill="currentColor"
          />
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
          {status === "low" && "Resting"}
          {status === "normal" && "Normal"}
          {status === "elevated" && "Elevated"}
        </p>
      </div>
    </div>
  );
}

// Add these keyframes to your global CSS or use as inline styles with the style tag
const HeartbeatKeyframes = `
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.animate-heartbeat {
  animation: heartbeat 0.5s ease-in-out;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.7; }
  100% { transform: scale(1.2); opacity: 0; }
}
.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
}
`;

// Add these styles to your global stylesheet or somewhere in your app
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = HeartbeatKeyframes;
  document.head.appendChild(style);
} 