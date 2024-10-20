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
};
