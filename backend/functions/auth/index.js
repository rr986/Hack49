import * as functions from 'firebase-functions';  // Import Firebase Functions
import { db, auth } from '../utils/db.js';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Fct to login
export const loginUser = functions.https.onRequest(async (req, res) => {
  console.log("Received data:", req.body);

  if (!req.body) {
    console.error('No data received in function.');
    return res.status(400).send('No data received.');
  }

  const { email, password } = req.body;

  // Log email and password to check if they're received correctly
  console.log('Email:', email);
  console.log('Password:', password);

  // Validate email and password
  if (!email || !password) {
    console.error('Email or password is undefined.');
    return res.status(400).send('Email and password must be provided.');
  }

  try {
    // Fetch the user document from Firestore based on the email
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.where('email', '==', email).where('password', '==', password).get();

    if (userSnapshot.empty) {
      // No matching user found
      console.error('No matching user found in Firestore.');
      return res.status(404).send('User not found or incorrect credentials.');
    }

    // Assuming only one user document matches
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Return the user data
    return res.status(200).send({ user: userData });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).send(error.message);
  }
});



//logout
export const logoutUser = functions.https.onRequest(async (req, res) => {
  try {
    const uid = req.body.uid;

    if (!uid) {
      return res.status(401).send('User UID is not provided.');
    }

    // Revoke user's refresh tokens to force re-authentication
    await auth.revokeRefreshTokens(uid);

    console.log(`User with UID ${uid} logged out`);
    return res.status(200).send({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).send('Error logging out.');
  }
});

// Function to retrieve user-specific data from Firestore after login
export const getUserDetails = functions.https.onRequest(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).send('Email and password must be provided.');
  }

  try {
    // Query Firestore to find the user
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

    if (!querySnapshot.empty) {
      // User found
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      return res.status(200).send({ userID: userDoc.id, ...userData });
    } else {
      return res.status(404).send('Invalid email or password.');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).send('Failed to fetch user details.');
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