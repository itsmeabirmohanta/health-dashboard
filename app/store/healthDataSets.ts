// Various health data sets for simulation
import { addHours, addDays, subHours, subDays, format } from 'date-fns';

// Types
export type MetricValue = number | string;

export interface Metric {
  value: MetricValue;
  unit: string;
  timestamp: string;
  status?: 'normal' | 'warning' | 'critical';
}

export interface HealthDataPoint {
  timestamp: string;
  heartRate?: number;
  bloodOxygen?: number;
  steps?: number;
  caloriesBurned?: number;
  sleep?: number;
  bodyTemperature?: number;
  restingHeartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
}

// Generate timestamps for historical data
export const generateTimePoints = (range: '24h' | '7d' | '30d' | '90d', pointCount = 24): string[] => {
  const now = new Date();
  const timestamps: string[] = [];
  
  let interval: number;
  let timeFunc: (date: Date, amount: number) => Date;
  
  switch (range) {
    case '24h': 
      interval = 24 / pointCount;
      timeFunc = subHours;
      break;
    case '7d':
      interval = 7 / pointCount;
      timeFunc = subDays;
      break;
    case '30d':
      interval = 30 / pointCount;
      timeFunc = subDays;
      break;
    case '90d':
      interval = 90 / pointCount;
      timeFunc = subDays;
      break;
  }
  
  for (let i = 0; i < pointCount; i++) {
    const timePoint = timeFunc(now, interval * i);
    timestamps.unshift(timePoint.toISOString());
  }
  
  return timestamps;
};

// Normal Day Data Pattern
export const generateNormalDayData = (range: '24h' | '7d' | '30d' | '90d'): HealthDataPoint[] => {
  const timestamps = generateTimePoints(range);
  const data: HealthDataPoint[] = [];
  
  timestamps.forEach((timestamp, index) => {
    const timeOfDay = new Date(timestamp).getHours();
    
    // Heart rate varies throughout the day
    let heartRate = 65; // Base resting heart rate
    
    // Morning exercise spike
    if (timeOfDay >= 6 && timeOfDay <= 8) {
      heartRate = 110 + Math.random() * 30;
    } 
    // Afternoon activity
    else if (timeOfDay >= 12 && timeOfDay <= 14) {
      heartRate = 85 + Math.random() * 15;
    }
    // Evening relaxation
    else if (timeOfDay >= 18 && timeOfDay <= 22) {
      heartRate = 70 + Math.random() * 10;
    }
    // Sleep
    else if (timeOfDay >= 23 || timeOfDay <= 5) {
      heartRate = 55 + Math.random() * 10;
    }
    
    // Add slight randomness
    heartRate = Math.round(heartRate + (Math.random() * 5 - 2.5));
    
    // Blood oxygen stays relatively stable
    const bloodOxygen = Math.round(96 + Math.random() * 3);
    
    // Steps accumulate during the day and reset at midnight
    let steps = 0;
    if (timeOfDay >= 6 && timeOfDay <= 22) {
      const baseStepsPerHour = 500;
      // More steps during common exercise times
      const multiplier = (timeOfDay >= 6 && timeOfDay <= 8) || (timeOfDay >= 17 && timeOfDay <= 19) ? 3 : 1;
      steps = Math.round(baseStepsPerHour * multiplier * (1 + Math.random() * 0.4 - 0.2));
    }
    
    // Calories follow a similar pattern to steps
    let calories = steps * 0.05;
    
    // Body temperature
    const bodyTemp = 98.2 + Math.random() * 0.8;
    
    data.push({
      timestamp,
      heartRate,
      bloodOxygen,
      steps,
      caloriesBurned: Math.round(calories),
      bodyTemperature: parseFloat(bodyTemp.toFixed(1)),
      restingHeartRate: 62 + Math.floor(Math.random() * 5),
      bloodPressureSystolic: 115 + Math.floor(Math.random() * 10),
      bloodPressureDiastolic: 75 + Math.floor(Math.random() * 8),
    });
  });
  
  return data;
};

