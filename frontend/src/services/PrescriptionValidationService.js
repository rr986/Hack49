import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

// Validate prescriptions using Firebase functions
export const validatePrescriptionInputFn = async (prescriptions) => {
  try {
    const validatePrescriptions = httpsCallable(functions, 'validatePrescriptionInputFn');
    const result = await validatePrescriptions({ prescriptions });
    return result.data.errors || [];
  } catch (error) {
    console.error('Error validating prescription', error);
  }
};

// Customize prescription based on patient data using Firebase Functions
export const customizePrescriptionFn = async (prescription) => {
  try {
    const customizePrescription = httpsCallable(functions, 'customizePrescriptionFn');
    const result = await customizePrescription({ prescription });
    return result.data.customizedPrescription;
  } catch (error) {
    console.error('Error customizing prescription', error);
  }
};

// Check polypharmacy risks using Firebase Functions
export const checkPolypharmacyRisksFn = async (drugs) => {
  try {
    const checkPolypharmacy = httpsCallable(functions, 'checkPolypharmacyRisksFn');
    const result = await checkPolypharmacy({ drugs });
    return result.data;
  } catch (error) {
    console.error('Error checking polypharmacy risks', error);
    return { hasRisk: false, message: 'No polypharmacy risks detected.' }; // Fallback
  }
};
