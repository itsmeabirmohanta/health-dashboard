import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useHealthDataStore } from '../stores/healthDataStore';
import { RefreshCw, Settings, Bell } from 'lucide-react';
import { format } from 'date-fns';

const DashboardHeader: React.FC = () => {
  const { user } = useAuthStore();
  const { syncData, lastSynced } = useHealthDataStore();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const handleSync = async () => {
    setIsRefreshing(true);
    await syncData();
    setTimeout(() => setIsRefreshing(false), 1000);
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-white p-6 rounded-xl shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Health Dashboard
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Live
          </span>
        </h1>
        <p className="text-gray-500 mt-1">
          Hello, {user?.name || 'User'} | {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>
      
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md">
          Last synced: {lastSynced ? format(lastSynced, 'h:mm a') : 'Never'}
        </div>
        
        <button 
          onClick={handleSync}
          className={`flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-all duration-300 ${isRefreshing ? 'scale-95' : ''}`}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
        
        <button className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <a 
          href="/settings" 
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-300 hover:scale-105"
        >
          <Settings size={16} />
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
};

export default DashboardHeader;