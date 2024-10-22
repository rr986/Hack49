
/* put in Firebase and Firestore or whatever db
export const checkDrugInteractions = async (drugs) => {
  try {
    // Simulate a real-time drug interaction check (replace with actual API call)
    const response = await fetch('https://example.com/api/drug-interactions', {
      method: 'POST',
      body: JSON.stringify({ drugs }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error checking drug interactions", error);
  }
}
*/
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';  // Import from the firebase.js file

export const checkDrugInteractionsFn = async (drugs) => {
  const checkInteractions = httpsCallable(functions, 'checkDrugInteractionsFn');
  const result = await checkInteractions({ drugs });
  return result.data;
};




