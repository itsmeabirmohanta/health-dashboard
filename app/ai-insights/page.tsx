"use client";

import { useState, useEffect } from "react";
import { HealthInsightsPanel } from "@/components/ui/HealthInsightsPanel";
import { useHealthStore } from "@/store/useHealthStore";
import { Brain, ChevronRight } from "lucide-react";

export default function AIInsightsPage() {
  const { syncMetrics, fetchHistoricalData } = useHealthStore();
  
  // Initial data fetch
  useEffect(() => {
    syncMetrics();
    fetchHistoricalData('30d'); // For AI insights, we want more historical data
  }, [syncMetrics, fetchHistoricalData]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-red-500" />
            AI Health Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Advanced analysis of your health data using artificial intelligence
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Insights Panel */}
        <div className="glass rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <HealthInsightsPanel />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Additional Information About AI Analysis */}
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              About Health Score
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Your Health Score is calculated using advanced algorithms that analyze various aspects of your health data:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li><span className="font-medium">Cardiac</span>: Heart rate patterns and variability</li>
              <li><span className="font-medium">Respiratory</span>: Blood oxygen levels and stability</li>
              <li><span className="font-medium">Activity</span>: Step counts and movement patterns</li>
              <li><span className="font-medium">Sleep</span>: Duration and quality of sleep</li>
              <li><span className="font-medium">Stress</span>: Derived from heart rate variability and other factors</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              Scores range from 0-100, with higher scores indicating better overall health metrics.
            </p>
            <div className="mt-4">
              <button className="flex items-center text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
                Learn more <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              How AI Powers Your Insights
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Our health analysis system uses several AI techniques to provide personalized insights:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li><span className="font-medium">Anomaly Detection</span>: Identifies unusual patterns in your health data</li>
              <li><span className="font-medium">Trend Analysis</span>: Recognizes meaningful trends over time</li>
              <li><span className="font-medium">Personalized Recommendations</span>: Suggests actions based on your specific health patterns</li>
              <li><span className="font-medium">Predictive Analysis</span>: Forecasts potential health trends based on historical data</li>
            </ul>
            <p className="text-sm text-gray-600 mt-3">
              All insights are for informational purposes only and should not replace professional medical advice.
            </p>
            <div className="mt-4">
              <button className="flex items-center text-sm text-red-500 font-medium hover:text-red-600 transition-colors">
                Explore AI features <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Privacy & Data Security
          </h2>
          <p className="text-sm text-gray-600">
            Your health data is processed locally on your device. Our AI analysis respects your privacy by keeping 
            sensitive information secure. You can adjust privacy settings in your account preferences to control 
            how your data is used for generating insights.
          </p>
          <div className="mt-4">
            <button className="btn-primary flex items-center gap-2">
              Adjust privacy settings <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 