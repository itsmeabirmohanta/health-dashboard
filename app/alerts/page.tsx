"use client";

import { useState, useEffect } from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { 
  Heart, 
  Droplets,
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Info,
  AlertCircle,
  Check,
  ChevronRight
} from "lucide-react";

interface HealthAlert {
  id: string;
  type: "warning" | "critical" | "info";
  metric: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  value: number | string;
  threshold: number | string;
  unit?: string;
  icon: React.ElementType;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'danger';
  timestamp: Date;
  read: boolean;
}

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "critical" | "warning" | "info">("all");
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [mounted, setMounted] = useState(false);
  
  const { 
    currentMetrics,
    syncMetrics
  } = useHealthStore(state => ({
    currentMetrics: state.currentMetrics,
    syncMetrics: state.syncMetrics
  }));

  // Generate mock alerts
  useEffect(() => {
    const mockAlerts: HealthAlert[] = [
      {
        id: "alert-1",
        type: "critical",
        metric: "Heart Rate",
        message: "Heart rate too high (120 bpm) during rest period",
        timestamp: "2023-11-02T08:30:00",
        isRead: false,
        value: 120,
        threshold: 100,
        unit: "bpm",
        icon: Heart
      },
      {
        id: "alert-2",
        type: "warning",
        metric: "Blood Oxygen",
        message: "Blood oxygen level dropped below 92%",
        timestamp: "2023-11-02T02:15:00",
        isRead: false,
        value: 91,
        threshold: 92,
        unit: "%",
        icon: Droplets
      },
      {
        id: "alert-3",
        type: "info",
        metric: "Steps",
        message: "Daily step goal achieved! Great job!",
        timestamp: "2023-11-01T19:45:00",
        isRead: true,
        value: 10500,
        threshold: 10000,
        unit: "",
        icon: CheckCircle
      },
      {
        id: "alert-4",
        type: "warning",
        metric: "Sleep",
        message: "Sleep duration below recommended (5.5 hrs)",
        timestamp: "2023-11-01T08:00:00",
        isRead: true,
        value: 5.5,
        threshold: 7,
        unit: "h",
        icon: AlertTriangle
      },
      {
        id: "alert-5",
        type: "critical",
        metric: "Heart Rate",
        message: "Irregular heart rhythm detected",
        timestamp: "2023-10-31T14:20:00",
        isRead: true,
        value: "Irregular",
        threshold: "Regular",
        icon: Heart
      },
    ];

    setAlerts(mockAlerts);
    syncMetrics();
  }, [syncMetrics]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter alerts based on active filter
  const getFilteredAlerts = () => {
    if (activeFilter === "all") return alerts;
    if (activeFilter === "unread") return alerts.filter(alert => !alert.isRead);
    return alerts.filter(alert => alert.type === activeFilter);
  };

  const filteredAlerts = getFilteredAlerts();
  
  // Mark alert as read
  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };
  
  // Mark all alerts as read
  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, isRead: true })));
  };
  
  // Delete an alert
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Get alert style based on type
  const getAlertStyle = (type: "warning" | "critical" | "info") => {
    switch (type) {
      case "critical":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-700 dark:text-red-300",
          icon: "text-red-500 dark:text-red-400"
        };
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-900/20",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-700 dark:text-amber-300",
          icon: "text-amber-500 dark:text-amber-400"
        };
      case "info":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-700 dark:text-blue-300",
          icon: "text-blue-500 dark:text-blue-400"
        };
    }
  };

  // Format timestamp to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!mounted) return null;

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400">
            View and manage your health alerts
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">
            {unreadCount} unread
          </span>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
              No alerts
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              You don't have any alerts at the moment
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {alerts.map((alert) => {
              const colors = getAlertStyle(alert.type);
              return (
                <div 
                  key={alert.id} 
                  className={`p-4 md:px-6 flex items-start ${!alert.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center mr-4`}>
                    <AlertCircle className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${colors.text} ${!alert.isRead ? 'font-semibold' : ''}`}>
                        {alert.metric}
                      </h3>
                      <span className="text-xs text-slate-500 ml-2">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      {alert.message}
                    </p>
                    
                    <div className="mt-2 flex items-center">
                      <button 
                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 mr-4 flex items-center"
                        onClick={() => markAsRead(alert.id)}
                      >
                        {!alert.isRead ? (
                          <>
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Mark as read
                          </>
                        ) : (
                          'View details'
                        )}
                      </button>
                      <span className="text-sm text-slate-500">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 