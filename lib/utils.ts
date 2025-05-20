import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names conditionally and merges tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with units and optionally rounds to a specified precision
 */
export function formatMetric(value: number | string, unit: string, precision: number = 0): string {
  if (typeof value === 'number') {
    const roundedValue = precision > 0 ? value.toFixed(precision) : Math.round(value).toString();
    return `${roundedValue}${unit}`;
  }
  return `${value}${unit}`;
}

/**
 * Returns a color status based on a value and thresholds
 */
export function getStatusColor(
  value: number, 
  thresholds: { warning: [number, number]; critical: [number, number] }
): 'normal' | 'warning' | 'critical' {
  const { warning, critical } = thresholds;
  
  if (value >= critical[0] && value <= critical[1]) {
    return 'critical';
  } else if (value >= warning[0] && value <= warning[1]) {
    return 'warning';
  }
  return 'normal';
}

/**
 * Shortens large numbers for display
 * e.g. 1000 -> 1K, 1000000 -> 1M
 */
export function shortenNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Gets the percentage difference between two values
 */
export function getPercentageDifference(current: number, previous: number): string {
  if (previous === 0) return '+∞%';
  
  const difference = ((current - previous) / previous) * 100;
  const sign = difference > 0 ? '+' : '';
  return `${sign}${difference.toFixed(1)}%`;
}

/**
 * Gets a readable time string from a date
 */
export function getTimeString(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Gets a color for a specific health metric based on its status
 */
export function getMetricStatusColor(metricType: string, status: 'normal' | 'warning' | 'critical'): string {
  const baseColors = {
    heartRate: { normal: 'text-green-600', warning: 'text-yellow-600', critical: 'text-red-600' },
    bloodOxygen: { normal: 'text-blue-600', warning: 'text-yellow-600', critical: 'text-red-600' },
    temperature: { normal: 'text-green-600', warning: 'text-yellow-600', critical: 'text-red-600' },
    default: { normal: 'text-green-600', warning: 'text-yellow-600', critical: 'text-red-600' }
  };

  const colorSet = baseColors[metricType as keyof typeof baseColors] || baseColors.default;
  return colorSet[status];
} 