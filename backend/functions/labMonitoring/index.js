import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';

// Function to get lab data for a specific patient
export const getPatientLabData = functions.https.onCall(async (data, context) => {
  const { patientId } = data;
  try {
    const labRef = db.collection('labMonitoring').where('patientID', '==', patientId);
    const labSnapshot = await labRef.get();

    if (labSnapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'No lab data found for the patient.');
    }

    const labData = labSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return labData;
  } catch (error) {
    console.error('Error retrieving lab data:', error);
    throw new functions.https.HttpsError('unknown', 'Error retrieving lab data.');
  }
});

// Function to set or update lab monitoring data for a specific patient
export const setLabMonitoring = functions.https.onCall(async (data, context) => {
  const { patientId, monitoringData } = data;
  try {
    const labRef = db.collection('labMonitoring').doc(patientId); // Reference the patient’s lab data
    await labRef.set(monitoringData); // Save the monitoring data
    return { success: true };
  } catch (error) {
    console.error('Error setting lab monitoring data:', error);
    throw new functions.https.HttpsError('unknown', 'Error setting lab monitoring data.');
  }
});