// High Activity Day Data Pattern
export const generateHighActivityData = (range: '24h' | '7d' | '30d' | '90d'): HealthDataPoint[] => {
  const timestamps = generateTimePoints(range);
  const data: HealthDataPoint[] = [];
  
  timestamps.forEach((timestamp) => {
    const timeOfDay = new Date(timestamp).getHours();
    
    // Higher heart rate throughout the day
    let heartRate = 70; // Higher base resting rate
    
    // Morning intense workout
    if (timeOfDay >= 6 && timeOfDay <= 9) {
      heartRate = 140 + Math.random() * 30;
    } 
    // Afternoon activity
    else if (timeOfDay >= 12 && timeOfDay <= 15) {
      heartRate = 100 + Math.random() * 20;
    }
    // Evening workout
    else if (timeOfDay >= 18 && timeOfDay <= 20) {
      heartRate = 130 + Math.random() * 25;
    }
    // Recovery/sleep
    else if (timeOfDay >= 22 || timeOfDay <= 5) {
      heartRate = 60 + Math.random() * 10;
    }
    
    heartRate = Math.round(heartRate + (Math.random() * 5 - 2.5));
    
    // Blood oxygen may dip slightly during intense exercise
    let bloodOxygen = 97;
    if ((timeOfDay >= 6 && timeOfDay <= 9) || (timeOfDay >= 18 && timeOfDay <= 20)) {
      bloodOxygen = 94 + Math.random() * 3;
    }
    bloodOxygen = Math.round(bloodOxygen);
    
    // Much higher step count
    let steps = 0;
    if (timeOfDay >= 6 && timeOfDay <= 22) {
      const baseStepsPerHour = 1000;
      // More steps during workouts
      const multiplier = (timeOfDay >= 6 && timeOfDay <= 9) || (timeOfDay >= 18 && timeOfDay <= 20) ? 5 : 1.5;
      steps = Math.round(baseStepsPerHour * multiplier * (1 + Math.random() * 0.4 - 0.2));
    }
    
    // Higher calorie burn
    let calories = steps * 0.07;
    
    // Body temperature slightly elevated due to exercise
    const bodyTemp = 98.6 + Math.random() * 0.8;
    
    data.push({
      timestamp,
      heartRate,
      bloodOxygen,
      steps,
      caloriesBurned: Math.round(calories),
      bodyTemperature: parseFloat(bodyTemp.toFixed(1)),
      restingHeartRate: 58 + Math.floor(Math.random() * 4), // Better cardiovascular fitness
      bloodPressureSystolic: 120 + Math.floor(Math.random() * 10),
      bloodPressureDiastolic: 70 + Math.floor(Math.random() * 8),
    });
  });
  
  return data;
};

// Illness/Stress Data Pattern
export const generateIllnessData = (range: '24h' | '7d' | '30d' | '90d'): HealthDataPoint[] => {
  const timestamps = generateTimePoints(range);
  const data: HealthDataPoint[] = [];
  
  timestamps.forEach((timestamp) => {
    const timeOfDay = new Date(timestamp).getHours();
    
    // Elevated resting heart rate due to illness/stress
    let heartRate = 80 + Math.random() * 15; 
    
    // Less activity variation due to illness
    if (timeOfDay >= 8 && timeOfDay <= 20) {
      heartRate += Math.random() * 20;
    }
    
    // Blood oxygen lower due to respiratory issues
    const bloodOxygen = Math.round(93 + Math.random() * 3);
    
    // Fewer steps due to illness
    let steps = 0;
    if (timeOfDay >= 8 && timeOfDay <= 20) {
      steps = Math.round(200 * (1 + Math.random() * 0.5));
    }
    
    // Fewer calories burned
    let calories = steps * 0.05;
    
    // Elevated body temperature (fever)
    const bodyTemp = 99.8 + Math.random() * 1.4;
    
    data.push({
      timestamp,
      heartRate: Math.round(heartRate),
      bloodOxygen,
      steps,
      caloriesBurned: Math.round(calories),
      bodyTemperature: parseFloat(bodyTemp.toFixed(1)),
      restingHeartRate: 78 + Math.floor(Math.random() * 8),
      bloodPressureSystolic: 125 + Math.floor(Math.random() * 15),
      bloodPressureDiastolic: 82 + Math.floor(Math.random() * 10),
    });
  });
  
  return data;
};

