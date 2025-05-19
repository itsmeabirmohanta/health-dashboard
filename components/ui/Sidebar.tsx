"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  AreaChart,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  Menu,
  X,
  Brain,
  Users,
  UserCheck,
  LineChart,
  Wifi,
  Languages,
  HeartPulse,
  Heart
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Metrics",
      href: "/metrics",
      icon: Activity,
    },
    {
      name: "AI Insights",
      href: "/ai-insights",
      icon: Brain,
      isNew: true
    },
    {
      name: "Doctor Mode",
      href: "/doctor",
      icon: Users,
      isNew: true
    },
    {
      name: "Guardian Mode",
      href: "/guardian",
      icon: UserCheck,
      isNew: true
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: AreaChart,
    },
    {
      name: "Health Trends",
      href: "/trends",
      icon: LineChart,
    },
    {
      name: "Real-Time",
      href: "/real-time",
      icon: Wifi,
    },
    {
      name: "FHIR/HL7",
      href: "/standards",
      icon: HeartPulse,
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: Bell,
    },
    {
      name: "Accessibility",
      href: "/accessibility",
      icon: Languages,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass text-gray-700 lg:hidden shadow-md"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full glass border-r border-white/20 transition-all duration-300 z-40 flex flex-col",
          collapsed ? "w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo and collapse button */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/20 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <Heart size={16} className="text-white" />
              </div>
              {!collapsed && (
                <span className="ml-3 font-semibold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
                  FitPulse
                </span>
              )}
            </div>
            <button
              className="hidden lg:block p-1.5 rounded-xl text-gray-600 hover:bg-white/50 transition-colors"
              onClick={toggleSidebar}
            >
              {collapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow py-4 overflow-y-auto scrollbar-hidden">
            <ul className="space-y-1 px-3">
              {navItems.map((item, index) => (
                <React.Fragment key={item.href}>
                  {/* Add section dividers */}
                  {index === 2 && !collapsed && (
                    <li className="px-3 py-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        AI & Monitoring
                      </div>
                    </li>
                  )}
                  {index === 5 && !collapsed && (
                    <li className="px-3 py-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Analysis & Data
                      </div>
                    </li>
                  )}
                  {index === 9 && !collapsed && (
                    <li className="px-3 py-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        System
                      </div>
                    </li>
                  )}
                  
                  <li>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all relative",
                        pathname === item.href
                          ? "bg-white/50 text-red-500 shadow-sm"
                          : "text-gray-700 hover:bg-white/30"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-xl",
                        pathname === item.href 
                          ? "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md" 
                          : "bg-white/50 text-gray-600"
                      )}>
                        <item.icon size={collapsed ? 16 : 16} />
                      </div>
                      {!collapsed && (
                        <div className="ml-3 flex items-center">
                          <span>{item.name}</span>
                          {item.isNew && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      )}
                      {collapsed && item.isNew && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </Link>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-white/20">
            <div className={cn(
              "flex items-center p-2 rounded-xl",
              collapsed ? "justify-center" : "bg-white/30"
            )}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center overflow-hidden shadow-md">
                {/* Placeholder avatar */}
                <span className="font-medium text-white">
                  U
                </span>
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    User
                  </p>
                  <p className="text-xs text-gray-500">
                    View Profile
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 