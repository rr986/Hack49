export const checkDrugInteractionsFn = async (drugs) => {
  try {
    const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/checkDrugInteractionsFn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ drugs }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error checking drug interactions:", error);
    throw error;
  }
};