// Recovery Day Data Pattern
export const generateRecoveryData = (range: '24h' | '7d' | '30d' | '90d'): HealthDataPoint[] => {
  const timestamps = generateTimePoints(range);
  const data: HealthDataPoint[] = [];
  
  timestamps.forEach((timestamp) => {
    const timeOfDay = new Date(timestamp).getHours();
    
    // Lower heart rate, focused on recovery
    let heartRate = 62 + Math.random() * 10;
    
    // Light activity only
    if (timeOfDay >= 10 && timeOfDay <= 18) {
      heartRate += Math.random() * 15;
    }
    
    // Normal blood oxygen
    const bloodOxygen = Math.round(96 + Math.random() * 3);
    
    // Moderate steps, light activity only
    let steps = 0;
    if (timeOfDay >= 8 && timeOfDay <= 20) {
      const baseStepsPerHour = 300;
      steps = Math.round(baseStepsPerHour * (1 + Math.random() * 0.3));
    }
    
    // Reduced calorie burn
    let calories = steps * 0.05;
    
    // Normal body temperature
    const bodyTemp = 98.4 + Math.random() * 0.6;
    
    data.push({
      timestamp,
      heartRate: Math.round(heartRate),
      bloodOxygen,
      steps,
      caloriesBurned: Math.round(calories),
      bodyTemperature: parseFloat(bodyTemp.toFixed(1)),
      restingHeartRate: 60 + Math.floor(Math.random() * 5),
      bloodPressureSystolic: 118 + Math.floor(Math.random() * 8),
      bloodPressureDiastolic: 72 + Math.floor(Math.random() * 7),
    });
  });
  
  return data;
};

// Dataset profiles
export const dataSets = {
  normalDay: {
    name: "Normal Day",
    description: "Typical daily activities with moderate exercise",
    generator: generateNormalDayData
  },
  highActivity: {
    name: "High Activity",
    description: "Intense workout sessions and high step count",
    generator: generateHighActivityData
  },
  illness: {
    name: "Illness/Stress",
    description: "Elevated heart rate, fever, and low activity",
    generator: generateIllnessData
  },
  recovery: {
    name: "Recovery Day",
    description: "Rest day with minimal activity and lower heart rate",
    generator: generateRecoveryData
  }
};

// Generate summary metrics for real-time display
export const generateCurrentMetrics = (dataSet: 'normalDay' | 'highActivity' | 'illness' | 'recovery'): Record<string, Metric> => {
  const now = new Date();
  const data = dataSets[dataSet].generator('24h').slice(-3); // Get latest data points
  const latest = data[data.length - 1];
  
  // Calculate statuses
  const heartRateStatus = 
    latest.heartRate! > 100 ? 'warning' : 
    latest.heartRate! > 120 ? 'critical' : 'normal';
    
  const bloodOxygenStatus = 
    latest.bloodOxygen! < 95 ? 'warning' : 
    latest.bloodOxygen! < 90 ? 'critical' : 'normal';
    
  const temperatureStatus = 
    latest.bodyTemperature! > 99.5 ? 'warning' : 
    latest.bodyTemperature! > 100.4 ? 'critical' : 'normal';
  
  return {
    heartRate: {
      value: latest.heartRate!,
      unit: 'bpm',
      timestamp: now.toISOString(),
      status: heartRateStatus
    },
    bloodOxygen: {
      value: latest.bloodOxygen!,
      unit: '%',
      timestamp: now.toISOString(),
      status: bloodOxygenStatus
    },
    steps: {
      value: latest.steps!,
      unit: 'steps',
      timestamp: now.toISOString(),
      status: 'normal'
    },
    caloriesBurned: {
      value: latest.caloriesBurned!,
      unit: 'kcal',
      timestamp: now.toISOString(),
      status: 'normal'
    },
    bodyTemperature: {
      value: latest.bodyTemperature!,
      unit: '°F',
      timestamp: now.toISOString(),
      status: temperatureStatus
    },
    bloodPressureSystolic: {
      value: latest.bloodPressureSystolic!,
      unit: 'mmHg',
      timestamp: now.toISOString(),
      status: 'normal'
    },
    bloodPressureDiastolic: {
      value: latest.bloodPressureDiastolic!,
      unit: 'mmHg',
      timestamp: now.toISOString(),
      status: 'normal'
    },
    restingHeartRate: {
      value: latest.restingHeartRate!,
      unit: 'bpm',
      timestamp: now.toISOString(),
      status: 'normal'
    }
  };
}; 