"use client"
import React, { useEffect, useState } from 'react';
import { Trophy, Flag, Users, Target, Timer, Shield, Swords, Crown, Brain } from 'lucide-react';
import LeaderboardCard from '@/components/leaderboard';
import ChallengeCard from '@/components/challengecard';
import StatsCard from '@/components/statscard';
import { auth, onAuthStateChanged } from '@/firebase'; 
import { signOut } from 'firebase/auth'; // Import signOut from Firebase
import { useRouter } from 'next/navigation';

function App() {
  const [user, setUser] = useState<any>(null); // Store the authenticated user
  const router = useRouter();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user when authenticated
      } else {
        router.push('/login'); // Redirect to login if no user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [router]);

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login after sign-out
    } catch (error) {
      console.error('Sign-out error', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 py-6 px-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-500">CtfBattle Dashboard</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                  <span className="text-sm font-bold">{user.displayName?.charAt(0)}</span>
                </div>
                <div className="text-white">
                  <p className="font-medium">{user.displayName}</p>
                  <p className="text-sm">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Trophy className="w-6 h-6 text-yellow-400" />}
            title="Your Rank"
            value="#4"
            change="+2"
          />
          <StatsCard
            icon={<Flag className="w-6 h-6 text-green-400" />}
            title="Flags Captured"
            value="12/25"
            change="+3"
          />
          <StatsCard
            icon={<Users className="w-6 h-6 text-blue-400" />}
            title="Active Players"
            value="156"
            change="+24"
          />
          <StatsCard
            icon={<Target className="w-6 h-6 text-red-400" />}
            title="Points"
            value="3,450"
            change="+750"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Challenges */}
            <section className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Active Challenges
                </h2>
                <div className="flex gap-2">
                  <select className="bg-gray-700 rounded-lg px-3 py-1 text-sm">
                    <option>All Categories</option>
                    <option>Web</option>
                    <option>Crypto</option>
                    <option>Forensics</option>
                    <option>Pwn</option>
                  </select>
                  <select className="bg-gray-700 rounded-lg px-3 py-1 text-sm">
                    <option>All Difficulties</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <ChallengeCard
                  title="Web Injection"
                  category="Web"
                  points={250}
                  difficulty="Medium"
                  solves={23}
                />
                <ChallengeCard
                  title="Broken Cipher"
                  category="Crypto"
                  points={500}
                  difficulty="Hard"
                  solves={7}
                />
                <ChallengeCard
                  title="Memory Leak"
                  category="Forensics"
                  points={150}
                  difficulty="Easy"
                  solves={45}
                />
                <ChallengeCard
                  title="Buffer Overflow"
                  category="Pwn"
                  points={400}
                  difficulty="Hard"
                  solves={12}
                />
              </div>
            </section>

            {/* Recent Activity */}
            <section className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <span className="text-sm font-bold">JD</span>
                      </div>
                      <div>
                        <p className="font-medium">John Doe captured Web Injection</p>
                        <p className="text-sm text-gray-400">2 minutes ago</p>
                      </div>
                    </div>
                    <span className="text-green-400 font-medium">+250 pts</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <section className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                Leaderboard
              </h2>
              <div className="space-y-4">
                <LeaderboardCard
                  rank={1}
                  username="h4ck3r_supreme"
                  points={5250}
                  solved={18}
                />
                <LeaderboardCard
                  rank={2}
                  username="binary_ninja"
                  points={4800}
                  solved={16}
                />
                <LeaderboardCard
                  rank={3}
                  username="cyber_phoenix"
                  points={4500}
                  solved={15}
                />
                <LeaderboardCard
                  rank={4}
                  username="you"
                  points={3450}
                  solved={12}
                  isUser
                />
                <LeaderboardCard
                  rank={5}
                  username="code_warrior"
                  points={3200}
                  solved={11}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
