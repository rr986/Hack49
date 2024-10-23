import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

// Helper function to get RxCUI for a drug name
async function getRxCUI(drugName) {
  try {
    console.log(`Fetching RxCUI for drug: ${drugName}`);
    const rxCuiUrl = `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(drugName)}`;
    const response = await fetch(rxCuiUrl);

    if (!response.ok) {
      console.error(`Failed to fetch RxCUI for ${drugName}. Status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`Received data for ${drugName}:`, JSON.stringify(data));

    if (data.approximateGroup?.candidate?.length > 0) {
      const rxcui = data.approximateGroup.candidate[0].rxcui;
      console.log(`RxCUI for ${drugName}: ${rxcui}`);
      return rxcui;
    } else {
      console.warn(`No RxCUI found for drug: ${drugName}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching RxCUI for drug ${drugName}:`, error);
    throw error; // Re-throw to be handled in the main function
  }
}

// Main function to check drug interactions
export const checkDrugInteractions = functions.https.onRequest(async (req, res) => {
  const { drugs } = req.body;
  console.log(`Received request to check interactions for drugs: ${JSON.stringify(drugs)}`);

  // Input Validation
  if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
    console.warn('Insufficient number of drugs provided for interaction check.');
    return res.status(400).send({
      hasInteraction: false,
      message: 'At least two drugs are required for interaction check.',
    });
  }

  try {
    // Step 1: Get RxCUIs for the provided drugs
    const rxCuiPromises = drugs.map(drug => getRxCUI(drug));
    const rxCuis = await Promise.all(rxCuiPromises);
    console.log(`RxCUIs obtained: ${JSON.stringify(rxCuis)}`);

    // Step 2: Filter out null values (drugs without RxCUI)
    const validRxCuis = rxCuis.filter(rxcui => rxcui !== null);
    console.log(`Valid RxCUIs: ${JSON.stringify(validRxCuis)}`);

    if (validRxCuis.length < 2) {
      console.warn('Not enough valid RxCUIs to check for interactions.');
      return res.status(200).send({
        hasInteraction: false,
        message: 'Not enough valid drugs to check for interactions.',
      });
    }

    // Step 3: Check interactions using the correct endpoint
    const [rxcui1, rxcui2] = validRxCuis;
    const interactionUrl = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcui1},${rxcui2}`;
    console.log(`Fetching interactions from URL: ${interactionUrl}`);
    const interactionResponse = await fetch(interactionUrl);

    // Read the response as text
    const interactionResponseText = await interactionResponse.text();
    console.log(`Interaction response status: ${interactionResponse.status}`);
    console.log(`Interaction response text: ${interactionResponseText}`);

    let interactionData;
    try {
      interactionData = JSON.parse(interactionResponseText);
    } catch (parseError) {
      console.error('Error parsing interaction response JSON:', parseError);

      // Handle specific non-JSON response indicating no interactions
      if (interactionResponseText.trim().startsWith('No interactions are found')) {
        console.log('No interactions found.');
        return res.status(200).send({
          hasInteraction: false,
          message: 'No interactions found.',
          interactions: [],
        });
      } else {
        console.error('Unexpected response from interaction API.');
        return res.status(500).send({
          hasInteraction: false,
          message: 'Error fetching interaction data. Please try again later.',
        });
      }
    }

    // Step 4: Check if interactionData contains interactions
    let hasInteraction = false;
    let interactionDetails = [];

    if (
      interactionData.fullInteractionTypeGroup &&
      interactionData.fullInteractionTypeGroup.length > 0
    ) {
      hasInteraction = true;
      interactionData.fullInteractionTypeGroup.forEach(group => {
        group.fullInteractionType.forEach(type => {
          type.interactionPair.forEach(pair => {
            interactionDetails.push({
              source: group.sourceName,
              description: pair.description,
              severity: pair.severity,
            });
          });
        });
      });
    } else {
      console.log('No interactions found in interactionData.');
    }

    console.log(`Interaction check result: hasInteraction=${hasInteraction}`);
    return res.status(200).send({
      hasInteraction,
      message: hasInteraction ? 'Interactions found.' : 'No interactions found.',
      interactions: interactionDetails,
    });
  } catch (error) {
    console.error('Error fetching drug interaction data:', error);
    return res.status(500).send({
      hasInteraction: false,
      message: 'Error checking drug interactions. Please try again later.',
    });
  }
});