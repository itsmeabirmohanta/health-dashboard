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
  MessageSquareText
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

export function Sidebar({ collapsed, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by rendering a basic sidebar or nothing on first server render
    return <aside className={cn("h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out", collapsed ? "w-[4.5rem]" : "w-64")} />;
  }

  const isDark = theme === "dark";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out group",
          collapsed ? "w-[4.5rem]" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-gray-200 dark:border-gray-700",
            collapsed ? "h-[60px] justify-center" : "h-[60px] px-6 justify-between"
          )}
        >
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-red-500" />
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                HealthIO
              </span>
            </Link>
          )}
          {collapsed && (
             <Link href="/" className="flex items-center justify-center">
                <Heart className="w-7 h-7 text-red-500" />
            </Link>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
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
                      "flex items-center mx-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150",
                      isActive
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium shadow-sm border-l-4 border-red-500 dark:border-red-500"
                        : "hover:text-gray-900 dark:hover:text-white",
                      collapsed ? "justify-center h-11 w-11" : "px-3 py-2.5 h-11"
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
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <div className="mt-auto border-t border-gray-200 dark:border-gray-700 p-2">
          <button
            onClick={toggleSidebar} // Use prop
            className={cn(
              "w-full flex items-center justify-center h-10 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors",
              collapsed ? "px-2" : "px-3"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5 mr-2" />
            )}
            {!collapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  );
} 