import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

// Validate prescriptions
export const validatePrescriptionInputFn = async ({ patientId, newPrescription }) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/validatePrescriptionInputFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, newPrescription }),
    });

    const data = await response.json();
    return data.errors || [];
  } catch (error) {
    console.error('Error validating prescription', error);
    throw error;
  }
};

// Customize prescription based on patient data
export const customizePrescriptionFn = async ({ patientId, newPrescription }) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/customizePrescriptionFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, newPrescription }),
    });

    const data = await response.json();
    return data.customizedPrescription;
  } catch (error) {
    console.error('Error customizing prescription', error);
    throw error;
  }
};

// Check polypharmacy risks
export const checkPolypharmacyRisksFn = async ({ patientId, newPrescription }) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/checkPolypharmacyRisksFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, newPrescription }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking polypharmacy risks', error);
    return { hasRisk: false, message: 'No polypharmacy risks detected.' };
  }
};

// Retrieve prescriptions for a specific patient
export const retrievePatientPrescriptionsFn = async (patientId) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/retrievePatientPrescriptionsFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId }),
    });

    const data = await response.json();
    return data.prescriptions || [];
  } catch (error) {
    console.error('Error retrieving prescriptions', error);
    throw error;
  }
};

// Add a prescription for a specific patient
export const addPrescriptionFn = async (patientId, newPrescription) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/addPrescriptionFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patientId, newPrescription }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding prescription', error);
    throw error;
  }
};



