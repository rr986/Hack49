import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';

// Function to get lab data for a specific patient
export const getPatientLabData = functions.https.onRequest(async (req, res) => {
  const { patientId } = req.body;
  try {
    const labRef = db.collection('labMonitoring').where('patientID', '==', patientId);
    const labSnapshot = await labRef.get();

    if (labSnapshot.empty) {
      return res.status(404).send('No lab data found for the patient.');
    }

    const labData = labSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).send(labData);
  } catch (error) {
    console.error('Error retrieving lab data:', error);
    return res.status(500).send('Error retrieving lab data.');
  }
});

// Function to set or update lab monitoring data for a specific patient
export const setLabMonitoring = functions.https.onRequest(async (req, res) => {
  const { patientId, monitoringData } = req.body;
  try {
    const labRef = db.collection('labMonitoring').doc(patientId);  // Reference the patient’s lab data
    await labRef.set(monitoringData);  // Save the monitoring data
    return res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error setting lab monitoring data:', error);
    return res.status(500).send('Error setting lab monitoring data.');
  }
});
