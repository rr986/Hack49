//probably will not actually use this, you don't need to add functions to login and out or get data
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Function to sign in a user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;  // Return logged-in user
  } catch (error) {
    console.error("Login error", error);
    throw error;
  }
};

// Function to log out the user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Logout error', error);
    throw error;
  }
};

// Function to retrieve user-specific data after login
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);  // Reference to user data in Firestore
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No such user data!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data', error);
    throw error;
  }
};
