import * as functions from 'firebase-functions';  // Import Firebase Functions
import { db } from '../utils/db.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase-admin/firestore';

// Fct to login
export const loginUser = functions.https.onCall(async (data, context) => {
  const { email, password } = data;

  // Log email and password to check if they're received correctly
  console.log('Email:', email);
  console.log('Password:', password);

  try {
    // Search the Firestore users collection where the email and password match
    const usersRef = db.collection('users');
    const q = usersRef.where('email', '==', email).where('password', '==', password);
    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
      // User found, proceed with Firebase Authentication
      const userDoc = querySnapshot.docs[0];
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } else {
      console.error("No matching user found in Firestore.");
      throw new functions.https.HttpsError('not-found', 'User not found or incorrect password.');
    }
  } catch (error) {
    console.error("Log-in Error:", error);
    throw new functions.https.HttpsError('unknown', error.message);
  }
});


//logout
export const logoutUser = functions.https.onCall(async (data, context) => {
  try {
    await signOut(auth);
    console.log('User logged out');
    return { success: true, message: 'User logged out successfully' };
  } catch (error) {
    console.error('Logout error:', error);
    throw new functions.https.HttpsError('unknown', 'Error logging out.');
  }
});

// Function to retrieve user-specific data from Firestore after login
export const getUserDetails = functions.https.onCall(async (data, context) => {
  const { email, password } = data;
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).where('password', '==', password).get();

    if (snapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'Invalid credentials.');
    }

    // Assuming only one document should match
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    return { userID: userDoc.id, ...userData };
  } catch (error) {
    console.error('Error logging in:', error);
    throw new functions.https.HttpsError('unknown', 'Login failed.');
  }
});

/*
//not used
// Function to register a new user
export const registerUser = async (email, password, additionalData) => {
  try {
    // Create a new user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a Firestore document for the user
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email,
      patients: [],  // Initially no patients
      ...additionalData,  // Add any other additional data fields
    });

    return user;  // Return the registered user object
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};
*/