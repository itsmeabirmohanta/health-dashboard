/**
 * Generates a random value between min and max (inclusive)
 */
export function getRandomValue(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Calculates the percentage change between two values
 */
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Converts Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

/**
 * Converts Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

/**
 * Converts kilometers to miles
 */
export function kilometersToMiles(kilometers: number): number {
  return kilometers * 0.621371;
}

/**
 * Converts miles to kilometers
 */
export function milesToKilometers(miles: number): number {
  return miles * 1.60934;
}