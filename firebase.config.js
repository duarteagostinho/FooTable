// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// You'll need to replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEJfOfMcYQZ54BnwwK_Kk_1T0jBKCKoo0",
  authDomain: "footable-2025.firebaseapp.com",
  projectId: "footable-2025",
  storageBucket: "footable-2025.firebasestorage.app",
  messagingSenderId: "760639912370",
  appId: "1:760639912370:web:0e40d42298eaf1ce21ccab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
