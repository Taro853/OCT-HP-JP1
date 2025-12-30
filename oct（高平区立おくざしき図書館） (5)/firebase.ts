
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Fix: Named import from firebase/firestore for modular SDK
import { getFirestore } from "firebase/firestore";

// ユーザー提供のFirebase構成
const firebaseConfig = {
  apiKey: "AIzaSyDLeYuQEoAkACjAUtl7Yl2to7EPbNmCwi0",
  authDomain: "oct-hp.firebaseapp.com",
  projectId: "oct-hp",
  storageBucket: "oct-hp.firebasestorage.app",
  messagingSenderId: "311607769750",
  appId: "1:311607769750:web:10860ce0a04e2c061060b7",
  measurementId: "G-DEXS3BBN5W"
};

let app;
let db;
let analytics;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  try {
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firestore could not be initialized:", err);
  }

  // Safely initialize analytics
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.debug("Analytics initialization skipped:", e);
  }
} catch (error) {
  console.error("Firebase App initialization failed:", error);
  // db remains undefined, enabling local fallback in App.tsx
}

export { db, app, analytics };
