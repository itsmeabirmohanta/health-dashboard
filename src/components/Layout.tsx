import React, { ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Activity, Home, Settings, LogOut } from 'lucide-react';
import { Link } from './Router';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuthStore();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Activity size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Health Sync</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300"
              activeClassName="bg-blue-50 text-blue-700"
            >
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300"
              activeClassName="bg-blue-50 text-blue-700"
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-medium text-gray-800">{user?.name || user?.email || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email || ''}</div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex w-full items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
          >
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Activity size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">Health Sync</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/settings" 
            className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-all duration-300"
            activeClassName="text-blue-700"
          >
            <Settings size={20} />
          </Link>
          
          <button 
            onClick={logout}
            className="p-1.5 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex items-center justify-around">
            <Link 
              to="/" 
              className="flex flex-col items-center py-3 text-gray-500 transition-all duration-300"
              activeClassName="text-blue-600"
            >
              <Home size={20} />
              <span className="text-xs mt-1">Home</span>
            </Link>
            
            <Link 
              to="/settings" 
              className="flex flex-col items-center py-3 text-gray-500 transition-all duration-300"
              activeClassName="text-blue-600"
            >
              <Settings size={20} />
              <span className="text-xs mt-1">Settings</span>
            </Link>
          </div>
        </div>
        
        {/* Content with padding for mobile navigation */}
        <div className="md:pb-0 pb-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;