// src/services/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVQDgwOv-SAfA79K8rfIOIqqZ07okjsM4",
  authDomain: "no3percent-v2.firebaseapp.com",
  projectId: "no3percent-v2",
  storageBucket: "no3percent-v2.firebasestorage.app",
  messagingSenderId: "719653992888",
  appId: "1:719653992888:web:fd946ba81db08e201f374d",
  measurementId: "G-GG1X2BGB6X"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Initialize Analytics conditionally (only in browser environment)
let analyticsInstance = null;

// Initialize analytics only in browser environments
const initializeAnalytics = async () => {
  try {
    if (await isSupported()) {
      analyticsInstance = getAnalytics(firebaseApp);
    }
  } catch (error) {
    console.error("Analytics initialization failed:", error);
  }
};

// Call initialization if in browser environment
if (typeof window !== 'undefined') {
  initializeAnalytics();
}

export const analytics = analyticsInstance;

export default firebaseApp;