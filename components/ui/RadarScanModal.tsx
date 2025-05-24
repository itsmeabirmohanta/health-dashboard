import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Bluetooth, CheckCircle2, Battery, Watch, Smartphone, Zap, X } from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: 'watch' | 'phone' | 'band';
  batteryLevel: number;
  lastSynced: Date;
  defaultConnected: boolean;
}

interface RadarScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  devices: Device[];
  onConnect: (device: Device) => void;
  connectingDeviceId?: string;
}

const RADAR_SIZE = 400;
const BLIP_RADIUS = 32;
const CIRCLE_COUNT = 4;

// Device type helpers
const typeConfig = {
  watch: {
    icon: (props: any) => <Watch {...props} className="w-8 h-8 text-blue-600" />,
    colors: 'bg-blue-50 border-blue-400'
  },
  phone: {
    icon: (props: any) => <Smartphone {...props} className="w-8 h-8 text-green-600" />,
    colors: 'bg-green-50 border-green-400'
  },
  band: {
    icon: (props: any) => <Zap {...props} className="w-8 h-8 text-yellow-500" />,
    colors: 'bg-yellow-50 border-yellow-400'
  }
};

export const RadarScanModal: React.FC<RadarScanModalProps> = ({ 
  isOpen, onClose, devices, onConnect, connectingDeviceId 
}) => {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [centeredDevice, setCenteredDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);

  // Radar sweep animation
  useEffect(() => {
    if (!isOpen) return;
    
    let frame: number;
    const animate = () => {
      setSweepAngle((prev) => (prev + 2) % 360);
      frame = requestAnimationFrame(animate);
    };
    
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setCenteredDevice(null);
      setConnected(false);
    }
  }, [isOpen]);

  // Device positioning
  const getDevicePosition = (idx: number, total: number) => {
    const angle = (2 * Math.PI * idx) / total - Math.PI / 2;
    const r = RADAR_SIZE * 0.38;
    return {
      left: `calc(50% + ${(r * Math.cos(angle)).toFixed(1)}px - ${BLIP_RADIUS}px)`,
      top: `calc(50% + ${(r * Math.sin(angle)).toFixed(1)}px - ${BLIP_RADIUS}px)`,
    };
  };

  // Check if sweep is near a device
  const isSweepNear = (idx: number, total: number) => {
    const angle = ((2 * Math.PI * idx) / total) * 180 / Math.PI;
    const sweep = sweepAngle % 360;
    return Math.abs(((angle - sweep + 360) % 360)) < 18;
  };

  // Handle device connection
  const handleConnectDevice = (device: Device) => {
    setCenteredDevice(device);
    setTimeout(() => {
      setConnected(true);
      setTimeout(() => onConnect(device), 700);
    }, 900);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="!flex-col !justify-center !items-center">
      <div className="relative w-full max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="w-full flex items-center justify-between px-8 pt-8 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
            <Bluetooth className="w-7 h-7" />
            <span>Radar Scan</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Radar */}
        <div className="relative w-full flex justify-center items-center" style={{height: RADAR_SIZE+40}}>
          <svg width={RADAR_SIZE} height={RADAR_SIZE} className="z-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Concentric circles */}
            {[...Array(CIRCLE_COUNT)].map((_, i) => (
              <circle
                key={i}
                cx={RADAR_SIZE/2}
                cy={RADAR_SIZE/2}
                r={((RADAR_SIZE/2) * (i+1)) / CIRCLE_COUNT}
                fill="none"
                stroke="#2563eb22"
                strokeWidth={i === CIRCLE_COUNT-1 ? 3.5 : 2}
                className={`animate-radar-circle${i}`}
              />
            ))}
            
            {/* Sweep line */}
            <g>
              <line
                x1={RADAR_SIZE/2}
                y1={RADAR_SIZE/2}
                x2={RADAR_SIZE/2 + (RADAR_SIZE/2-8) * Math.cos(sweepAngle * Math.PI / 180)}
                y2={RADAR_SIZE/2 + (RADAR_SIZE/2-8) * Math.sin(sweepAngle * Math.PI / 180)}
                stroke="#2563eb"
                strokeWidth={7}
                strokeOpacity={0.7}
                strokeLinecap="round"
              />
              <circle
                cx={RADAR_SIZE/2 + (RADAR_SIZE/2-8) * Math.cos(sweepAngle * Math.PI / 180)}
                cy={RADAR_SIZE/2 + (RADAR_SIZE/2-8) * Math.sin(sweepAngle * Math.PI / 180)}
                r={13}
                fill="#2563eb"
                fillOpacity={0.8}
                className="animate-pulse"
              />
            </g>
          </svg>
          
          {/* Device blips */}
          {devices.map((device, idx) => {
            const isCenter = centeredDevice?.id === device.id;
            const pos = isCenter ? 
              { left: `calc(50% - ${BLIP_RADIUS}px)`, top: `calc(50% - ${BLIP_RADIUS}px)` } : 
              getDevicePosition(idx, devices.length);
            const pulse = isSweepNear(idx, devices.length) && !isCenter;
            const { icon: DeviceIcon, colors } = typeConfig[device.type];
            
            return (
              <div
                key={device.id}
                className={`absolute flex flex-col items-center transition-all duration-500 ${isCenter ? 'z-20 scale-125' : 'z-10'} ${pulse ? 'animate-pulse-fast' : ''}`}
                style={{ ...pos, width: BLIP_RADIUS*2, height: BLIP_RADIUS*2 }}
                onMouseEnter={() => setHovered(device.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  className={`w-full h-full rounded-full flex items-center justify-center border-2 shadow-lg transition relative ${colors} ${isCenter ? 'ring-4 ring-blue-300' : ''}`}
                  onClick={() => handleConnectDevice(device)}
                  disabled={!!centeredDevice || connectingDeviceId === device.id}
                  aria-label={`Connect to ${device.name}`}
                >
                  <DeviceIcon />
                  {isCenter && connected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500 animate-fade-in" />
                    </span>
                  )}
                </button>
                
                {/* Tooltip on hover */}
                {hovered === device.id && !isCenter && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-3 text-sm z-30 border border-blue-100">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{device.name}</div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 mb-1">
                      <Battery className="w-4 h-4" /> {device.batteryLevel}%
                    </div>
                    <button
                      className="w-full mt-1 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition"
                      onClick={() => handleConnectDevice(device)}
                      disabled={!!centeredDevice || connectingDeviceId === device.id}
                    >
                      Connect
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="w-full flex justify-center py-6">
          <button
            className="px-8 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-lg shadow-md transition-colors duration-150"
            onClick={onClose}
            disabled={!!centeredDevice && !connected}
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Animations */}
      <style jsx global>{`
        /* Radar circles with dynamic opacity */
        @keyframes radar-circle-pulse {
          0% { opacity: var(--max-opacity, 0.7); }
          100% { opacity: var(--min-opacity, 0.1); }
        }
        
        .animate-radar-circle0 {
          --max-opacity: 0.7;
          --min-opacity: 0.2;
          animation: radar-circle-pulse 2.5s linear infinite alternate;
        }
        .animate-radar-circle1 {
          --max-opacity: 0.5;
          --min-opacity: 0.1;
          animation: radar-circle-pulse 2.5s linear infinite alternate;
        }
        .animate-radar-circle2 {
          --max-opacity: 0.4;
          --min-opacity: 0.08;
          animation: radar-circle-pulse 2.5s linear infinite alternate;
        }
        .animate-radar-circle3 {
          --max-opacity: 0.3;
          --min-opacity: 0.06;
          animation: radar-circle-pulse 2.5s linear infinite alternate;
        }

        /* Pulse animation for device blips */
        @keyframes pulse-fast {
          0%, 100% { box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.33); }
          50% { box-shadow: 0 0 0 16px rgba(96, 165, 250, 0.13); }
        }
        .animate-pulse-fast {
          animation: pulse-fast 0.7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Fade in animation */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease;
        }
      `}</style>
    </Modal>
  );
}; 