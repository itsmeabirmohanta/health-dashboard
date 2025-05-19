import { HistoricalDataPoint } from "@/types/health";

// This simulates an AI service that analyzes health data
// In a real app, this would connect to an ML model or API like OpenAI

interface HealthInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  metric?: string;
  timestamp: Date;
  confidence: number; // 0-1
  actionable: boolean;
  recommendedAction?: string;
}

interface HealthScore {
  overall: number; // 0-100
  categories: {
    cardiac: number;
    respiratory: number;
    activity: number;
    sleep: number;
    stress: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  insights: string[];
}

export class AIInsightsService {
  // Analyze historical data for patterns and anomalies
  static detectAnomalies(data: HistoricalDataPoint[], timeRange: string): HealthInsight[] {
    const insights: HealthInsight[] = [];
    
    if (data.length < 7) return insights; // Need minimum data
    
    // Heart rate anomaly detection
    const hrValues = data.map(point => point.heartRate);
    const hrMean = hrValues.reduce((sum, val) => sum + val, 0) / hrValues.length;
    const hrStdDev = Math.sqrt(
      hrValues.reduce((sum, val) => sum + Math.pow(val - hrMean, 2), 0) / hrValues.length
    );
    
    // Find outliers (beyond 2 standard deviations)
    const outliers = data.filter(point => 
      Math.abs(point.heartRate - hrMean) > 2 * hrStdDev
    );
    
    if (outliers.length > 0) {
      insights.push({
        id: 'hr-anomaly-1',
        type: 'anomaly',
        severity: outliers.length >= 3 ? 'warning' : 'info',
        title: 'Irregular Heart Rate Pattern',
        description: `Detected ${outliers.length} instances where your heart rate was significantly outside your normal range.`,
        metric: 'heartRate',
        timestamp: new Date(),
        confidence: 0.85,
        actionable: true,
        recommendedAction: 'Consider discussing these irregular patterns with your healthcare provider.'
      });
    }
    
    // Sleep pattern analysis
    const sleepValues = data.map(point => point.sleep);
    const sleepMean = sleepValues.reduce((sum, val) => sum + val, 0) / sleepValues.length;
    
    if (sleepMean < 7) {
      insights.push({
        id: 'sleep-recommendation-1',
        type: 'recommendation',
        severity: sleepMean < 6 ? 'warning' : 'info',
        title: 'Sleep Optimization',
        description: 'Your average sleep duration is below the recommended 7-9 hours.',
        metric: 'sleep',
        timestamp: new Date(),
        confidence: 0.9,
        actionable: true,
        recommendedAction: 'Try reducing screen time before bed and maintaining a consistent sleep schedule.'
      });
    }
    
    // Blood oxygen pattern
    const oxygenValues = data.map(point => point.bloodOxygen);
    const recentOxygenValues = oxygenValues.slice(-5);
    const recentOxygenMean = recentOxygenValues.reduce((sum, val) => sum + val, 0) / recentOxygenValues.length;
    
    if (recentOxygenMean < 94) {
      insights.push({
        id: 'oxygen-warning-1',
        type: 'anomaly',
        severity: 'warning',
        title: 'Blood Oxygen Concern',
        description: 'Your recent blood oxygen readings are trending below optimal levels.',
        metric: 'bloodOxygen',
        timestamp: new Date(),
        confidence: 0.88,
        actionable: true,
        recommendedAction: 'Consider consulting with a healthcare provider, especially if you experience shortness of breath.'
      });
    }
    
    // Activity trend
    const stepsValues = data.map(point => point.steps);
    const stepsAverage = stepsValues.reduce((sum, val) => sum + val, 0) / stepsValues.length;
    
    if (stepsAverage < 7000) {
      insights.push({
        id: 'activity-recommendation-1',
        type: 'recommendation',
        severity: 'info',
        title: 'Increase Daily Activity',
        description: 'Your average daily step count is below the recommended target of 10,000 steps.',
        metric: 'steps',
        timestamp: new Date(),
        confidence: 0.95,
        actionable: true,
        recommendedAction: 'Try adding a 15-minute walk to your daily routine to improve cardiovascular health.'
      });
    }
    
    return insights;
  }
  
