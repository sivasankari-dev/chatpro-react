// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// import { getStorage } from "firebase/storage";

// Your Firebase configuration (copied from console)
const firebaseConfig = {
  apiKey: "AIzaSyD7X5MPJLTn20U3FlJP6Sfape0TQdGH8Ew",
  authDomain: "chatprodb.firebaseapp.com",
  projectId: "chatprodb",
  storageBucket: "chatprodb.firebasestorage.app",
  messagingSenderId: "834017235886",
  appId: "1:834017235886:web:f38e61c20476211222ee3f"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export the services you’ll use
export const db = getFirestore(app);   // Firestore database
export const auth = getAuth(app);      // Authentication
export const googleProvider = new GoogleAuthProvider();
// export const storage = getStorage(app); // File uploads
