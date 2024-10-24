import { getFunctions } from 'firebase/functions';
import { db } from '../firebase';

// Fetch notifications for a user from Firebase Function
export const getNotificationsForUserFn = async (userID) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/getNotificationsForUserFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),  // Pass the userID in the request body
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching notifications for user', error);
    throw error;
  }
};

// Add a notification for a specific patient
export const addNotificationForPatientFn = async (patientID, notificationData) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/addNotificationForPatientFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientID, notificationData }),  // Pass the patientID and notificationData
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding notification for patient', error);
    throw error;
  }
};
