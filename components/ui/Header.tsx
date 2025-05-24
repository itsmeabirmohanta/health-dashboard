"use client";

import React from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { cn } from "@/lib/utils";
import { Bell, Search, Plus, User, Heart, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  className?: string;
  onAddDevice?: () => void;
  username?: string;
}

export function Header({ className, onAddDevice, username = "Demo User" }: HeaderProps) {
  // Hardcoded value instead of using the store
  const unreadAlertCount = 3;

  return (
    <header className={cn(
      "sticky top-0 z-30 px-6 py-4 mb-6 flex items-center justify-between",
      "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md",
      "border-b border-gray-100/50 dark:border-gray-700/50",
      "transition-all duration-200",
      className
    )}>
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-4 lg:gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">Fit</span>
            <span className="text-gray-800 dark:text-gray-100">Pulse</span>
          </span>
        </Link>
        
        {/* Dashboard Title - Moved from page */}
        <div className="hidden md:block border-l border-gray-200/50 dark:border-gray-700/50 pl-4 ml-2">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Health Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, {username}!</p>
        </div>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center gap-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-lg shadow-sm hover:shadow"
          onClick={onAddDevice}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Add Device</span>
        </button>
        
        <button className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
        
        <Link
          href="/alerts"
          className="relative p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
            </span>
          )}
        </Link>
        
        <button className="flex items-center gap-3 p-1 rounded-full overflow-hidden bg-red-500 hover:bg-red-600 transition-colors shadow-sm">
          <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold">
            DU
          </div>
        </button>
      </div>
    </header>
  );
} 