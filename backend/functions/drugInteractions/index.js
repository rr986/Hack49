import * as functions from 'firebase-functions';
import fetch from 'node-fetch';  // Ensure node-fetch is installed

export const checkDrugInteractions = functions.https.onCall(async (data, context) => {
  const { drugs } = data;
  if (!drugs || drugs.length === 0) {
    return {
      hasInteraction: false,
      message: "No drugs provided for interaction check.",
    };
  }

  try {
    const searchQuery = drugs.join('+');
    const fdaApiUrl = `https://api.fda.gov/drug/event.json?search=${searchQuery}`;
    const response = await fetch(fdaApiUrl);
    const result = await response.json();

    if (result.results && result.results.length > 0) {
      let hasInteraction = false;
      let interactionMessage = 'No significant interactions found.';
      let interactionDetails = [];

      result.results.forEach((event) => {
        if (event.reactions && event.reactions.length > 0) {
          hasInteraction = true;
          interactionMessage = `Adverse reaction found for ${event.patient.drug[0].medicinalproduct}`;

          interactionDetails.push({
            drug: event.patient.drug[0].medicinalproduct,
            reactions: event.reactions.map((reaction) => reaction.reactionmeddrapt),
          });
        }
      });

      return {
        hasInteraction,
        message: interactionMessage,
        interactions: interactionDetails.length > 0 ? interactionDetails : null,
      };
    } else {
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
