// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4UBkiMrsCKFd24J9So90hFgHQjzSwEws",
  authDomain: "ingos-firebase-demo.firebaseapp.com",
  // ... other config values
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 
