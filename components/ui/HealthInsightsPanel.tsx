"use client";

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Brain,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useHealthStore } from '@/store/useHealthStore';
import { AIInsightsService } from '@/app/services/aiInsightsService';
import { HealthInsight, HealthScore } from '@/app/types/health';

interface HealthInsightsPanelProps {
  className?: string;
  compact?: boolean;
}

export function HealthInsightsPanel({ className = '', compact = false }: HealthInsightsPanelProps) {
  const { historicalData, selectedTimeRange } = useHealthStore();
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  // Fetch insights when data or time range changes
  useEffect(() => {
    const analyzeData = async () => {
      if (historicalData.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get anomalies and insights
        const detectedInsights = AIInsightsService.detectAnomalies(
          historicalData, 
          selectedTimeRange
        );
        
        // Get health score
        const score = AIInsightsService.calculateHealthScore(historicalData);
        
        // Get recommendations
        const recommendations = AIInsightsService.getPersonalizedRecommendations(historicalData);
        
        // Get AI analysis
        const analysis = await AIInsightsService.getAIAnalysis(historicalData);
        
        setInsights(detectedInsights);
        setHealthScore(score);
        setRecommendation(recommendations[0] || null);
        setAiAnalysis(analysis);
      } catch (error) {
        console.error("Error analyzing health data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    analyzeData();
  }, [historicalData, selectedTimeRange]);

  // Helper to get icon for insight type
  const getInsightIcon = (insight: HealthInsight) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch(insight.type) {
      case 'anomaly':
        return <AlertTriangle {...iconProps} />;
      case 'recommendation':
        return <CheckCircle {...iconProps} />;
      case 'trend':
        return insight.severity === 'info' 
          ? <TrendingUp {...iconProps} /> 
          : <TrendingDown {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  // Helper to get color classes based on insight severity
  const getInsightColorClasses = (insight: HealthInsight) => {
    switch(insight.severity) {
      case 'critical':
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-300",
          icon: "text-red-500"
        };
      case 'warning':
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-700 dark:text-amber-300",
          icon: "text-amber-500"
        };
      case 'info':
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-300",
          icon: "text-blue-500"
        };
    }
  };

  // Helper to get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  // Helper to get trend indicator
  const getTrendIndicator = (trend: 'improving' | 'stable' | 'declining') => {
    switch(trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'stable':
      default:
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-500" />
              Health Insights
            </h2>
          </div>
        </div>
        <div className="p-4 flex flex-col items-center justify-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Analyzing your health data...
          </p>
        </div>
      </div>
    );
  }

  // Render compact version for dashboard
  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary-500" />
              AI Health Analysis
            </h2>
          </div>
        </div>
        
        <div className="p-4">
          {healthScore && (
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore.overall)}`}>
                {healthScore.overall}
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Health Score</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {getTrendIndicator(healthScore.trend)} 
                  <span className="ml-1">
                    {healthScore.trend.charAt(0).toUpperCase() + healthScore.trend.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {aiAnalysis && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {aiAnalysis}
            </p>
          )}
          
          {insights.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Key Insights ({insights.length})
              </p>
              <div className="space-y-2">
                {insights.slice(0, 2).map((insight) => {
                  const colorClasses = getInsightColorClasses(insight);
                  return (
                    <div 
                      key={insight.id}
                      className={`text-sm p-2 rounded-md ${colorClasses.bg} ${colorClasses.border} border`}
                    >
                      <div className="flex items-start">
                        <div className={`mr-2 mt-0.5 ${colorClasses.icon}`}>
                          {getInsightIcon(insight)}
                        </div>
                        <div>
                          <p className={`font-medium ${colorClasses.text}`}>{insight.title}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {insights.length > 2 && (
                  <button className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline w-full text-center">
                    View all {insights.length} insights
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render full version for insights page
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-500" />
            AI-Powered Health Insights
          </h2>
        </div>
      </div>
      
      <div className="p-4">
        {healthScore && (
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-2">
              <div 
                className={`text-4xl font-bold ${getHealthScoreColor(healthScore.overall)}`}
                style={{ fontSize: '3rem' }}
              >
                {healthScore.overall}
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Overall Health Score</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {getTrendIndicator(healthScore.trend)} 
                  <span className="ml-1">
                    {healthScore.trend.charAt(0).toUpperCase() + healthScore.trend.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Health Score Categories */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
              {Object.entries(healthScore.categories).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700/50 rounded p-2 text-center">
                  <div 
                    className={`text-xl font-bold ${getHealthScoreColor(value)}`}
                  >
                    {value}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {key}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {aiAnalysis && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <Brain className="h-5 w-5 text-blue-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  AI Health Analysis
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                  <p>{aiAnalysis}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recommendations Section */}
        {recommendation && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
              Top Recommendation
            </h3>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-200">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Insights Section */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-3">
              Health Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight) => {
                const colorClasses = getInsightColorClasses(insight);
                const isExpanded = expandedInsight === insight.id;
                
                return (
                  <div 
                    key={insight.id}
                    className={`p-4 rounded-lg ${colorClasses.bg} border ${colorClasses.border}`}
                  >
                    <div 
                      className="flex justify-between items-start cursor-pointer"
                      onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 mr-3 ${colorClasses.icon}`}>
                          {getInsightIcon(insight)}
                        </div>
                        <div>
                          <h4 className={`text-sm font-medium ${colorClasses.text}`}>
                            {insight.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                      />
                    </div>
                    
                    {isExpanded && insight.recommendedAction && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                          Recommended Action
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {insight.recommendedAction}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                          <span className="mx-2">•</span>
                          <span>Detected: {insight.timestamp.toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {insights.length === 0 && !aiAnalysis && !healthScore && !recommendation && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Not enough data to generate insights yet.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Continue tracking your health metrics to receive personalized insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 