const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // Use node-fetch to make API requests
admin.initializeApp();

// Cloud Function to check drug interactions using the FDA API
exports.checkDrugInteractions = functions.https.onCall(async (data, context) => {
  const { drugs } = data;  // Array of drugs provided by the front-end
  if (!drugs || drugs.length === 0) {
    return {
      hasInteraction: false,
      message: "No drugs provided for interaction check.",
    };
  }

  try {
    // Create a search query for the FDA API based on the provided drug list
    const searchQuery = drugs.join('+');  // Concatenate drugs with '+' to search FDA's database
    const fdaApiUrl = `https://api.fda.gov/drug/event.json?search=${searchQuery}`;

    // Fetch data from the FDA API for the provided drugs
    const response = await fetch(fdaApiUrl);
    const result = await response.json();

    // Check for any results that indicate interactions
    if (result.results && result.results.length > 0) {
      let hasInteraction = false;
      let interactionMessage = 'No significant interactions found.';
      let interactionDetails = [];

      // Loop through the results and check for reactions related to drug interactions
      result.results.forEach((event) => {
        if (event.reactions && event.reactions.length > 0) {
          hasInteraction = true;
          interactionMessage = `Adverse reaction found for ${event.patient.drug[0].medicinalproduct}`;

          // Capture details of the interaction
          interactionDetails.push({
            drug: event.patient.drug[0].medicinalproduct,
            reactions: event.reactions.map((reaction) => reaction.reactionmeddrapt),
          });
        }
      });

      // Return the results if interactions are found
      return {
        hasInteraction,
        message: interactionMessage,
        interactions: interactionDetails.length > 0 ? interactionDetails : null,
      };
    } else {
      // No interactions found in the FDA API response
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
