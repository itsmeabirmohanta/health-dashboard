"use client";

import React from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { cn } from "@/lib/utils";
import { Bell, Search, Plus, User, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const unreadAlertCount = useHealthStore(state => state.unreadAlertCount);

  return (
    <header className={cn(
      "glass sticky top-0 z-30 px-6 h-16 flex items-center justify-between border-b border-white/20 shadow-sm",
      className
    )}>
      {/* Left: Logo & Title (hidden on lg screens as it's in the sidebar) */}
      <div className="flex items-center gap-8 lg:hidden">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">FitPulse</span>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-search pl-10"
            placeholder="Search anything here..."
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="btn-primary flex items-center gap-2 shadow-md hover:shadow-lg">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
        
        {/* Notifications */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-xl bg-white/50 border border-white/20 text-gray-600 hover:bg-white/70 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
            </span>
          )}
        </Link>

        {/* User Menu */}
        <button className="flex items-center gap-3 p-1.5 rounded-xl bg-white/50 border border-white/20 hover:bg-white/70 transition-colors">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-sm">
            <Image
              src="/images/avatar.svg"
              alt="User"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </header>
  );
} 