import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Initialize Firestore
const db = getFirestore();

// Initialize Firebase Authentication for Admin SDK
const auth = admin.auth();

export { db, auth };
