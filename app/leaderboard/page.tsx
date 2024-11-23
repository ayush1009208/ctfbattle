'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

const leaderboardData = [
  {
    rank: 1,
    username: 'CyberNinja',
    points: 2500,
    challenges: 15,
    badges: ['Web Master', 'Crypto King'],
  },
  {
    rank: 2,
    username: 'HackMaster42',
    points: 2300,
    challenges: 14,
    badges: ['Binary Beast'],
  },
  {
    rank: 3,
    username: 'ByteWarrior',
    points: 2100,
    challenges: 13,
    badges: ['Network Ninja'],
  },
  // Add more users as needed
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return <span className="text-lg font-bold">{rank}</span>;
  }
};

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto px-16 py-8">
      <h1 className="text-4xl font-bold mb-8">Global Leaderboard</h1>
      
      <div className="space-y-4">
        {leaderboardData.map((user) => (
          <Card key={user.rank} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  {getRankIcon(user.rank)}
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold">{user.username}</h3>
                  <div className="flex gap-2 mt-1">
                    {user.badges.map((badge) => (
                      <Badge key={badge} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">{user.points} pts</div>
                <div className="text-sm text-muted-foreground">
                  {user.challenges} challenges completed
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}