  // Calculate overall health score based on metrics
  static calculateHealthScore(data: HistoricalDataPoint[]): HealthScore {
    if (data.length === 0) {
      return {
        overall: 0,
        categories: { cardiac: 0, respiratory: 0, activity: 0, sleep: 0, stress: 0 },
        trend: 'stable',
        insights: []
      };
    }
    
    // Get most recent week of data
    const recentData = data.slice(-7);
    
    // Calculate cardiac score (based on heart rate)
    const hrValues = recentData.map(d => d.heartRate);
    const avgHR = hrValues.reduce((sum, val) => sum + val, 0) / hrValues.length;
    const hrVariability = Math.max(...hrValues) - Math.min(...hrValues);
    
    // HR in healthy range gets higher score (60-100 bpm is ideal)
    const cardiacScore = avgHR >= 60 && avgHR <= 100 ? 
      90 - (hrVariability > 30 ? 15 : 0) : 
      70 - (hrVariability > 30 ? 15 : 0);
    
    // Calculate respiratory score (based on blood oxygen)
    const oxygenValues = recentData.map(d => d.bloodOxygen);
    const avgOxygen = oxygenValues.reduce((sum, val) => sum + val, 0) / oxygenValues.length;
    
    // Higher oxygen gets better score (95-100% is ideal)
    const respiratoryScore = avgOxygen >= 95 ? 90 : avgOxygen >= 92 ? 75 : 60;
    
    // Calculate activity score (based on steps)
    const stepsValues = recentData.map(d => d.steps);
    const avgSteps = stepsValues.reduce((sum, val) => sum + val, 0) / stepsValues.length;
    
    // More steps gets better score (10k steps target)
    const activityScore = avgSteps >= 10000 ? 90 : avgSteps >= 7500 ? 80 : avgSteps >= 5000 ? 70 : 60;
    
    // Calculate sleep score (based on sleep duration)
    const sleepValues = recentData.map(d => d.sleep);
    const avgSleep = sleepValues.reduce((sum, val) => sum + val, 0) / sleepValues.length;
    
    // 7-9 hours gets best score
    const sleepScore = avgSleep >= 7 && avgSleep <= 9 ? 90 : avgSleep >= 6 ? 75 : 60;
    
    // Calculate stress score (derived from heart rate variability - simulated)
    const stressScore = 100 - (hrVariability / 2);
    
    // Calculate overall score (weighted average)
    const overall = Math.round(
      (cardiacScore * 0.25) + 
      (respiratoryScore * 0.25) + 
      (activityScore * 0.2) + 
      (sleepScore * 0.2) + 
      (stressScore * 0.1)
    );
    
    // Determine trend (compare to previous period if available)
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (data.length > 14) {
      const previousPeriod = data.slice(-14, -7);
      const prevOverall = AIInsightsService.calculateHealthScore(previousPeriod).overall;
      
      if (overall > prevOverall + 5) trend = 'improving';
      else if (overall < prevOverall - 5) trend = 'declining';
    }
    
    // Generate insights
    const insights: string[] = [];
    
    if (cardiacScore < 70) insights.push("Your heart health metrics could use improvement.");
    if (respiratoryScore < 75) insights.push("Consider ways to improve your respiratory health.");
    if (activityScore < 70) insights.push("Increased physical activity would benefit your overall health.");
    if (sleepScore < 75) insights.push("Optimizing your sleep habits could significantly improve your health score.");
    
    return {
      overall,
      categories: {
        cardiac: cardiacScore,
        respiratory: respiratoryScore,
        activity: activityScore,
        sleep: sleepScore,
        stress: stressScore
      },
      trend,
      insights
    };
  }
  
