import { MetricData, HistoricalDataPoint, Alert, MetricType } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Utility to get a random number within a range
const getRandomInRange = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

// Default ranges for normal health metrics
const HEALTH_RANGES = {
  heartRate: { min: 60, max: 100 },
  bloodOxygen: { min: 95, max: 100 },
  steps: { min: 0, max: 1000 }, // For incremental generation
  sleep: { min: 6, max: 9 },
  bloodPressureSys: { min: 100, max: 130 },
  bloodPressureDia: { min: 60, max: 85 },
  temperature: { min: 97, max: 99 },
  weight: { min: 120, max: 180 },
  caloriesBurned: { min: 0, max: 300 }, // For incremental generation
};

// Default thresholds for alerts
export const DEFAULT_THRESHOLDS = {
  heartRate: {
    warning: { min: 50, max: 110 },
    danger: { min: 40, max: 130 },
  },
  bloodOxygen: {
    warning: { min: 90, max: 100 },
    danger: { min: 85, max: 100 },
  },
  temperature: {
    warning: { min: 97, max: 99.5 },
    danger: { min: 95, max: 103 },
  },
  bloodPressure: {
    warning: { min: 90, max: 140 }, // Systolic
    danger: { min: 80, max: 180 }, 
  },
};

// Generate a single random metric
export function generateRandomMetric(type: MetricType): MetricData {
  const timestamp = new Date().toISOString();
  let value: any;
  let unit: string;

  switch (type) {
    case "heartRate":
      value = getRandomInRange(HEALTH_RANGES.heartRate.min, HEALTH_RANGES.heartRate.max);
      unit = "bpm";
      break;
    case "bloodOxygen":
      value = getRandomInRange(HEALTH_RANGES.bloodOxygen.min, HEALTH_RANGES.bloodOxygen.max);
      unit = "%";
      break;
    case "steps":
      value = Math.round(getRandomInRange(HEALTH_RANGES.steps.min, HEALTH_RANGES.steps.max));
      unit = "steps";
      break;
    case "sleep":
      value = getRandomInRange(HEALTH_RANGES.sleep.min, HEALTH_RANGES.sleep.max);
      unit = "hours";
      break;
    case "bloodPressure":
      value = {
        sys: Math.round(getRandomInRange(HEALTH_RANGES.bloodPressureSys.min, HEALTH_RANGES.bloodPressureSys.max)),
        dia: Math.round(getRandomInRange(HEALTH_RANGES.bloodPressureDia.min, HEALTH_RANGES.bloodPressureDia.max)),
      };
      unit = "mmHg";
      break;
    case "temperature":
      value = getRandomInRange(HEALTH_RANGES.temperature.min, HEALTH_RANGES.temperature.max);
      unit = "°F";
      break;
    case "weight":
      value = getRandomInRange(HEALTH_RANGES.weight.min, HEALTH_RANGES.weight.max);
      unit = "lb";
      break;
    case "caloriesBurned":
      value = Math.round(getRandomInRange(HEALTH_RANGES.caloriesBurned.min, HEALTH_RANGES.caloriesBurned.max));
      unit = "kcal";
      break;
    default:
      value = 0;
      unit = "";
  }

  return {
    id: uuidv4(),
    timestamp,
    type,
    value,
    unit: unit as any,
  };
}

// Generate a historical data point (all metrics at a single point in time)
export function generateHistoricalDataPoint(timestamp: string): HistoricalDataPoint {
  return {
    timestamp,
    heartRate: getRandomInRange(HEALTH_RANGES.heartRate.min, HEALTH_RANGES.heartRate.max),
    bloodOxygen: getRandomInRange(HEALTH_RANGES.bloodOxygen.min, HEALTH_RANGES.bloodOxygen.max),
    steps: Math.round(getRandomInRange(HEALTH_RANGES.steps.min, HEALTH_RANGES.steps.max)),
    sleep: getRandomInRange(HEALTH_RANGES.sleep.min, HEALTH_RANGES.sleep.max),
    bloodPressureSys: Math.round(
      getRandomInRange(HEALTH_RANGES.bloodPressureSys.min, HEALTH_RANGES.bloodPressureSys.max)
    ),
    bloodPressureDia: Math.round(
      getRandomInRange(HEALTH_RANGES.bloodPressureDia.min, HEALTH_RANGES.bloodPressureDia.max)
    ),
    temperature: getRandomInRange(HEALTH_RANGES.temperature.min, HEALTH_RANGES.temperature.max),
    weight: getRandomInRange(HEALTH_RANGES.weight.min, HEALTH_RANGES.weight.max),
    caloriesBurned: Math.round(
      getRandomInRange(HEALTH_RANGES.caloriesBurned.min, HEALTH_RANGES.caloriesBurned.max)
    ),
  };
}

