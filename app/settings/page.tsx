"use client";

import { useState, useEffect } from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { 
  Settings, 
  Bell, 
  Moon, 
  User, 
  Shield, 
  Save,
  Heart, 
  Droplets, 
  Activity,
  Thermometer, 
  Scale
} from "lucide-react";

// Mock settings interface
interface AppSettings {
  notifications: {
    push: boolean;
    email: boolean;
    criticalAlertsOnly: boolean;
  };
  display: {
    theme: "light" | "dark" | "system";
    showTrends: boolean;
    compactView: boolean;
    metricSystem: "imperial" | "metric";
  };
  privacy: {
    shareData: boolean;
    dataRetention: number; // days
  };
  thresholds: {
    heartRate: {
      min: number;
      max: number;
    };
    bloodOxygen: {
      min: number;
    };
    steps: {
      target: number;
    };
    sleep: {
      target: number;
    };
    temperature: {
      min: number;
      max: number;
    };
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "thresholds" | "notifications" | "privacy">("general");
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      push: true,
      email: false,
      criticalAlertsOnly: false
    },
    display: {
      theme: "system",
      showTrends: true,
      compactView: false,
      metricSystem: "imperial"
    },
    privacy: {
      shareData: false,
      dataRetention: 90
    },
    thresholds: {
      heartRate: {
        min: 50,
        max: 100
      },
      bloodOxygen: {
        min: 92
      },
      steps: {
        target: 10000
      },
      sleep: {
        target: 8
      },
      temperature: {
        min: 97,
        max: 99.5
      }
    }
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const { 
    syncMetrics,
  } = useHealthStore(state => ({
    syncMetrics: state.syncMetrics,
  }));

  // Initialize
  useEffect(() => {
    // This would normally fetch settings from an API or local storage
    syncMetrics();
  }, [syncMetrics]);

