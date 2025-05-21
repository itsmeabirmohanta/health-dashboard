"use client";

import React from "react";
import { Settings as SettingsIcon, Bell, Palette, Lock, Shield } from "lucide-react";

export default function SettingsPage() {
  // Mock settings data - in a real app, this would come from a store or API
  const [settings, setSettings] = React.useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    theme: "system", // 'light', 'dark', 'system'
    dataPrivacy: {
      shareData: false,
      dataRetentionPeriod: "365", // days
    },
    account: {
      twoFactorAuth: true,
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        // @ts-ignore
        ...prev[category],
        [key]: value,
      }
    }));
    // Here you would typically save settings to a backend or local storage
    console.log(`Setting changed: ${category}.${key} = ${value}`);
  };
  
  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const sectionClass = "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8";
  const h2Class = "text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2";

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-primary-500" /> Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your application preferences and account settings.</p>
      </header>

      {/* Notification Settings */}
      <section className={sectionClass}>
        <h2 className={h2Class}><Bell className="w-6 h-6 text-blue-500" /> Notification Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Email Notifications</label>
            <input 
              type="checkbox" 
              checked={settings.notifications.email}
              onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
              className="mt-1 rounded text-primary-600 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className={labelClass}>Push Notifications</label>
            <input 
              type="checkbox" 
              checked={settings.notifications.push}
              onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
              className="mt-1 rounded text-primary-600 focus:ring-primary-500"
            />
          </div>
          {/* Add more notification settings as needed */}
        </div>
      </section>

      {/* Appearance Settings */}
      <section className={sectionClass}>
        <h2 className={h2Class}><Palette className="w-6 h-6 text-purple-500" /> Appearance</h2>
        <div>
          <label htmlFor="theme" className={labelClass}>Theme</label>
          <select 
            name="theme" 
            id="theme" 
            value={settings.theme}
            onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)} // 'appearance' category
            className={inputClass}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>
      </section>
      
      {/* Account Security Settings */}
      <section className={sectionClass}>
        <h2 className={h2Class}><Lock className="w-6 h-6 text-red-500" /> Account Security</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Enable Two-Factor Authentication (2FA)</label>
            <input 
              type="checkbox" 
              checked={settings.account.twoFactorAuth}
              onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
              className="mt-1 rounded text-primary-600 focus:ring-primary-500"
            />
          </div>
          <button className="text-sm text-primary-600 hover:underline">Change Password</button>
        </div>
      </section>

      {/* Data Privacy Settings */}
      <section className={sectionClass}>
        <h2 className={h2Class}><Shield className="w-6 h-6 text-green-500" /> Data & Privacy</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Share Anonymous Usage Data</label>
            <input 
              type="checkbox" 
              checked={settings.dataPrivacy.shareData}
              onChange={(e) => handleSettingChange('dataPrivacy', 'shareData', e.target.checked)}
              className="mt-1 rounded text-primary-600 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="dataRetentionPeriod" className={labelClass}>Data Retention Period (days)</label>
            <input 
              type="number"
              name="dataRetentionPeriod"
              id="dataRetentionPeriod"
              value={settings.dataPrivacy.dataRetentionPeriod}
              onChange={(e) => handleSettingChange('dataPrivacy', 'dataRetentionPeriod', e.target.value)}
              className={inputClass}
              placeholder="e.g., 365"
            />
          </div>
          <button className="text-sm text-primary-600 hover:underline">Download My Data</button>
        </div>
      </section>

      <div className="mt-10 flex justify-end">
        <button 
          onClick={() => alert("Settings saved (mock)!")}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md transition-colors duration-150"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
} 