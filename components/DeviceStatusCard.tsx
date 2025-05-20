"use client";

import { formatDistanceToNow } from "date-fns";
import { Battery, Bluetooth, Smartphone, Watch } from "lucide-react";

interface DeviceStatusCardProps {
  deviceName: string;
  deviceType: "watch" | "phone" | "band";
  batteryLevel: number;
  isConnected: boolean;
  lastSynced: Date;
}

export function DeviceStatusCard({
  deviceName,
  deviceType,
  batteryLevel,
  isConnected,
  lastSynced,
}: DeviceStatusCardProps) {
  // Get the appropriate device icon
  const DeviceIcon = () => {
    switch (deviceType) {
      case "watch":
        return <Watch className="w-12 h-12 text-gray-700" />;
      case "phone":
        return <Smartphone className="w-12 h-12 text-gray-700" />;
      default:
        return <Watch className="w-12 h-12 text-gray-700" />;
    }
  };

  // Get battery color based on level
  const getBatteryColor = () => {
    if (batteryLevel > 60) return "text-green-500";
    if (batteryLevel > 20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center gap-6">
      <div className="bg-white/50 p-4 rounded-xl shadow-sm">
        <DeviceIcon />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{deviceName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div className={`flex items-center gap-1 ${isConnected ? 'text-green-500' : 'text-gray-400'}`}>
            <Bluetooth className="w-4 h-4" />
            <span className="text-xs">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="text-xs text-gray-500">
            Last synced {formatDistanceToNow(lastSynced, { addSuffix: true })}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Battery className={`w-5 h-5 ${getBatteryColor()}`} />
        <span className="font-medium">{batteryLevel}%</span>
      </div>
      
      <button 
        className="px-4 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        Sync Now
      </button>
    </div>
  );
} 