  // Update settings handler
  const updateSettings = <K extends keyof AppSettings>(
    category: K,
    updates: Partial<AppSettings[K]>
  ) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        ...updates
      }
    });
    setUnsavedChanges(true);
  };

  // Save settings
  const saveSettings = () => {
    // This would normally save to an API or local storage
    console.log("Saving settings:", settings);
    setUnsavedChanges(false);

    // Show a success message
    alert("Settings saved successfully");
  };

  return (
    <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your app preferences and health monitoring settings
            </p>
          </div>

          {/* Settings navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "general"
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                General
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("thresholds")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "thresholds"
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Health Thresholds
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "notifications"
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("privacy")}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === "privacy"
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy
              </div>
            </button>
          </div>

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Display Settings
                </h2>
                
                <div className="mt-6 space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="showTrends"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={settings.display.showTrends}
                        onChange={(e) => updateSettings('display', { showTrends: e.target.checked })}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="showTrends" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Show trend indicators on dashboard
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                    Display up/down trend indicators for metrics on the main dashboard
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="compactView"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={settings.display.compactView}
                        onChange={(e) => updateSettings('display', { compactView: e.target.checked })}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="compactView" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compact view
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use a more compact layout to show more information on screen
                      </p>
                    </div>
                  </div>
            </div>
                  </div>
                  
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Units
            </h2>
            
            <div className="mt-6">
              <label htmlFor="metricSystem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Measurement system
                    </label>
                    <select
                id="metricSystem"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={settings.display.metricSystem}
                      onChange={(e) => updateSettings('display', { 
                  metricSystem: e.target.value as 'metric' | 'imperial'
                      })}
                    >
                      <option value="imperial">Imperial (lb, ft, F)</option>
                      <option value="metric">Metric (kg, cm, C)</option>
                    </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose your preferred system for measurements and temperatures
              </p>
                </div>
              </div>
              
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Theme
                </h2>
                
            <div className="mt-6">
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Application theme
              </label>
              <select
                id="theme"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                value={settings.display.theme}
                onChange={(e) => updateSettings('display', { 
                  theme: e.target.value as 'light' | 'dark' | 'system'
                })}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System default</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose light or dark theme, or match your system settings
              </p>
                </div>
              </div>
            </div>
          )}

      {/* Health Thresholds Settings */}
          {activeTab === "thresholds" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Heart Rate Thresholds
                </h2>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                <label htmlFor="heartRateMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum (bpm)
                        </label>
                <div className="mt-1">
                        <input
                          type="number"
                    id="heartRateMin"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={settings.thresholds.heartRate.min}
                    min={30}
                    max={100}
                          onChange={(e) => updateSettings('thresholds', { 
                            heartRate: { 
                              ...settings.thresholds.heartRate,
                        min: parseInt(e.target.value) || 0
                            } 
                          })}
                        />
                </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Alert if heart rate drops below this value
                        </p>
                      </div>
              
                      <div>
                <label htmlFor="heartRateMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum (bpm)
                        </label>
                <div className="mt-1">
                        <input
                          type="number"
                    id="heartRateMax"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={settings.thresholds.heartRate.max}
                    min={60}
                    max={220}
                          onChange={(e) => updateSettings('thresholds', { 
                            heartRate: { 
                              ...settings.thresholds.heartRate,
                        max: parseInt(e.target.value) || 0
                            } 
                          })}
                        />
                </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Alert if heart rate rises above this value
                        </p>
                      </div>
                    </div>
                  </div>
                  
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Blood Oxygen Threshold
            </h2>
            
            <div className="mt-6">
              <label htmlFor="bloodOxygenMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Minimum (%)
                      </label>
              <div className="mt-1">
                      <input
                        type="number"
                  id="bloodOxygenMin"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={settings.thresholds.bloodOxygen.min}
                  min={80}
                  max={100}
                        onChange={(e) => updateSettings('thresholds', { 
                    bloodOxygen: { 
                      min: parseInt(e.target.value) || 0
                    }
                        })}
                      />
              </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Alert if blood oxygen drops below this percentage
                      </p>
                    </div>
                  </div>
                  
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Step Goal
            </h2>
            
            <div className="mt-6">
              <label htmlFor="stepsTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Daily target
                      </label>
              <div className="mt-1">
                      <input
                        type="number"
                  id="stepsTarget"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={settings.thresholds.steps.target}
                  min={1000}
                  max={50000}
                  step={500}
                        onChange={(e) => updateSettings('thresholds', { 
                    steps: { 
                      target: parseInt(e.target.value) || 0
                    }
                        })}
                      />
              </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Goal for daily steps (recommended: 10,000)
                      </p>
                    </div>
                  </div>
                  
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-500" />
              Sleep Goal
            </h2>
            
            <div className="mt-6">
              <label htmlFor="sleepTarget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target (hours)
                      </label>
              <div className="mt-1">
                      <input
                        type="number"
                  id="sleepTarget"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={settings.thresholds.sleep.target}
                  min={4}
                  max={12}
                  step={0.5}
                        onChange={(e) => updateSettings('thresholds', { 
                    sleep: { 
                      target: parseFloat(e.target.value) || 0
                    }
                        })}
                      />
              </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Goal for daily sleep duration (recommended: 7-9 hours)
                      </p>
                    </div>
                  </div>
                  
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-500" />
              Temperature Thresholds
            </h2>
                    
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                <label htmlFor="tempMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minimum (°F)
                        </label>
                <div className="mt-1">
                        <input
                          type="number"
                    id="tempMin"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={settings.thresholds.temperature.min}
                    min={95}
                    max={99}
                    step={0.1}
                          onChange={(e) => updateSettings('thresholds', { 
                            temperature: { 
                              ...settings.thresholds.temperature,
                        min: parseFloat(e.target.value) || 0
                            } 
                          })}
                        />
                      </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Alert if temperature drops below this value
                </p>
              </div>
              
                      <div>
                <label htmlFor="tempMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum (°F)
                        </label>
                <div className="mt-1">
                        <input
                          type="number"
                    id="tempMax"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={settings.thresholds.temperature.max}
                    min={97}
                    max={105}
                    step={0.1}
                          onChange={(e) => updateSettings('thresholds', { 
                            temperature: { 
                              ...settings.thresholds.temperature,
                        max: parseFloat(e.target.value) || 0
                            } 
                          })}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Alert if temperature rises above this value
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notification Settings */}
          {activeTab === "notifications" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>
                
          <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                  id="pushNotifications"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={settings.notifications.push}
                        onChange={(e) => updateSettings('notifications', { push: e.target.checked })}
                      />
                    </div>
                    <div className="ml-3">
                <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enable push notifications
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive alerts directly on your device when health metrics need attention
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                  id="emailNotifications"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={settings.notifications.email}
                        onChange={(e) => updateSettings('notifications', { email: e.target.checked })}
                      />
                    </div>
                    <div className="ml-3">
                <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email notifications
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive daily summaries and critical alerts via email
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="criticalOnly"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={settings.notifications.criticalAlertsOnly}
                        onChange={(e) => updateSettings('notifications', { criticalAlertsOnly: e.target.checked })}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="criticalOnly" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Critical alerts only
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only notify about critical health conditions, silence informational alerts
                      </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Privacy Settings */}
          {activeTab === "privacy" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Privacy & Data
                </h2>
                
          <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="shareData"
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        checked={settings.privacy.shareData}
                        onChange={(e) => updateSettings('privacy', { shareData: e.target.checked })}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="shareData" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Share anonymous health data
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                  Help improve health insights by sharing anonymous health information
                      </p>
                    </div>
                  </div>
                  
                  <div>
              <label htmlFor="dataRetention" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data retention period (days)
                    </label>
              <div className="mt-1">
                    <select
                  id="dataRetention"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={settings.privacy.dataRetention}
                  onChange={(e) => updateSettings('privacy', { 
                    dataRetention: parseInt(e.target.value) 
                  })}
                    >
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>180 days</option>
                  <option value={365}>1 year</option>
                  <option value={730}>2 years</option>
                    </select>
              </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                How long to keep detailed health data before summarization
                    </p>
            </div>
                  </div>
                  
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Data Deletion
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    You can delete all your stored health data from our systems.
                    This action cannot be undone.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                  >
                      Delete All My Data
                    </button>
                </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
      {/* Save Button */}
          {unsavedChanges && (
        <div className="fixed bottom-6 right-6">
              <button
                onClick={saveSettings}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
    </>
  );
} 