  // Generate personalized recommendations
  static getPersonalizedRecommendations(data: HistoricalDataPoint[]): string[] {
    if (data.length === 0) return [];
    
    const recentData = data.slice(-7);
    const recommendations: string[] = [];
    
    // Sleep recommendations
    const sleepValues = recentData.map(d => d.sleep);
    const avgSleep = sleepValues.reduce((sum, val) => sum + val, 0) / sleepValues.length;
    
    if (avgSleep < 6) {
      recommendations.push("Your sleep is significantly below recommended levels. Try establishing a consistent sleep schedule and limiting screen time before bed.");
    } else if (avgSleep < 7) {
      recommendations.push("Consider improving your sleep routine by going to bed 30 minutes earlier and creating a relaxing pre-sleep ritual.");
    }
    
    // Activity recommendations
    const stepsValues = recentData.map(d => d.steps);
    const avgSteps = stepsValues.reduce((sum, val) => sum + val, 0) / stepsValues.length;
    
    if (avgSteps < 5000) {
      recommendations.push("Your activity level is low. Try setting a goal of 7,000 steps per day as a starting point.");
    } else if (avgSteps < 8000) {
      recommendations.push("You're making good progress with activity. Consider adding strength training twice a week to complement your step count.");
    }
    
    // Heart rate recommendations
    const hrValues = recentData.map(d => d.heartRate);
    const avgHR = hrValues.reduce((sum, val) => sum + val, 0) / hrValues.length;
    
    if (avgHR > 80) {
      recommendations.push("Your resting heart rate is elevated. Regular cardio exercise and stress management techniques may help lower it.");
    }
    
    // Blood oxygen recommendations
    const oxygenValues = recentData.map(d => d.bloodOxygen);
    const avgOxygen = oxygenValues.reduce((sum, val) => sum + val, 0) / oxygenValues.length;
    
    if (avgOxygen < 95) {
      recommendations.push("Your blood oxygen levels could be improved. Consider breathing exercises, increased physical activity, and reducing exposure to pollutants.");
    }
    
    // Add general recommendations if we don't have enough specific ones
    if (recommendations.length < 2) {
      recommendations.push("Stay hydrated by drinking at least 8 glasses of water per day.");
      recommendations.push("Practice mindfulness meditation for 10 minutes daily to reduce stress and improve mental well-being.");
    }
    
    return recommendations;
  }
  
  // Simulate integration with external AI services like OpenAI
  static async getAIAnalysis(data: HistoricalDataPoint[]): Promise<string> {
    // In a real implementation, this would call OpenAI's API
    // For now, we'll simulate a response based on the data
    
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
    
    const healthScore = this.calculateHealthScore(data);
    
    let analysis = `Based on your recent health data, your overall health score is ${healthScore.overall}/100. `;
    
    if (healthScore.trend === 'improving') {
      analysis += "Your health metrics are showing positive improvements! ";
    } else if (healthScore.trend === 'declining') {
      analysis += "Some of your health indicators have been trending downward recently. ";
    } else {
      analysis += "Your health metrics have been relatively stable. ";
    }
    
    // Add category-specific insights
    const lowestCategory = Object.entries(healthScore.categories)
      .reduce((lowest, [key, value]) => value < lowest.value ? {key, value} : lowest, {key: '', value: 100});
    
    if (lowestCategory.key) {
      switch(lowestCategory.key) {
        case 'cardiac':
          analysis += "Your cardiac health metrics indicate room for improvement. Consider regular cardiovascular exercise and discussing these trends with your doctor.";
          break;
        case 'respiratory':
          analysis += "Your respiratory metrics could be improved. Regular aerobic exercise and breathing exercises may help improve these numbers.";
          break;
        case 'activity':
          analysis += "Increasing your daily physical activity would benefit your overall health. Try to incorporate more movement throughout your day.";
          break;
        case 'sleep':
          analysis += "Your sleep patterns could be optimized. Consistent sleep and wake times, along with good sleep hygiene, can significantly improve your health.";
          break;
        case 'stress':
          analysis += "Your metrics suggest elevated stress levels. Mindfulness practices and relaxation techniques may help improve these indicators.";
          break;
      }
    }
    
    return analysis;
  }
} 