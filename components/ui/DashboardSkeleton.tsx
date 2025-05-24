"use client";

import React from "react";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 w-full">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-4 w-36"></div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-10 w-10 rounded-full"></div>
          <div className="skeleton h-10 w-10 rounded-full"></div>
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="skeleton h-32 w-full rounded-2xl"></div>

      {/* Content grid skeleton */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={`stat-${i}`} className="skeleton h-28 rounded-xl"></div>
            ))}
          </div>

          {/* Main charts/cards */}
          <div className="skeleton h-64 rounded-2xl"></div>
          <div className="skeleton h-56 rounded-2xl"></div>
          <div className="skeleton h-48 rounded-2xl"></div>
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          {/* Sidebar cards skeleton */}
          <div className="skeleton h-40 rounded-2xl"></div>
          <div className="skeleton h-60 rounded-2xl"></div>
          <div className="skeleton h-36 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
} 