import React from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { Bell, RefreshCw, Scale, Heart, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { 
    syncFrequency, 
    setSyncFrequency,
    units, 
    setUnits,
    thresholds, 
    setThreshold
  } = useSettingsStore();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="space-y-8">
        {/* Sync Frequency */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <RefreshCw size={24} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Sync Frequency</h2>
              <p className="text-gray-500 mb-4">Control how often your data syncs with your wearable device</p>
              
              <div className="space-y-2">
                <label htmlFor="syncFrequency" className="block text-sm font-medium text-gray-700">
                  Frequency (seconds)
                </label>
                <select
                  id="syncFrequency"
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(Number(e.target.value))}
                  className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5 seconds (Demo)</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                  <option value="900">15 minutes</option>
                  <option value="1800">30 minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Units */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Scale size={24} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Units</h2>
              <p className="text-gray-500 mb-4">Change your preferred measurement units</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Temperature
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="temperatureUnit"
                        checked={units.temperature === 'fahrenheit'}
                        onChange={() => setUnits({ ...units, temperature: 'fahrenheit' })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Fahrenheit (°F)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="temperatureUnit"
                        checked={units.temperature === 'celsius'}
                        onChange={() => setUnits({ ...units, temperature: 'celsius' })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Celsius (°C)</span>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Distance
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="distanceUnit"
                        checked={units.distance === 'miles'}
                        onChange={() => setUnits({ ...units, distance: 'miles' })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Miles (mi)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="distanceUnit"
                        checked={units.distance === 'kilometers'}
                        onChange={() => setUnits({ ...units, distance: 'kilometers' })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Kilometers (km)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Alert Thresholds */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <Bell size={24} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Alert Thresholds</h2>
              <p className="text-gray-500 mb-4">Customize when you receive health alerts</p>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="text-red-500" />
                    <label htmlFor="heartRateMax" className="block text-sm font-medium text-gray-700">
                      Heart Rate (Max)
                    </label>
                  </div>
                  <input
                    id="heartRateMax"
                    type="range"
                    min="100"
                    max="200"
                    step="5"
                    value={thresholds.heartRate.max}
                    onChange={(e) => setThreshold('heartRate', { ...thresholds.heartRate, max: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100 bpm</span>
                    <span className="font-medium text-gray-700">{thresholds.heartRate.max} bpm</span>
                    <span>200 bpm</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-blue-500" />
                    <label htmlFor="bloodOxygenMin" className="block text-sm font-medium text-gray-700">
                      Blood Oxygen (Min)
                    </label>
                  </div>
                  <input
                    id="bloodOxygenMin"
                    type="range"
                    min="85"
                    max="100"
                    step="1"
                    value={thresholds.bloodOxygen.min}
                    onChange={(e) => setThreshold('bloodOxygen', { ...thresholds.bloodOxygen, min: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>85%</span>
                    <span className="font-medium text-gray-700">{thresholds.bloodOxygen.min}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-orange-500" />
                    <label htmlFor="temperatureMax" className="block text-sm font-medium text-gray-700">
                      Temperature (Max °F)
                    </label>
                  </div>
                  <input
                    id="temperatureMax"
                    type="range"
                    min="99"
                    max="104"
                    step="0.1"
                    value={thresholds.temperature.max}
                    onChange={(e) => setThreshold('temperature', { ...thresholds.temperature, max: Number(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>99°F</span>
                    <span className="font-medium text-gray-700">{thresholds.temperature.max}°F</span>
                    <span>104°F</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notification Preferences */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Bell size={24} />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
              <p className="text-gray-500 mb-4">Control how and when you receive notifications</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="alertToggle" className="text-sm font-medium text-gray-700">
                    Health Alerts
                  </label>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input 
                      id="alertToggle" 
                      type="checkbox" 
                      className="absolute w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-[50%] checked:border-blue-600 border-gray-300 top-0 transition-all"
                    />
                    <label 
                      htmlFor="alertToggle" 
                      className="block h-full overflow-hidden rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-100"
                    ></label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="syncToggle" className="text-sm font-medium text-gray-700">
                    Sync Notifications
                  </label>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input 
                      id="syncToggle" 
                      type="checkbox" 
                      className="absolute w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-[50%] checked:border-blue-600 border-gray-300 top-0 transition-all"
                    />
                    <label 
                      htmlFor="syncToggle" 
                      className="block h-full overflow-hidden rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-100"
                    ></label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="goalToggle" className="text-sm font-medium text-gray-700">
                    Goal Reminders
                  </label>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input 
                      id="goalToggle" 
                      type="checkbox" 
                      className="absolute w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-[50%] checked:border-blue-600 border-gray-300 top-0 transition-all"
                    />
                    <label 
                      htmlFor="goalToggle" 
                      className="block h-full overflow-hidden rounded-full bg-gray-300 cursor-pointer peer-checked:bg-blue-100"
                    ></label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;