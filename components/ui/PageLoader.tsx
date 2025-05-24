"use client";

import { Heart } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Sonar Rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-red-400/70 dark:border-red-300/70"
            style={{
              width: '100%',
              height: '100%',
              animation: `sonarPing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite`,
              animationDelay: `${i * 0.5}s`, // Staggered delay
            }}
          />
        ))}
        {/* Pulsing Heart Icon */}
        <Heart 
          className="relative z-10 h-16 w-16 text-red-500 dark:text-red-400 fill-red-500 dark:fill-red-400 animate-[heartbeat_1.5s_ease-in-out_infinite]"
        />
      </div>
      <p className="mt-8 text-lg font-medium text-gray-800 dark:text-gray-200 tracking-wide">
        Loading Health Dashboard...
      </p>
    </div>
  );
};

export default PageLoader; 