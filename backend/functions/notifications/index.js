import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Function to get notifications for a specific user (based on userID)
export const getNotificationsForUser = functions.https.onCall(async (data, context) => {
  const { userID } = data;

  try {
    // Reference to the user's notifications collection
    const notificationsRef = db.collection('notifications').doc(userID);
    const notificationsDoc = await notificationsRef.get();

    if (!notificationsDoc.exists()) {
      throw new functions.https.HttpsError('not-found', 'No notifications found for the user.');
    }

    // Return the notifications data
    const notificationsData = notificationsDoc.data();
    return notificationsData;
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    throw new functions.https.HttpsError('unknown', 'Error retrieving notifications.');
  }
});

// Function to add a notification for a specific patient (patientID)
export const addNotificationForPatient = functions.https.onCall(async (data, context) => {
  const { patientID, notificationData } = data;
  try {
    const notificationRef = doc(db, 'notifications', patientID);
    await setDoc(notificationRef, { Notifications: notificationData }, { merge: true });
    return { success: true, message: 'Notification added successfully' };
  } catch (error) {
    console.error('Error adding notification:', error);
    throw new functions.https.HttpsError('unknown', 'Error adding notification.');
  }
});

