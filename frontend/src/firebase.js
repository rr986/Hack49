import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBLq3wooKWJr7fsk_GiqDYROOxOy78d6Mw",
  authDomain: "ade-manager.firebaseapp.com",
  projectId: "ade-manager",
  storageBucket: "ade-manager.appspot.com",
  messagingSenderId: "840153785316",
  appId: "1:840153785316:web:350950aefc362b1b929df1",
  measurementId: "G-1YRG7MEH12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);
const auth = getAuth(app);

export { db, functions, app, auth };
