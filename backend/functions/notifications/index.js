import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';
import { doc, setDoc } from 'firebase/firestore';  // Add this line if it's missing

// Function to retrieve notifications for a specific patient (patientID)
export const getNotificationsForUser = functions.https.onRequest(async (req, res) => {
  console.log("Request received:", req.body);

  const { userID } = req.body;


  if (!userID) {
    console.error('No userID provided.');
    return res.status(400).send('userID must be provided.');
  }

  try {
    console.log('Looking for notifications for user:', userID);


    const notificationsRef = db.collection('notifications').doc(userID);
    const notificationsDoc = await notificationsRef.get();


    if (!notificationsDoc.exists) {
      console.error('No notifications found for user:', userID);
      return res.status(404).send('No notifications found for the user.');
    }


    const notificationsData = notificationsDoc.data();
    console.log('Notifications data:', notificationsData);


    return res.status(200).send(notificationsData);
  } catch (error) {

    console.error('Error retrieving notifications:', error);
    return res.status(500).send('Error retrieving notifications.');
  }
});

// Function to add a notification for a specific patient (patientID)
export const addNotificationForPatient = functions.https.onRequest(async (req, res) => {
  console.log("Received request body:", req.body);

  const { patientID, notificationData } = req.body;

  try {
    if (!patientID || !notificationData) {
      console.error('Missing patientID or notificationData');
      return res.status(400).send('Missing patientID or notificationData');
    }

    console.log("patientID:", patientID);
    console.log("notificationData:", notificationData);

    const notificationRef = db.doc(`notifications/${patientID}`);
    console.log("notificationRef:", notificationRef);


    if (!Array.isArray(notificationData)) {
      console.error("notificationData is not an array");
      return res.status(400).send('notificationData must be an array');
    }


    await notificationRef.set({ Notifications: notificationData }, { merge: true });

    console.log('Notification added successfully');
    return res.status(200).send({ success: true, message: 'Notification added successfully' });
  } catch (error) {
    console.error('Error adding notification:', error);
    return res.status(500).send('Error adding notification.');
  }
});