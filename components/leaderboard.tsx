import React from 'react';
import { Trophy } from 'lucide-react';

interface LeaderboardCardProps {
  rank: number;
  username: string;
  points: number;
  solved: number;
  isUser?: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  rank,
  username,
  points,
  solved,
  isUser = false,
}) => {
  const rankColors = {
    1: 'text-yellow-400',
    2: 'text-gray-400',
    3: 'text-amber-600',
  };

  return (
    <div className={`p-4 rounded-lg ${isUser ? 'bg-cyan-500/10 border border-cyan-500/50' : 'bg-gray-700/50 border border-gray-600'}`}>
      <div className="flex items-center gap-4">
        <div className={`text-xl font-bold ${rankColors[rank as keyof typeof rankColors] || 'text-white'}`}>
          #{rank}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isUser ? 'text-cyan-400' : 'text-white'}`}>
              {username}
            </span>
            {rank <= 3 && <Trophy className={`w-4 h-4 ${rankColors[rank as keyof typeof rankColors]}`} />}
          </div>
          <div className="text-sm text-gray-400">
            {points} points · {solved} flags
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;