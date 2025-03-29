// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4UBkiMrsCKFd24J9So90hFgHQjzSwEws",
  authDomain: "ingos-firebase-demo.firebaseapp.com",
  // ... rest of the config from Firebase console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
