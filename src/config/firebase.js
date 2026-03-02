import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBooiN202B0bRtfu-ScFYy8q6PDtOJBBmU",
  authDomain: "victory-road-wiki.firebaseapp.com",
  projectId: "victory-road-wiki",
  storageBucket: "victory-road-wiki.firebasestorage.app",
  messagingSenderId: "108433800055",
  appId: "1:108433800055:web:00133b0f95beecbd36ff72"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
