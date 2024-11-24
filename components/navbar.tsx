"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Swords, Trophy, Users } from "lucide-react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null); // Added userId state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sendUserDetails = async (user: any, userId: number) => {
    const url = "https://106b-119-82-122-154.ngrok-free.app";
    const data = {
      email: user.email,
      name: user.displayName,
      userId: userId.toString(), // Send userId as well
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Failed to send user details:", response.statusText);
      } else {
        console.log("User details sent successfully");
      }
    } catch (err) {
      console.error("Error sending user details:", err);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const generatedUserId = Math.floor(Math.random() * 1000); // Generate random userId
      setUserId(generatedUserId); // Set the generated userId to state
      Cookies.set("userId", generatedUserId.toString(), { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Set expiration in milliseconds
      console.log(user, generatedUserId)
      await saveUserToDB(user, generatedUserId);
      await sendUserDetails(user, generatedUserId); // Send user details including userId
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Google login error:", err.message);
        setError(err.message);
      } else {
        console.error("An unknown error occurred:", err);
        setError("An unknown error occurred");
      }
    }
  };

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const generatedUserId = Math.floor(Math.random() * 1000); // Generate random userId
      setUserId(generatedUserId); // Set the generated userId to state
      Cookies.set("userId", generatedUserId.toString(), { maxAge: 7 * 24 * 60 * 60 * 1000 }); // Set expiration in milliseconds
      // await saveUserToDB(user, generatedUserId);
      await sendUserDetails(user, generatedUserId); // Send user details including userId
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("GitHub login error:", err.message);
        setError(err.message);
      } else {
        console.error("An unknown error occurred:", err);
        setError("An unknown error occurred");
      }
    }
  };

  const saveUserToDB = async (user: any, userId: number) => {
    try {
      const displayName = user.displayName || ""; // Fallback to an empty string if displayName is null or undefined
  
      // Split the display name into first and last name, assuming the format "First Last"
      const [firstName, lastName] = displayName.split(" ");
      
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName || "", // Default to empty string if there's no first name
        lastName: lastName || "", // Default to empty string if there's no last name
        email: user.email,
        userId: userId,
      });
    } catch (err) {
      console.error("Error saving user to Firestore:", err);
    }
  };
  

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserId(null); // Clear the userId on sign out
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      router.push("/dashboard");
    }
  };

  

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Swords className="h-6 w-6" />
          <span className="font-bold text-xl">CtfBattle</span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Link href="/challenges">
            <Button variant="ghost" className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              Challenges
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="ghost" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
          <ModeToggle />

          {user ? (
            <button
              onClick={handleProfileClick}
              className="rounded-full h-8 w-8 flex items-center justify-center cursor-pointer"
            >
              <User className="h-6 w-6 text-gray-800 dark:text-gray-100" />
            </button>
          ) : (
            <Button onClick={handleSignInClick}>Sign In</Button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 transition"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
              Sign Up
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-md py-3 flex items-center justify-center space-x-4 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <IconBrandGoogle />
                <span>Sign up with Google</span>
              </button>
              <button
                onClick={handleGithubLogin}
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-md py-3 flex items-center justify-center space-x-4 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <IconBrandGithub />
                <span>Sign up with GitHub</span>
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
