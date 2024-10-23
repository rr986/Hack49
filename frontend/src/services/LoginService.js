import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { functions, app } from '../firebase';  // Import Firebase Cloud Functions
import { collection, query, where, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Function to sign in a user by calling Firebase Cloud Functions
export const loginUserFn = async (email, password) => {
  try {
    console.log('Sending email and password:', { email, password });

    // Use fetch to send the POST request
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/loginUserFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),  // Send email and password
    });

    // Check the status of the response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error in response:", errorText);
      throw new Error(errorText);
    }

    // Try to parse the response as JSON
    const data = await response.json();
    console.log('Login success:', data);
    return data;  // Return the response data

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Function to log out the user
export const logoutUserFn = async (uid) => {
  try {
    console.log('Logging out user with UID:', uid);

    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/logoutUserFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),  // Send UID in the request body
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    console.log('User logged out');
    return response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Function to retrieve user-details  data after login
export const getUserDetailsFn = async (email, password) => {
  try {
    console.log('Fetching details for email:', email);

    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/getUserDetailsFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),  // Send email and password in the request body
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const data = await response.json();
    console.log('User details:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};
