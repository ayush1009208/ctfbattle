import React, { ReactNode } from 'react';

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  change: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, change }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-gray-400">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;