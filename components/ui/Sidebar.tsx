"use client";

import React, { useState, useEffect } from "react";
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
  Heart,
  LayoutDashboard,
  BarChart3,
  ListChecks,
  ShieldCheck,
  FileText,
  Calendar,
  MessageSquareText,
  Plus
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  disabled?: boolean;
  badge?: string;
  isSectionTitle?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  onAddDevice?: () => void;
  username?: string;
  isMobile?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/metrics", icon: BarChart3, label: "Detailed Metrics" },
  { href: "/activity-log", icon: ListChecks, label: "Activity Log" }, 
  { href: "/ai-insights", icon: Brain, label: "AI Insights" },
  { isSectionTitle: true, label: "Tools", href:"#", icon: () => null }, 
  { href: "/schedule", icon: Calendar, label: "My Schedule", badge: "New" },
  { href: "/reports", icon: FileText, label: "Reports" },
  { isSectionTitle: true, label: "Support", href:"#", icon: () => null }, 
  { href: "/messages", icon: MessageSquareText, label: "Messages", badge: "3" },
  { href: "/profile", icon: Users, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ collapsed, toggleSidebar, onAddDevice, username = "Demo User", isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Hardcoded value for notification count
  const unreadAlertCount = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by rendering a basic sidebar or nothing on first server render
    return <aside className={cn("h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out", collapsed ? "w-[4.5rem]" : "w-64")} />;
  }

  const isDark = theme === "dark";
  
  // On mobile, use a different approach for the sidebar
  const sidebarClasses = isMobile ? 
    cn(
      "fixed inset-y-0 left-0 z-[100] h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col transition-all duration-200 ease-out transform",
      collapsed ? "-translate-x-full" : "translate-x-0",
      "shadow-xl w-[280px]"
    ) : 
    cn(
      "fixed inset-y-0 left-0 z-50 h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col transition-all duration-300 ease-in-out group",
      collapsed ? "w-[4.5rem]" : "w-64"
    );

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={sidebarClasses}>
        {/* Mobile Overlay - Only visible on mobile when sidebar is open */}
        {isMobile && !collapsed && (
          <div 
            className="fixed inset-0 bg-black/50 z-[99]" 
            onClick={toggleSidebar}
          />
        )}
        
        {/* Logo & Brand Section */}
        <div
          className={cn(
            "flex items-center border-b border-gray-200/50 dark:border-gray-700/50 py-4",
            collapsed && !isMobile ? "h-20 justify-center" : "h-20 px-4 justify-between"
          )}
        >
          {(!collapsed || isMobile) && (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">Fit</span>
                <span className="text-gray-800 dark:text-gray-100">Pulse</span>
              </span>
            </Link>
          )}
          {collapsed && !isMobile && (
            <Link href="/" className="flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </Link>
          )}
          {((!collapsed && !isMobile) || (!collapsed && isMobile)) && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* User Profile Section */}
        {(!collapsed || isMobile) && (
          <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold">
                  DU
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{username}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Health Dashboard</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(!collapsed || isMobile) && (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
            {onAddDevice && (
              <button
                onClick={onAddDevice}
                className="flex items-center justify-center gap-2 py-1.5 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium flex-1 transition-colors touch-target"
              >
                <Plus className="w-4 h-4" />
                <span>Add Device</span>
              </button>
            )}
            
            <Link
              href="/alerts"
              className="relative p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm flex-shrink-0 touch-target"
            >
              <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {unreadAlertCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/settings"
              className="p-2 rounded-lg bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm flex-shrink-0 touch-target"
            >
              <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </Link>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {navItems.map((item) => {
            if (item.isSectionTitle) {
              return collapsed ? (
                <div key={item.label} className="px-3 py-2">
                  <hr className="border-gray-200 dark:border-gray-700" />
                </div>
              ) : (
                <h2
                  key={item.label}
                  className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase"
                >
                  {item.label}
                </h2>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href} disableHoverableContent={!collapsed}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150",
                      isActive
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium shadow-sm border-l-2 border-red-500 dark:border-red-500"
                        : "hover:text-gray-900 dark:hover:text-white",
                      collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-2 mx-1"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "transition-all",
                        collapsed ? "w-5 h-5" : "w-5 h-5 mr-3",
                        isActive ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                      )}
                    />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "ml-auto text-xs px-2 py-0.5 rounded-full font-medium",
                          isActive
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    {item.label}
                    {item.badge && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse Button - Only when sidebar is expanded */}
        {!collapsed && (
          <div className="mt-auto border-t border-gray-200/50 dark:border-gray-700/50 p-2">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center py-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">Collapse Sidebar</span>
            </button>
          </div>
        )}
        
        {/* Collapse button when sidebar is collapsed */}
        {collapsed && (
          <div className="mt-auto border-t border-gray-200/50 dark:border-gray-700/50 p-2">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center h-10 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
} 