const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');  // For making API requests
admin.initializeApp();

// Cloud Function to check drug interactions using the FDA API
exports.checkDrugInteractions = functions.https.onCall(async (data, context) => {
  const { drugs } = data;  // Array of drugs provided by the front-end
  
  // Check if any drugs were provided
  if (!drugs || drugs.length === 0) {
    return {
      hasInteraction: false,
      message: "No drugs provided for interaction check.",
    };
  }

  try {
    // Construct the search query by joining the drugs with '+'
    const searchQuery = drugs.join('+');
    const fdaApiUrl = `https://api.fda.gov/drug/event.json?search=${searchQuery}`;

    // Fetch data from the FDA API
    const response = await fetch(fdaApiUrl);
    const result = await response.json();

    // Check for any results indicating interactions
    if (result.results && result.results.length > 0) {
      let hasInteraction = false;
      let interactionMessage = 'No significant interactions found.';
      let interactionDetails = [];

      // Loop through results to check for adverse drug reactions
      result.results.forEach((event) => {
        if (event.reactions && event.reactions.length > 0) {
          hasInteraction = true;
          interactionMessage = `Adverse reaction found for ${event.patient.drug[0].medicinalproduct}`;
          
          // Capture the interaction details
          interactionDetails.push({
            drug: event.patient.drug[0].medicinalproduct,
            reactions: event.reactions.map((reaction) => reaction.reactionmeddrapt),
          });
        }
      });

      // Return interaction data if found
      return {
        hasInteraction,
        message: interactionMessage,
        interactions: interactionDetails.length > 0 ? interactionDetails : null,
      };
    } else {
      // No interactions found
      return {
        hasInteraction: false,
        message: "No interactions found for the provided drugs.",
        interactions: null,
      };
    }
  } catch (error) {
    console.error('Error fetching drug interaction data:', error);
    return {
      hasInteraction: false,
      message: 'Error checking drug interactions. Please try again later.',
    };
  }
});
