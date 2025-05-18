import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Thresholds {
  warning: { min: number; max: number };
  alert: { min: number; max: number };
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  color: 'red' | 'blue' | 'green' | 'indigo' | 'orange';
  thresholds: Thresholds;
  currentValue: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  color,
  thresholds,
  currentValue
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Determine alert status
  let alertStatus = 'normal';
  
  if (currentValue >= thresholds.alert.min && currentValue <= thresholds.alert.max) {
    alertStatus = 'alert';
  } else if (currentValue >= thresholds.warning.min && currentValue <= thresholds.warning.max) {
    alertStatus = 'warning';
  }
  
  // Color mappings with hover states
  const colorClasses = {
    normal: {
      red: `${isHovered ? 'bg-red-100' : 'bg-red-50'} border-red-100 hover:shadow-lg hover:border-red-200`,
      blue: `${isHovered ? 'bg-blue-100' : 'bg-blue-50'} border-blue-100 hover:shadow-lg hover:border-blue-200`,
      green: `${isHovered ? 'bg-green-100' : 'bg-green-50'} border-green-100 hover:shadow-lg hover:border-green-200`,
      indigo: `${isHovered ? 'bg-indigo-100' : 'bg-indigo-50'} border-indigo-100 hover:shadow-lg hover:border-indigo-200`,
      orange: `${isHovered ? 'bg-orange-100' : 'bg-orange-50'} border-orange-100 hover:shadow-lg hover:border-orange-200`
    },
    warning: {
      red: `${isHovered ? 'bg-yellow-100' : 'bg-yellow-50'} border-yellow-200 hover:shadow-lg`,
      blue: `${isHovered ? 'bg-yellow-100' : 'bg-yellow-50'} border-yellow-200 hover:shadow-lg`,
      green: `${isHovered ? 'bg-yellow-100' : 'bg-yellow-50'} border-yellow-200 hover:shadow-lg`,
      indigo: `${isHovered ? 'bg-yellow-100' : 'bg-yellow-50'} border-yellow-200 hover:shadow-lg`,
      orange: `${isHovered ? 'bg-yellow-100' : 'bg-yellow-50'} border-yellow-200 hover:shadow-lg`
    },
    alert: {
      red: `${isHovered ? 'bg-red-100' : 'bg-red-50'} border-red-200 hover:shadow-lg animate-pulse`,
      blue: `${isHovered ? 'bg-red-100' : 'bg-red-50'} border-red-200 hover:shadow-lg animate-pulse`,
      green: `${isHovered ? 'bg-red-100' : 'bg-red-50'} border-red-200 hover:shadow-lg animate-pulse`,
      indigo: `${isHovered ? 'bg-red-100' : 'bg-red-50'} border-red-200 hover:shadow-lg animate-pulse`,
      orange: `${isHovered ? 'bg-red-100' : 'bg-red-50'} border-red-200 hover:shadow-lg animate-pulse`
    }
  };

  const getStatusIndication = () => {
    if (alertStatus === 'alert') {
      return (
        <div className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          Attention required
        </div>
      );
    } else if (alertStatus === 'warning') {
      return (
        <div className="text-yellow-600 text-xs font-medium mt-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          Monitor closely
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={`rounded-xl p-4 border transition-all duration-300 transform ${colorClasses[alertStatus][color]} ${isHovered ? 'scale-[1.02]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg bg-white shadow-sm transition-transform duration-300 ${isHovered ? 'rotate-6' : ''}`}>
          {icon}
        </div>
        
        <div className="flex items-center space-x-1">
          {change !== 0 && (
            <>
              {change > 0 ? (
                <ArrowUp className={`text-green-500 transition-transform duration-300 ${isHovered ? 'translate-y-[-2px]' : ''}`} size={16} />
              ) : (
                <ArrowDown className={`text-red-500 transition-transform duration-300 ${isHovered ? 'translate-y-[2px]' : ''}`} size={16} />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(change).toFixed(1)}
              </span>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`text-gray-900 text-xl font-bold mt-1 transition-all duration-300 ${isHovered ? 'text-2xl' : ''}`}>
          {value}
        </div>
        {getStatusIndication()}
      </div>
    </div>
  );
};

export default MetricCard;