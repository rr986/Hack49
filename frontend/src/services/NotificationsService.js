import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../firebase';

// Fetch notifications for a user from Firebase Function
export const getNotificationsForUserFn = async (userID) => {
  try {
    const functions = getFunctions();
    const getUserNotifications = httpsCallable(functions, 'getNotificationsForUserFn');
    const result = await getUserNotifications({ userID });
    return result.data;
  } catch (error) {
    console.error('Error fetching notifications for user', error);
  }
};

// Add a notification for a specific patient using Firebase Functions
export const addNotificationForPatientFn = async (patientID, notificationData) => {
  try {
    const functions = getFunctions();
    const addPatientNotification = httpsCallable(functions, 'addNotificationForPatientFn');
    const result = await addPatientNotification({ patientID, notificationData });
    return result.data;
  } catch (error) {
    console.error('Error adding notification for patient', error);
  }
};
