//probably will not actually use this, you don't need to add functions to login and out or get data
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';  // Import Firebase Cloud Functions

// Function to sign in a user by calling Firebase Cloud Functions
export const loginUserFn = async (email, password) => {
  try {
    // Call the login function defined in your Firebase Functions
    const login = httpsCallable(functions, 'loginUserFn');
    const result = await login({ email, password });
    return result.data;  // Return logged-in user details from Firebase Functions
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Function to log out the user
export const logoutUserFn = async () => {
  try {
    const logout = httpsCallable(functions, 'logoutUserFn');
    await logout();
    console.log('User logged out');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Function to retrieve user-details  data after login
export const getUserDetailsFn = async (email, password) => {
  try {
    // Use Firebase Cloud Functions to fetch the user's details
    const getUserDetails = httpsCallable(functions, 'getUserDetailsFn');
    const result = await getUserDetails({ email, password });
    return result.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};