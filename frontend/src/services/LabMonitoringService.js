/*export const getPatientLabData = async (patientId) => {
  try {
    // Simulate fetching lab data (replace with actual lab data retrieval)
    const response = await fetch(`https://example.com/api/lab-data/${patientId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching lab data", error);
  }
};

export const setLabMonitoring = async () => {
  try {
    // Simulate setting up lab monitoring (replace with actual API call)
    const response = await fetch('https://example.com/api/lab-monitoring', {
      method: 'POST',
    });
    return { success: true };
  } catch (error) {
    console.error("Error setting lab monitoring", error);
    return { success: false };
  }
};
*/
import { httpsCallable } from 'firebase/functions';
import { db } from '../firebase';  // Import Firestore from shared firebase.js

// Fetch patient lab data from Firestore or use Firebase Function
export const getPatientLabData = async (patientId) => {
  try {
    const getLabData = httpsCallable(functions, 'getPatientLabData');  // Replace with cloud function
    const result = await getLabData({ patientId });
    return result.data;
  } catch (error) {
    console.error('Error fetching lab data', error);
  }
};

// Set lab monitoring data using Firebase Functions
export const setLabMonitoring = async (patientId, monitoringData) => {
  try {
    const setMonitoring = httpsCallable(functions, 'setLabMonitoring');
    const result = await setMonitoring({ patientId, monitoringData });
    return result.data;
  } catch (error) {
    console.error('Error setting lab monitoring', error);
  }
};
