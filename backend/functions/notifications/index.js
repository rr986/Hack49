import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';
import { doc, setDoc } from 'firebase/firestore';  // Add this line if it's missing
import

// Function to get notifications for a specific user (based on userID)
export const getNotificationsForUser = functions.https.onRequest(async (req, res) => {
  // Log the incoming request to ensure data is being received properly
  console.log("Request received:", req.body);

  const { userID } = req.body;

  // Ensure userID is present
  if (!userID) {
    console.error('No userID provided.');
    return res.status(400).send('userID must be provided.');
  }

  try {
    console.log('Looking for notifications for user:', userID);

    // Reference the notifications document for this userID
    const notificationsRef = db.collection('notifications').doc(userID);
    const notificationsDoc = await notificationsRef.get();

    // Log if the document exists or not
    if (!notificationsDoc.exists) {
      console.error('No notifications found for user:', userID);
      return res.status(404).send('No notifications found for the user.');
    }

    // Retrieve and log the data
    const notificationsData = notificationsDoc.data();
    console.log('Notifications data:', notificationsData);

    // Send back the data
    return res.status(200).send(notificationsData);
  } catch (error) {
    // Log the error and send a 500 response
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

    // Ensure notificationData is an array
    if (!Array.isArray(notificationData)) {
      console.error("notificationData is not an array");
      return res.status(400).send('notificationData must be an array');
    }

    // Add notifications using merge option
    await notificationRef.set({ Notifications: notificationData }, { merge: true });

    console.log('Notification added successfully');
    return res.status(200).send({ success: true, message: 'Notification added successfully' });
  } catch (error) {
    console.error('Error adding notification:', error);
    return res.status(500).send('Error adding notification.');
  }
});