'use client';

import { useEffect, useState } from 'react';
import { auth, signOut } from '@/firebase'; // Ensure Firebase is correctly configured
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    const [user, setUser] = useState<any>(null); // Store the authenticated user
    const [theme, setTheme] = useState('light'); // State to store the current theme
    const router = useRouter();
  
    // Monitor authentication state
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          router.push('/login'); // Redirect to login if no user is authenticated
        }
      });
  
      return () => unsubscribe(); // Cleanup on component unmount
    }, [router]);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      setUser(null); // Clear the user state
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the theme to localStorage
  };

  // Set theme on initial load based on localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);


  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 py-6 px-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            <span className="text-purple-500">CtfBattle</span> Dashboard
          </h1>
          <div>
            {user ? (
              <Button
                onClick={handleLogout}
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-lg text-white"
              >
                Logout
              </Button>
            ) : (
              <Button onClick={() => router.push('/login')}>Login</Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Box 1: Profile */}
          <div className="col-span-4 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            {user ? (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-purple-400">Name:</span> {user.displayName || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-purple-400">Email:</span> {user.email}
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Sign in to view your profile</p>
            )}
          </div>

          {/* Box 2: Challenges */}
          <div className="col-span-8 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Challenges</h2>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="font-semibold text-purple-400">Completed:</span> 5
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-purple-400">Active Challenges:</span> 2
              </p>
              <p className="text-gray-300">
                <span className="font-semibold text-purple-400">Upcoming:</span> 3
              </p>
            </div>
          </div>

          {/* Box 3: Leaderboard */}
          <div className="col-span-6 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>1. Player One</span>
                <span className="text-purple-400">1000 pts</span>
              </div>
              <div className="flex justify-between">
                <span>2. Player Two</span>
                <span className="text-purple-400">950 pts</span>
              </div>
              <div className="flex justify-between">
                <span>3. Player Three</span>
                <span className="text-purple-400">900 pts</span>
              </div>
            </div>
          </div>

          {/* Box 4: Progress */}
          <div className="col-span-6 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Progress</h2>
            {user ? (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-purple-400">Rank:</span> 5th
                </p>
                <p>
                  <span className="font-semibold text-purple-400">Streak:</span> 3 days
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Sign in to view your progress</p>
            )}
          </div>

          {/* Box 5: Notifications */}
          <div className="col-span-8 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <ul className="space-y-2 text-sm">
              <li className="bg-gray-700 p-2 rounded-md">📣 Challenge 3 is now live!</li>
              <li className="bg-gray-700 p-2 rounded-md">💡 Reminder: Leaderboard updates daily.</li>
              <li className="bg-gray-700 p-2 rounded-md">🎉 New event starting soon!</li>
            </ul>
          </div>

          {/* Box 6: Announcements */}
          <div className="col-span-4 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Announcements</h2>
            <p className="text-gray-300">Stay tuned for upcoming features and challenges!</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CtfBattle. All rights reserved.
      </footer>
    </div>
  );
}
