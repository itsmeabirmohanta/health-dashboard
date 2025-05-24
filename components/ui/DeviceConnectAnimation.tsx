import React, { useEffect, useState } from 'react';

interface DeviceConnectAnimationProps {
  visible: boolean;
  type: 'connect' | 'disconnect';
}

export const DeviceConnectAnimation: React.FC<DeviceConnectAnimationProps> = ({ visible, type }) => {
  const [phase, setPhase] = useState<'start' | 'link' | 'merge' | 'break' | 'end'>('start');

  useEffect(() => {
    if (!visible) return;
    setPhase('start');
    if (type === 'connect') {
      setTimeout(() => setPhase('link'), 400);
      setTimeout(() => setPhase('merge'), 1100);
      setTimeout(() => setPhase('end'), 1800);
    } else {
      setTimeout(() => setPhase('break'), 700);
      setTimeout(() => setPhase('end'), 1500);
    }
  }, [visible, type]);

  if (!visible || phase === 'end') return null;

  // Animation states
  const isLinking = phase === 'link' || phase === 'merge';
  const isMerging = phase === 'merge';
  const isBreaking = phase === 'break';

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all">
      <svg width="320" height="180" viewBox="0 0 320 180" className="mx-auto">
        {/* Device circle */}
        <circle
          cx={isMerging ? 160 : 80}
          cy={90}
          r={32}
          fill="#3b82f6"
          className={`transition-all duration-500 ${isMerging ? 'shadow-lg' : ''}`}
          style={{ filter: isMerging ? 'drop-shadow(0 0 24px #3b82f6aa)' : undefined }}
        />
        {/* Phone circle */}
        <circle
          cx={isMerging ? 160 : 240}
          cy={90}
          r={32}
          fill="#22c55e"
          className={`transition-all duration-500 ${isMerging ? 'shadow-lg' : ''}`}
          style={{ filter: isMerging ? 'drop-shadow(0 0 24px #22c55eaa)' : undefined }}
        />
        {/* Link line or break */}
        {isLinking && !isBreaking && (
          <rect
            x={isMerging ? 144 : 112}
            y={82}
            width={isMerging ? 32 : 96}
            height={16}
            rx={8}
            fill="url(#linkGradient)"
            className="transition-all duration-500"
            style={{ filter: 'drop-shadow(0 0 12px #60a5fa88)' }}
          />
        )}
        {/* Breaking effect */}
        {isBreaking && (
          <g>
            <rect x={112} y={82} width={96} height={16} rx={8} fill="#f87171" opacity={0.7} />
            <line x1={160} y1={80} x2={160} y2={100} stroke="#f87171" strokeWidth={4} strokeDasharray="6,6" />
          </g>
        )}
        <defs>
          <linearGradient id="linkGradient" x1="112" y1="90" x2="208" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-8 text-lg font-medium text-gray-800 dark:text-gray-200 tracking-wide">
        {type === 'connect'
          ? isMerging
            ? 'Device Connected!'
            : 'Connecting...'
          : isBreaking
            ? 'Disconnecting...'
            : 'Device Disconnected!'}
      </div>
    </div>
  );
}; 