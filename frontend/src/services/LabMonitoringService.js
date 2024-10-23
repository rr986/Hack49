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
import { db } from '../firebase';

// Fetch patient lab data from Firestore or use Firebase Function
export const getPatientLabDataFn = async (patientId) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/getPatientLabDataFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lab data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lab data', error);
    throw error;
  }
};


// Set lab monitoring data using Firebase Functions
export const setLabMonitoringFn = async (patientId, monitoringData) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/setLabMonitoringFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, monitoringData }),
    });

    if (!response.ok) {
      throw new Error('Failed to set lab monitoring');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting lab monitoring', error);
    throw error;
  }
};

