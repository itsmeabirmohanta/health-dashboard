'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricValue {
  current: string | number;
  previous?: string | number;
  change?: number;
  unit: string;
}

interface MetricCardProps {
  title: string;
  value: MetricValue;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
  onClick?: () => void;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50/70',
    iconBg: 'bg-blue-100',
    text: 'text-blue-600',
    accentBg: 'bg-blue-500',
  },
  red: {
    bg: 'bg-red-50/70',
    iconBg: 'bg-red-100',
    text: 'text-red-600',
    accentBg: 'bg-red-500',
  },
  green: {
    bg: 'bg-green-50/70',
    iconBg: 'bg-green-100',
    text: 'text-green-600',
    accentBg: 'bg-green-500',
  },
  purple: {
    bg: 'bg-purple-50/70',
    iconBg: 'bg-purple-100',
    text: 'text-purple-600',
    accentBg: 'bg-purple-500',
  },
  amber: {
    bg: 'bg-amber-50/70',
    iconBg: 'bg-amber-100',
    text: 'text-amber-600',
    accentBg: 'bg-amber-500',
  },
  indigo: {
    bg: 'bg-indigo-50/70',
    iconBg: 'bg-indigo-100',
    text: 'text-indigo-600',
    accentBg: 'bg-indigo-500',
  },
};

export function MetricCard({ title, value, icon, color, isLoading = false, onClick }: MetricCardProps) {
  const colorClasses = colorVariants[color as keyof typeof colorVariants] || colorVariants.blue;
  
  return (
    <div
      className={cn(
        'glass relative group rounded-xl border border-white/20 shadow-sm overflow-hidden transition-all cursor-pointer',
        'hover:shadow-md hover:translate-y-[-2px]',
        isLoading ? 'opacity-50 pointer-events-none' : ''
      )}
      onClick={onClick}
    >
      {/* Left vertical accent */}
      <div className={`absolute left-0 top-0 w-1 h-full ${colorClasses.accentBg}`} />
      
      <div className="p-5 pl-6">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={cn(
            'flex items-center justify-center w-9 h-9 rounded-full',
            colorClasses.iconBg,
            colorClasses.text
          )}>
            {icon}
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {isLoading ? '-' : value.current}
            </span>
            <span className="ml-1 text-sm text-gray-500">
              {value.unit}
            </span>
          </div>
          
          {value.change !== undefined && (
            <div className="mt-1 flex items-center">
              {value.change > 0 ? (
                <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
              ) : value.change < 0 ? (
                <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
              ) : null}
              
              <span className={cn(
                'text-xs font-medium',
                value.change > 0 ? 'text-green-600' :
                value.change < 0 ? 'text-red-600' :
                'text-gray-500'
              )}>
                {value.change > 0 ? '+' : ''}{value.change}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 