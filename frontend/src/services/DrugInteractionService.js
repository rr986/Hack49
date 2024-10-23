
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
export const checkDrugInteractionsFn = async (drugs) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/checkDrugInteractionsFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drugs }),  // Send drugs array in the request body
    });

    const result = await response.json();
    return result;  // Return the API response
  } catch (error) {
    console.error("Error checking drug interactions:", error);
    throw error;
  }
};



