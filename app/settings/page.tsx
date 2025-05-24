"use client";

import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Bell, Shield, Smartphone, User, Lock, Palette } from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference
    if (typeof window !== 'undefined') {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  if (!mounted) return null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // This is just a placeholder - in a real app, you would use next-themes or similar
  };

  const sections: SettingSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette className="h-5 w-5 text-purple-500" />,
      children: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Dark Mode</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Toggle between light and dark themes
              </p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="h-5 w-5 text-red-500" />,
      children: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Health Alerts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Receive notifications about important health changes
              </p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                className="sr-only"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <label
                htmlFor="notifications"
                className={`block h-6 w-12 rounded-full cursor-pointer transition-colors ${
                  notifications ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block h-5 w-5 mt-0.5 ml-0.5 rounded-full bg-white shadow transform transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield className="h-5 w-5 text-green-500" />,
      children: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">Data Sharing</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow anonymous data sharing for research and improvement
              </p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                id="dataSharing"
                name="dataSharing"
                className="sr-only"
                checked={dataSharing}
                onChange={() => setDataSharing(!dataSharing)}
              />
              <label
                htmlFor="dataSharing"
                className={`block h-6 w-12 rounded-full cursor-pointer transition-colors ${
                  dataSharing ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`block h-5 w-5 mt-0.5 ml-0.5 rounded-full bg-white shadow transform transition-transform ${
                    dataSharing ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          <div className="pt-2">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'devices',
      title: 'Connected Devices',
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      children: (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-medium">FitPulse Watch SE</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connected • Battery: 85%
                  </p>
                </div>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                Disconnect
              </button>
            </div>
          </div>
          <div className="pt-2 flex justify-center">
            <button className="text-sm text-blue-600 dark:text-blue-400 flex items-center hover:underline">
              <span className="mr-1">+</span> Add New Device
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'account',
      title: 'Account',
      icon: <User className="h-5 w-5 text-amber-500" />,
      children: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
              DU
            </div>
            <div>
              <h3 className="font-medium">Demo User</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                demo@example.com
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button className="text-sm text-left text-slate-700 dark:text-slate-300 hover:underline">
              Edit Profile
            </button>
            <button className="text-sm text-left text-slate-700 dark:text-slate-300 hover:underline">
              Change Password
            </button>
            <button className="text-sm text-left text-red-600 dark:text-red-400 hover:underline">
              Log Out
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your app preferences and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              {section.icon}
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>
            {section.children}
          </div>
        ))}
      </div>
    </div>
  );
} 