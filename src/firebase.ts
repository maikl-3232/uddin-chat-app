// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Ganti dengan firebaseConfig milikmu dari console Firebase tadi
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "chat-dua-orang.firebaseapp.com",
  projectId: "chat-dua-orang",
  storageBucket: "chat-dua-orang.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:12345:web:abcde"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);