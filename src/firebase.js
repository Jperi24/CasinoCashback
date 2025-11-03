import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug: Check if environment variables are loaded
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  console.error('❌ Firebase API Key is missing!');
  console.error('Make sure you have a .env file in the root directory with REACT_APP_FIREBASE_API_KEY');
}

// Debug: Log config (without sensitive data in production)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Firebase Config Check:');
  console.log('API Key exists:', !!firebaseConfig.apiKey);
  console.log('Auth Domain:', firebaseConfig.authDomain);
  console.log('Project ID:', firebaseConfig.projectId);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
