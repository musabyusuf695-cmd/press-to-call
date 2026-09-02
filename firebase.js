// Firebase SDK imports
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// Your Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDEJv47nDpckV_pOu1roa1dAyEoMCCQU5A",

  authDomain: "press-to-call.firebaseapp.com",

  projectId: "press-to-call",

  storageBucket: "press-to-call.firebasestorage.app",

  messagingSenderId: "1067913620438",

  appId: "1:1067913620438:web:2576355fbd191e17aa1277"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);


// Initialize Firestore

const db = getFirestore(app);


// Export Firebase tools for other files

export {
  db,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
};