"use client";

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

export default function AccessibilityPage() {
  const [textSize, setTextSize] = useState(16);
  const [contrast, setContrast] = useState("Normal");
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [navigationMode, setNavigationMode] = useState("Standard");
  const [readingSpeed, setReadingSpeed] = useState(1);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [enhancedFocus, setEnhancedFocus] = useState(true);

  // Apply text size
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}px`;
    return () => {
      document.documentElement.style.fontSize = '16px';
    };
  }, [textSize]);

  // Apply contrast
  useEffect(() => {
    document.documentElement.classList.remove('high-contrast', 'low-contrast');
    if (contrast !== "Normal") {
      document.documentElement.classList.add(contrast.toLowerCase().replace(' ', '-'));
    }
  }, [contrast]);

  // Apply color blind mode
  useEffect(() => {
    document.documentElement.classList.toggle('color-blind-mode', colorBlindMode);
  }, [colorBlindMode]);

  // Apply reduced animations
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceAnimations);
  }, [reduceAnimations]);

  // Apply enhanced focus
  useEffect(() => {
    document.documentElement.classList.toggle('enhanced-focus', enhancedFocus);
  }, [enhancedFocus]);

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      textSize,
      contrast,
      colorBlindMode,
      screenReader,
      navigationMode,
      readingSpeed,
      reduceAnimations,
      enhancedFocus
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg';
    successMessage.textContent = 'Settings saved successfully';
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Accessibility Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Visual Settings</h2>
          <div className="space-y-6">
            {/* Text Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Size
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Small</span>
                <span>Default</span>
                <span>Large</span>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contrast
              </label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
              >
                <option>Normal</option>
                <option>High Contrast</option>
                <option>Low Contrast</option>
              </select>
            </div>

            {/* Color Blind Mode */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Color Blind Mode
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={colorBlindMode}
                  onChange={(e) => setColorBlindMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Reading & Navigation */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reading & Navigation</h2>
          <div className="space-y-6">
            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Screen Reader Support
              </label>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={screenReader}
                  onChange={(e) => setScreenReader(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </div>
            </div>

            {/* Navigation Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Navigation Mode
              </label>
              <select 
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                value={navigationMode}
                onChange={(e) => setNavigationMode(e.target.value)}
              >
                <option>Standard</option>
                <option>Keyboard Only</option>
                <option>Voice Control</option>
              </select>
            </div>

            {/* Reading Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reading Speed
              </label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.5"
                value={readingSpeed}
                onChange={(e) => setReadingSpeed(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="mt-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Additional Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Animation Control */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduce Animations
            </label>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={reduceAnimations}
                onChange={(e) => setReduceAnimations(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          </div>

          {/* Focus Indicators */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enhanced Focus Indicators
            </label>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={enhancedFocus}
                onChange={(e) => setEnhancedFocus(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button 
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
} 