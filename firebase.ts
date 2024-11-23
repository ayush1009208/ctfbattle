import { initializeApp } from "firebase/app";
import { getAuth,signOut } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firestore
import { getStorage } from "firebase/storage"; // Firebase Storage (optional)

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCZuJjTOd4piX1QuJymegZUDwnvGcd_l7s",
  authDomain: "ctfbattle-9ef92.firebaseapp.com",
  projectId: "ctfbattle-9ef92",
  storageBucket: "ctfbattle-9ef92.firebasestorage.app",
  messagingSenderId: "329720557028",
  appId: "1:329720557028:web:050fa4843c3e855a6eabf1"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore database
const storage = getStorage(app); // Firebase Storage (optional, if you're using file storage)

// Export Firebase services for use in other parts of your app
export { app, auth, db, storage, signOut };
