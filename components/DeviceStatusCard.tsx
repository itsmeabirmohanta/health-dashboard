"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Battery, Bluetooth, Smartphone, Watch, Zap, CheckCircle2, XCircle, RefreshCw, ChevronDown } from "lucide-react";

// Define the structure for a device
interface Device {
  id: string;
  name: string;
  type: "watch" | "phone" | "band";
  batteryLevel: number;
  lastSynced: Date;
  defaultConnected: boolean;
}

// Mock list of available devices
const MOCK_DEVICES: Device[] = [
  { id: "fitbit-sense", name: "Fitbit Sense", type: "watch", batteryLevel: 85, lastSynced: new Date(Date.now() - 3600 * 1000 * 2), defaultConnected: true },
  { id: "apple-watch-9", name: "Apple Watch S9", type: "watch", batteryLevel: 92, lastSynced: new Date(Date.now() - 3600 * 1000 * 1), defaultConnected: false },
  { id: "garmin-venu-3", name: "Garmin Venu 3", type: "watch", batteryLevel: 78, lastSynced: new Date(Date.now() - 3600 * 1000 * 5), defaultConnected: false },
  { id: "oura-ring-3", name: "Oura Ring Gen3", type: "band", batteryLevel: 60, lastSynced: new Date(Date.now() - 3600 * 1000 * 3), defaultConnected: false },
  { id: "galaxy-s23", name: "Galaxy S23 Ultra", type: "phone", batteryLevel: 70, lastSynced: new Date(Date.now() - 3600 * 1000 * 0.5), defaultConnected: false },
];

interface DeviceStatusCardProps {
  availableDevices: Device[];
  selectedDeviceId: string;
  isConnected: boolean;
  onDeviceChange: (deviceId: string) => void;
  onToggleConnection: () => void;
  onSync?: (deviceId: string) => void;
}

export function DeviceStatusCard({ availableDevices, selectedDeviceId, isConnected, onDeviceChange, onToggleConnection, onSync }: DeviceStatusCardProps) {
  const selectedDevice = availableDevices.find(device => device.id === selectedDeviceId);

  if (!selectedDevice) {
    return (
      <div className="card p-5 overflow-hidden">
        <p className="text-gray-600 dark:text-gray-400">No device selected or available.</p>
      </div>
    );
  }

  const { name: deviceName, type: deviceType, batteryLevel, lastSynced } = selectedDevice;

  const DeviceIcon = () => {
    switch (deviceType) {
      case "watch":
        return <Watch className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
      case "phone":
        return <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
      default: // band or others
        return <Zap className="w-5 h-5 text-gray-600 dark:text-gray-300" />;
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 70) return "text-green-500";
    if (batteryLevel > 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="card p-5 overflow-hidden">
      {/* Device Selector */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
          <DeviceIcon />
          <span>Select Device:</span>
        </div>
        <div className="relative">
            <select
              value={selectedDeviceId}
              onChange={e => onDeviceChange(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-sm font-medium text-gray-800 dark:text-white bg-white/60 dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:focus:ring-red-400/30 focus:border-red-500 dark:focus:border-red-400 appearance-none"
            >
              {availableDevices.map(device => (
                <option key={device.id} value={device.id} className="text-gray-800 dark:text-white bg-white dark:bg-gray-700">
                  {device.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon is now part of selector, or can be re-added if desired for static display */}
          <div className="min-w-0">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white truncate">{deviceName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Last synced {formatDistanceToNow(lastSynced, { addSuffix: true })}
            </p>
          </div>
        </div>
        {onSync && (
            <button 
                onClick={() => onSync(selectedDevice.id)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors flex-shrink-0"
                title="Sync Now"
            >
                <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
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

      {/* Connect/Disconnect Button */}
      <button
        onClick={onToggleConnection}
        className={`w-full py-2 px-4 text-sm font-medium rounded-lg shadow-sm transition-all duration-150 ease-in-out
                    ${isConnected 
                      ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 dark:border-red-400/30' 
                      : 'bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30 dark:border-green-400/30'}`}
      >
        {isConnected ? 'Disconnect Device' : 'Connect Device'}
      </button>
    </div>
  );
} 