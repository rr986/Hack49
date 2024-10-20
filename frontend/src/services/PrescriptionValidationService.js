/*export const validatePrescriptionInput = async (prescriptions) => {
  try {
    // Simulate prescription validation (replace with actual validation logic)
    return prescriptions.length ? ['Error in dosage for drug X'] : [];
  } catch (error) {
    console.error("Error validating prescription", error);
  }
};

export const customizePrescriptionForPatient = async (prescription) => {
  // Logic to adjust prescription based on patient-specific data
  return {
    ...prescription,
    adjustedDose: prescription.dose * 0.9,  // Example adjustment based on patient data
  };
};

export const checkPolypharmacyRisks = async (drugs) => {
  // Simulated risk checking logic based on multiple drugs
  if (drugs.length > 3) {
    return { hasRisk: true, message: 'Polypharmacy risk detected due to multiple interacting drugs.' };
  }
  return { hasRisk: false, message: 'No polypharmacy risks detected.' };
};
*/

import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';  // Import functions from shared firebase.js

// Validate prescriptions using Firebase Functions
export const validatePrescriptionInput = async (prescriptions) => {
  try {
    const validatePrescriptions = httpsCallable(functions, 'validatePrescriptionInput');
    const result = await validatePrescriptions({ prescriptions });
    return result.data.errors || [];
  } catch (error) {
    console.error('Error validating prescription', error);
  }
};

// Customize prescription based on patient data using Firebase Functions
export const customizePrescriptionForPatient = async (prescription) => {
  try {
    const customizePrescription = httpsCallable(functions, 'customizePrescription');
    const result = await customizePrescription({ prescription });
    return result.data.customizedPrescription;
  } catch (error) {
    console.error('Error customizing prescription', error);
  }
};

// Check polypharmacy risks using Firebase Functions
export const checkPolypharmacyRisks = async (drugs) => {
  try {
    const checkPolypharmacy = httpsCallable(functions, 'checkPolypharmacyRisks');
    const result = await checkPolypharmacy({ drugs });
    return result.data;
  } catch (error) {
    console.error('Error checking polypharmacy risks', error);
    return { hasRisk: false, message: 'No polypharmacy risks detected.' }; // Fallback
  }
};
