"use client";

import React from "react";
import { Bluetooth, Battery, Signal, Activity, Watch, Smartphone } from "lucide-react";
import { format } from "date-fns";

interface DeviceStatusCardProps {
  deviceName: string;
  deviceType?: "watch" | "tracker" | "phone";
  batteryLevel: number;
  isConnected: boolean;
  lastSynced: Date;
}

export function DeviceStatusCard({
  deviceName = "HealthTracker Pro",
  deviceType = "watch",
  batteryLevel = 85,
  isConnected = true,
  lastSynced = new Date()
}: DeviceStatusCardProps) {
  // Get appropriate icon based on device type
  const getDeviceIcon = () => {
    switch (deviceType) {
      case "watch":
        return <Watch className="w-8 h-8 text-gray-600" />;
      case "phone":
        return <Smartphone className="w-8 h-8 text-gray-600" />;
      default:
        return <Activity className="w-8 h-8 text-gray-600" />;
    }
  };

  // Get battery status color
  const getBatteryColor = () => {
    if (batteryLevel > 50) return "text-green-600";
    if (batteryLevel > 20) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Connected Device</h2>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 ${isConnected ? "text-green-600" : "text-gray-400"} text-sm font-medium`}>
            <Signal className="w-4 h-4" />
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
            <Bluetooth className="w-4 h-4" />
            Active
          </span>
          <span className={`flex items-center gap-1 ${getBatteryColor()} text-sm font-medium`}>
            <Battery className="w-4 h-4" />
            {batteryLevel}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/50 rounded-xl flex items-center justify-center shadow-sm">
          {getDeviceIcon()}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{deviceName}</h3>
          <p className="text-sm text-gray-500">Last synced: {format(lastSynced, 'MMM d, h:mm a')}</p>
          <div className="flex items-center gap-3 mt-2">
            <button className="text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
              Sync Now
            </button>
            <button className="text-sm text-gray-600 font-medium hover:text-gray-700 transition-colors">
              Device Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 