// Generate historical data for a specific time range
export function generateHistoricalData(
  days: number = 7,
  pointsPerDay: number = 24
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();
  
  for (let day = days - 1; day >= 0; day--) {
    for (let point = 0; point < pointsPerDay; point++) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      date.setHours(Math.floor(24 / pointsPerDay) * point);
      date.setMinutes(0);
      date.setSeconds(0);
      data.push(generateHistoricalDataPoint(date.toISOString()));
    }
  }

  return data;
}

// Check if a metric is outside its thresholds and generate alert if necessary
export function checkMetricAlerts(
  metric: MetricData,
  thresholds = DEFAULT_THRESHOLDS
): Alert | null {
  let alertLevel: "info" | "warning" | "danger" | null = null;
  let value: number;
  
  switch (metric.type) {
    case "heartRate":
      value = metric.value as number;
      if (
        value < thresholds.heartRate.danger.min ||
        value > thresholds.heartRate.danger.max
      ) {
        alertLevel = "danger";
      } else if (
        value < thresholds.heartRate.warning.min ||
        value > thresholds.heartRate.warning.max
      ) {
        alertLevel = "warning";
      }
      break;
    case "bloodOxygen":
      value = metric.value as number;
      if (
        value < thresholds.bloodOxygen.danger.min
      ) {
        alertLevel = "danger";
      } else if (
        value < thresholds.bloodOxygen.warning.min
      ) {
        alertLevel = "warning";
      }
      break;
    case "temperature":
      value = metric.value as number;
      if (
        value < thresholds.temperature.danger.min ||
        value > thresholds.temperature.danger.max
      ) {
        alertLevel = "danger";
      } else if (
        value < thresholds.temperature.warning.min ||
        value > thresholds.temperature.warning.max
      ) {
        alertLevel = "warning";
      }
      break;
    case "bloodPressure":
      const bp = metric.value as { sys: number; dia: number };
      if (
        bp.sys < thresholds.bloodPressure.danger.min ||
        bp.sys > thresholds.bloodPressure.danger.max
      ) {
        alertLevel = "danger";
      } else if (
        bp.sys < thresholds.bloodPressure.warning.min ||
        bp.sys > thresholds.bloodPressure.warning.max
      ) {
        alertLevel = "warning";
      }
      break;
    default:
      return null;
  }

  if (!alertLevel) return null;

  return {
    id: uuidv4(),
    type: metric.type,
    message: getAlertMessage(metric, alertLevel),
    timestamp: new Date().toISOString(),
    level: alertLevel,
    read: false,
  };
}

function getAlertMessage(metric: MetricData, level: "info" | "warning" | "danger"): string {
  let message = "";
  
  switch (metric.type) {
    case "heartRate":
      message = level === "danger"
        ? `Dangerous heart rate detected: ${metric.value} ${metric.unit}`
        : `Abnormal heart rate detected: ${metric.value} ${metric.unit}`;
      break;
    case "bloodOxygen":
      message = level === "danger"
        ? `Critical blood oxygen level: ${metric.value}${metric.unit}`
        : `Low blood oxygen level: ${metric.value}${metric.unit}`;
      break;
    case "temperature":
      message = level === "danger"
        ? `Critical body temperature: ${metric.value}${metric.unit}`
        : `Abnormal body temperature: ${metric.value}${metric.unit}`;
      break;
    case "bloodPressure":
      const bp = metric.value as { sys: number; dia: number };
      message = level === "danger"
        ? `Critical blood pressure: ${bp.sys}/${bp.dia} ${metric.unit}`
        : `Elevated blood pressure: ${bp.sys}/${bp.dia} ${metric.unit}`;
      break;
    default:
      message = `Abnormal ${metric.type} reading: ${metric.value} ${metric.unit}`;
  }
  
  return message;
} 