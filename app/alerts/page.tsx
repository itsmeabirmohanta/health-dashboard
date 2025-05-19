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
  Info
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

export default function AlertsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "critical" | "warning" | "info">("all");
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  
  const { 
    currentMetrics,
    syncMetrics,
    isLoading
  } = useHealthStore(state => ({
    currentMetrics: state.currentMetrics,
    syncMetrics: state.syncMetrics,
    isLoading: state.isLoading
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

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Alerts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage your health notifications and alerts
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <CheckCircle className="w-4 h-4" />
            Mark all read
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <Settings className="w-4 h-4" />
            Alert Settings
          </button>
        </div>
      </div>

      {/* Alert filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <Bell className="w-4 h-4" />
          All Alerts
        </button>
        
        <button
          onClick={() => setActiveFilter("unread")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeFilter === "unread"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <Bell className="w-4 h-4" />
          Unread
          {alerts.filter(a => !a.isRead).length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
              {alerts.filter(a => !a.isRead).length}
            </span>
          )}
        </button>
        
        <button
          onClick={() => setActiveFilter("critical")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeFilter === "critical"
              ? "bg-red-600 text-white dark:bg-red-500 dark:text-white"
              : "bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Critical
        </button>
        
        <button
          onClick={() => setActiveFilter("warning")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeFilter === "warning"
              ? "bg-amber-600 text-white dark:bg-amber-500 dark:text-white"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Warning
        </button>
        
        <button
          onClick={() => setActiveFilter("info")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
            activeFilter === "info"
              ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
          }`}
        >
          <Info className="w-4 h-4" />
          Info
        </button>
      </div>

      {/* Alert List */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map(alert => {
            const style = getAlertStyle(alert.type);
            return (
              <div 
                key={alert.id} 
                className={`border rounded-lg p-4 ${style.bg} ${style.border} ${!alert.isRead ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${style.bg}`}>
                      <alert.icon className={`w-5 h-5 ${style.icon}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${style.text}`}>{alert.metric}</h3>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full uppercase bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {alert.type}
                        </span>
                        {!alert.isRead && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{alert.message}</p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <div>Recorded value: <span className="font-semibold">{alert.value}{alert.unit}</span></div>
                        <div>Threshold: <span className="font-semibold">{alert.threshold}{alert.unit}</span></div>
                        <div>Time: <span className="font-semibold">{formatTime(alert.timestamp)}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!alert.isRead && (
                      <button 
                        onClick={() => markAsRead(alert.id)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
            <Bell className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No alerts found</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
            {activeFilter === "all" 
              ? "You don't have any health alerts at the moment." 
              : `No ${activeFilter} alerts found. Try changing your filter.`}
          </p>
        </div>
      )}
    </>
  );
} 