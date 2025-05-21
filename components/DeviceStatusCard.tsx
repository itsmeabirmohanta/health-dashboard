"use client";

import { formatDistanceToNow } from "date-fns";
import { Battery, Bluetooth, Smartphone, Watch, Zap, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

interface DeviceStatusCardProps {
  deviceName: string;
  deviceType: "watch" | "phone" | "band";
  batteryLevel: number;
  isConnected: boolean;
  lastSynced: Date;
  onSync?: () => void;
}

export function DeviceStatusCard({
  deviceName,
  deviceType,
  batteryLevel,
  isConnected,
  lastSynced,
  onSync,
}: DeviceStatusCardProps) {
  const DeviceIcon = () => {
    switch (deviceType) {
      case "watch":
        return <Watch className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
      case "phone":
        return <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-300" />;
      default:
        return <Zap className="w-6 h-6 text-gray-600 dark:text-gray-300" />; // Generic icon for band or others
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 70) return "text-green-500";
    if (batteryLevel > 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="card p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-white/50 dark:bg-gray-700/50 p-2.5 rounded-lg shadow-sm flex-shrink-0">
            <DeviceIcon />
          </div>
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate">{deviceName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Last synced {formatDistanceToNow(lastSynced, { addSuffix: true })}
            </p>
          </div>
        </div>
        {onSync && (
            <button 
                onClick={onSync}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors flex-shrink-0"
                title="Sync Now"
            >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
        )}
      </div>

      {/* Flex container for status and battery */}
      <div className="flex items-center justify-between text-sm">
        <div className={`flex items-center gap-1.5 ${isConnected ? 'text-green-500' : 'text-red-500'} min-w-0`}>
          {isConnected ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="font-medium truncate">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        <div className="flex items-center gap-1.5 min-w-0">
          <Battery className={`w-4 h-4 ${getBatteryColor()} flex-shrink-0`} />
          <span className={`font-medium ${getBatteryColor()} truncate`}>{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
} 