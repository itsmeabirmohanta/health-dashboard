"use client";

import React, { useState } from "react";
import { User, ArrowRightToLine, Heart, Edit3, Save } from "lucide-react";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  height: string; // cm
  weight: string; // kg
  bloodType: string;
  // Add more fields as needed
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "Demo",
    lastName: "User",
    email: "demo.user@example.com",
    dateOfBirth: "1990-01-01",
    height: "175",
    weight: "70",
    bloodType: "O+",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Profile data saved:", profileData);
    // Here you would typically send data to a backend
    setIsEditing(false);
    alert("Profile updated successfully!"); // Simple feedback
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and health details.</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md transition-colors duration-150"
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </header>

      <div className="space-y-8">
        {/* Personal Information Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-primary-500" /> Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name</label>
              <input type="text" name="firstName" id="firstName" value={profileData.firstName} onChange={handleInputChange} className={inputClass} disabled={!isEditing} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name</label>
              <input type="text" name="lastName" id="lastName" value={profileData.lastName} onChange={handleInputChange} className={inputClass} disabled={!isEditing} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <input type="email" name="email" id="email" value={profileData.email} onChange={handleInputChange} className={inputClass} disabled={!isEditing} />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
              <input type="date" name="dateOfBirth" id="dateOfBirth" value={profileData.dateOfBirth} onChange={handleInputChange} className={inputClass} disabled={!isEditing} />
            </div>
          </div>
        </section>

        {/* Health Details Section */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" /> Health Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="height" className={labelClass}>Height (cm)</label>
              <input type="number" name="height" id="height" value={profileData.height} onChange={handleInputChange} className={inputClass} disabled={!isEditing} placeholder="e.g., 175" />
            </div>
            <div>
              <label htmlFor="weight" className={labelClass}>Weight (kg)</label>
              <input type="number" name="weight" id="weight" value={profileData.weight} onChange={handleInputChange} className={inputClass} disabled={!isEditing} placeholder="e.g., 70" />
            </div>
            <div>
              <label htmlFor="bloodType" className={labelClass}>Blood Type</label>
              <select name="bloodType" id="bloodType" value={profileData.bloodType} onChange={handleInputChange} className={inputClass} disabled={!isEditing}>
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </section>

        {/* Preferences Section - Can be expanded */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <ArrowRightToLine className="w-6 h-6 text-green-500" /> Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preferences settings will be managed in the main Settings page. 
            <a href="/settings" className="text-primary-500 hover:underline ml-1">Go to Settings</a>
          </p>
          {/* Example: Preferred units (metric/imperial) - this might live in general settings */}
        </section>

        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-md transition-colors duration-150"
            >
              <Save className="w-5 h-5" /> Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 