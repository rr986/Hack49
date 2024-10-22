import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import { getPatientData } from '../patients/index.js';
import { checkDrugInteractions } from '../drugInteractions/index.js';

// Initialize OpenAI configuration
const openai = new OpenAI({
  apiKey: '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',
});

// Function to retrieve all prescriptions for a specific patient
export const retrievePatientPrescriptions = functions.https.onCall(async (data, context) => {
  const { patientId } = data;
  console.log(`Fetching prescriptions for patient ID: ${patientId}`);

  try {
    const patientRef = db.collection('patients').doc(patientId);
    const patientDoc = await patientRef.get();

    if (!patientDoc.exists) {
      console.log(`Patient not found with ID: ${patientId}`);
      throw new functions.https.HttpsError('not-found', 'Patient data not found.');
    }

    const { prescriptionsIDs } = patientDoc.data();
    if (!prescriptionsIDs || prescriptionsIDs.length === 0) {
      console.log(`No prescriptions found for patient ID: ${patientId}`);
      return { prescriptions: [] }; // Return an empty array if no prescriptions
    }

    // Retrieve all prescriptions based on prescriptionIDs
    const prescriptionsPromises = prescriptionsIDs.map((prescriptionID) =>
      db.collection('prescriptions').doc(prescriptionID).get()
    );
    const prescriptionsSnapshots = await Promise.all(prescriptionsPromises);

    const prescriptions = prescriptionsSnapshots.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(`Fetched prescriptions for patient ID ${patientId}: ${JSON.stringify(prescriptions)}`);

    return { prescriptions }; // Return the patient's prescriptions
  } catch (error) {
    console.error(`Error retrieving prescriptions for patient ID: ${patientId}`, error);
    throw new functions.https.HttpsError('unknown', 'Error retrieving prescriptions.');
  }
});

export const validatePrescriptionInput = functions.https.onCall(async (data, context) => {
  const { patientId, newPrescription } = data;
  console.log(`Validating prescription for patient ID: ${patientId}. Prescription: ${JSON.stringify(newPrescription)}`);

  try {
    // Retrieve existing prescriptions for the patient
    const result = await exports.retrievePatientPrescriptions({ patientId }, context);
    const existingPrescriptions = result.prescriptions || [];

    // Add new prescription to the validation check
    const allPrescriptions = [...existingPrescriptions, newPrescription];
    console.log(`All prescriptions for validation: ${JSON.stringify(allPrescriptions)}`);

    // Add validation logic here (check for drug interactions, etc.)
    const validationErrors = [];
    if (newPrescription.dose > 100) {
      validationErrors.push('Dose exceeds the safe limit.');
    }

    console.log(`Validation errors: ${validationErrors}`);
    return { errors: validationErrors };
  } catch (error) {
    console.error(`Error validating prescription for patient ID: ${patientId}`, error);
    return { errors: ['Validation failed.'] };
  }
});

// Function to check polypharmacy risks for a patient
export const checkPolypharmacyRisks = functions.https.onCall(async (data, context) => {
  const { patientId, newPrescription } = data;

  try {
    // Retrieve the patient's active prescriptions
    const result = await exports.retrievePatientPrescriptions({ patientId }, context);
    const existingPrescriptions = result.prescriptions.filter(p => p.active);

    // Extract drug names from existing prescriptions and add the new one
    const allDrugs = existingPrescriptions.map(p => p.drug).concat(newPrescription.drug);

    // Call the drug interaction function to check for interactions
    const interactionResult = await exports.checkDrugInteractions({ drugs: allDrugs }, context);

    if (interactionResult.hasInteraction) {
      return {
        hasRisk: true,
        message: `Polypharmacy risk detected: ${interactionResult.message}`,
        interactions: interactionResult.interactions
      };
    }

    // If no interaction risks, return safe
    return { hasRisk: false, message: 'No polypharmacy risks detected.' };
  } catch (error) {
    console.error('Error checking polypharmacy risks:', error);
    throw new functions.https.HttpsError('unknown', 'Error checking polypharmacy risks.');
  }
});

export const addPrescription = functions.https.onCall(async (data, context) => {
  const { patientId, newPrescription } = data;
  console.log(`Adding prescription for patient ID: ${patientId}. Prescription: ${JSON.stringify(newPrescription)}`);

  try {
    // Step 1: Add the new prescription to the prescriptions collection
    const prescriptionRef = await db.collection('prescriptions').add({
      ...newPrescription,
      patientID: patientId,
      active: true, // Set the prescription as active by default
      date: new Date().toISOString(), // Add a timestamp for the prescription
    });
    console.log(`Prescription added with ID: ${prescriptionRef.id}`);

    // Step 2: Update the patient's document to include the new prescription ID
    const patientRef = db.collection('patients').doc(patientId);
    await patientRef.update({
      prescriptionsIDs: db.FieldValue.arrayUnion(prescriptionRef.id),
    });
    console.log(`Patient ID ${patientId} updated with new prescription ID: ${prescriptionRef.id}`);

    return { success: true, message: 'Prescription added successfully.', prescriptionId: prescriptionRef.id };
  } catch (error) {
    console.error(`Error adding prescription for patient ID: ${patientId}`, error);
    throw new functions.https.HttpsError('unknown', 'Error adding prescription.');
  }
});

// Function to customize prescription using AI
export const customizePrescription = functions.https.onCall(async (data, context) => {
  const { patientId, newPrescription } = data;
  console.log(`Customizing prescription for patient ID: ${patientId}. Prescription: ${JSON.stringify(newPrescription)}`);

  try {
    // Step 1: Retrieve the patient data (fetch existing prescriptions)
    const patientData = await getPatientData({ patientId });
    const existingPrescriptions = patientData.prescriptionsIDs || []; // Retrieve existing prescriptions

    // Step 2: Fetch prescriptions from Firestore for existing drugs
    const prescriptionPromises = existingPrescriptions.map((prescriptionId) =>
      db.collection('prescriptions').doc(prescriptionId).get()
    );
    const prescriptionsDocs = await Promise.all(prescriptionPromises);
    const existingDrugs = prescriptionsDocs.map((doc) => doc.data().drug);

    // Step 3: Check drug interactions (new drug vs existing drugs)
    const drugsToCheck = [...existingDrugs, newPrescription.drug];
    const interactionResult = await checkDrugInteractions({ drugs: drugsToCheck });

    if (interactionResult.hasInteraction) {
      // If interactions are found, return an error with interaction details
      return {
        success: false,
        message: `Interaction detected between drugs: ${interactionResult.message}`,
        interactions: interactionResult.interactions,
      };
    }

    // Step 4: Use OpenAI to customize the prescription and suggest modifications
    const drugs = existingDrugs.map(drug => `${drug}`).concat(`${newPrescription.drug} ${newPrescription.dose}`);
    const prompt = `
      A patient is currently on the following prescriptions: ${drugs.join(', ')}.
      Please suggest any potential risks or adjustments needed for the following new prescription: ${newPrescription.drug} ${newPrescription.dose}.
      Provide a risk level and customized recommendations if necessary.
    `;

    const openAIResponse = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 500,
    });

    const aiMessage = openAIResponse.data.choices[0].text.trim();

    // Step 5: Return the AI-driven prescription recommendations
    return {
      success: true,
      customizedPrescription: {
        ...newPrescription,
        aiMessage: aiMessage,
      },
      message: `Prescription has been customized successfully.`,
    };
  } catch (error) {
    console.error('Error customizing prescription:', error);
    throw new functions.https.HttpsError('unknown', 'Error customizing prescription.');
  }
});