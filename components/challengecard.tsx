import React from 'react';
import { Flag } from 'lucide-react';

interface ChallengeCardProps {
  title: string;
  category: string;
  points: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solves: number;
}

const difficultyColors = {
  Easy: 'bg-green-500/10 text-green-400',
  Medium: 'bg-yellow-500/10 text-yellow-400',
  Hard: 'bg-red-500/10 text-red-400',
};

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  category,
  points,
  difficulty,
  solves,
}) => {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-cyan-400 font-bold">{points} pts</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-sm ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-sm">
          {category}
        </span>
      </div>
      <div className="flex items-center justify-between text-gray-400 text-sm">
        <span className="flex items-center gap-1">
          <Flag className="w-4 h-4" />
          {solves} solves
        </span>
        <button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded transition">
          Solve
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;