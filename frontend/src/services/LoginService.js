import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { functions, app } from '../firebase';
import { collection, query, where, doc, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';

export const loginUserFn = async (email, password) => {
  try {
    console.log('Sending email and password:', { email, password });

    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/loginUserFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error in response:", errorText);
      throw new Error(errorText);
    }

    const data = await response.json();
    console.log('Login success:', data);
    return data;  // Return the response data

  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUserFn = async (uid) => {
  try {
    console.log('Logging out user with UID:', uid);

    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/logoutUserFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
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

export const getUserDetailsFn = async (email, password) => {
  try {
    console.log('Fetching details for email:', email);

    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/getUserDetailsFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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
