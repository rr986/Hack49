import * as functions from 'firebase-functions';
import { db } from '../utils/db.js';
import admin from 'firebase-admin';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import { getPatientData } from '../patients/index.js';
import { checkDrugInteractions } from '../drugInteractions/index.js';

// Initialize OpenAI configuration
const openai = new OpenAI({
  apiKey: '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'
});


// Function to retrieve all prescriptions for a specific patient
export const retrievePatientPrescriptions = functions.https.onRequest(async (req, res) => {
  const { patientId } = req.body;
  console.log(`Fetching prescriptions for patient ID: ${patientId}`);

  try {
    const patientRef = db.collection('Patients').doc(patientId);
    const patientDoc = await patientRef.get();

    if (!patientDoc.exists) {
      console.log(`Patient not found with ID: ${patientId}`);
      return res.status(404).send({ error: 'Patient not found.' });
    }

    const { prescriptionsIDs = [] } = patientDoc.data();
    if (prescriptionsIDs.length === 0) {
      console.log(`No prescriptions found for patient ID: ${patientId}`);
      return res.status(200).send({ prescriptions: [] });
    }

    const prescriptionsPromises = prescriptionsIDs.map((prescriptionID) =>
      db.collection('prescriptions').doc(prescriptionID).get()
    );
    const prescriptionsSnapshots = await Promise.all(prescriptionsPromises);

    const prescriptions = prescriptionsSnapshots
      .filter(doc => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log(`Fetched prescriptions for patient ID ${patientId}: ${JSON.stringify(prescriptions)}`);

    return res.status(200).send({ prescriptions });
  } catch (error) {
    console.error(`Error retrieving prescriptions for patient ID: ${patientId}`, error);
    return res.status(500).send({ error: 'Error retrieving prescriptions.' });
  }
});

// Validate prescriptions using polypharmacy checks and AI customization
export const validatePrescriptionInput = functions.https.onRequest(async (req, res) => {
  const { patientId, newPrescription } = req.body;
  console.log(`Validating prescription for patient ID: ${patientId}. Prescription: ${JSON.stringify(newPrescription)}`);

  try {
    // Step 1: Check for polypharmacy risks via HTTP request
    const polypharmacyResponse = await fetch('https://us-central1-ade-manager.cloudfunctions.net/checkPolypharmacyRisksFn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, newPrescription })
    });
    const polypharmacyResult = await polypharmacyResponse.json();
    console.log(`Polypharmacy result: ${JSON.stringify(polypharmacyResult)}`);

    if (polypharmacyResult.hasRisk) {
      return res.status(400).send({
        success: false,
        message: `Polypharmacy risk detected: ${polypharmacyResult.message}`,
        interactions: polypharmacyResult.interactions,
      });
    }

    // Step 2: Customize prescription via HTTP request
    const customizeResponse = await fetch('https://us-central1-ade-manager.cloudfunctions.net/customizePrescriptionFn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, newPrescription })
    });
    const customizeResult = await customizeResponse.json();
    console.log(`Customize prescription result: ${JSON.stringify(customizeResult)}`);

    // Step 3: Return validation success
    return res.status(200).send({
      success: true,
      message: 'Prescription validated and customized successfully.',
      customizedPrescription: customizeResult.customizedPrescription,
    });
  } catch (error) {
    console.error('Error validating prescription:', error);
    return res.status(500).send('Error validating prescription.');
  }
});

export const checkPolypharmacyRisks = functions.https.onRequest(async (req, res) => {
  const { patientId, newPrescription } = req.body;

  console.log(`Starting polypharmacy check for patient ID: ${patientId}`);
  console.log(`New prescription: ${JSON.stringify(newPrescription)}`);

  try {
    console.log('Retrieving existing prescriptions for the patient...');

    // Fetch patient document
    const patientRef = db.collection('Patients').doc(patientId);
    const patientDoc = await patientRef.get();

    if (!patientDoc.exists) {
      console.error(`Patient not found with ID: ${patientId}`);
      return res.status(404).send({ error: 'Patient not found.' });
    }

    const { prescriptionsIDs = [] } = patientDoc.data();
    if (prescriptionsIDs.length === 0) {
      console.log(`No prescriptions found for patient ID: ${patientId}`);
      return res.status(200).send({ message: 'No prescriptions found for the patient.' });
    }

    // Fetch prescriptions
    const prescriptionsPromises = prescriptionsIDs.map((prescriptionID) =>
      db.collection('prescriptions').doc(prescriptionID).get()
    );
    const prescriptionsSnapshots = await Promise.all(prescriptionsPromises);

    const prescriptions = prescriptionsSnapshots
      .filter(doc => doc.exists)
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log(`Fetched prescriptions for patient ID ${patientId}: ${JSON.stringify(prescriptions)}`);

    // Filter active prescriptions
    const activePrescriptions = prescriptions.filter(p => p.active);
    console.log(`Filtered active prescriptions: ${JSON.stringify(activePrescriptions)}`);

    if (activePrescriptions.length === 0) {
      console.error('No active prescriptions found.');
      return res.status(200).send({ message: 'No active prescriptions found.' });
    }

    // Compile list of all drugs
    const allDrugs = activePrescriptions.map(p => p.drug).concat(newPrescription.drug);
    console.log(`All drugs to check for interactions: ${JSON.stringify(allDrugs)}`);

    // Make an HTTP POST request to checkDrugInteractions
    try {
      const response = await fetch('https://us-central1-ade-manager.cloudfunctions.net/checkDrugInteractionsFn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drugs: allDrugs })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const interactionResult = await response.json();
      console.log(`Interaction result: ${JSON.stringify(interactionResult)}`);

      if (interactionResult.hasInteraction) {
        return res.status(200).send({
          hasRisk: true,
          message: interactionResult.message,
          interactions: interactionResult.interactions,
        });
      } else {
        return res.status(200).send({ hasRisk: false, message: 'No polypharmacy risks detected.' });
      }
    } catch (error) {
      console.error('Error checking drug interactions:', error);
      return res.status(500).send({ error: 'Error checking drug interactions.' });
    }
  } catch (error) {
    console.error('Error checking polypharmacy risks:', error);
    return res.status(500).send({ error: 'Error checking polypharmacy risks.' });
  }
});



// Function to add a new prescription for a specific patient
export const addPrescription = functions.https.onRequest(async (req, res) => {
  const { patientId, newPrescription } = req.body;
  console.log(`Adding prescription for patient ID: ${patientId}. Prescription: ${JSON.stringify(newPrescription)}`);

  try {
    const prescriptionRef = await db.collection('prescriptions').add({
      ...newPrescription,
      patientID: patientId,
      active: true,
      date: new Date().toISOString(),
    });
    console.log(`Prescription added with ID: ${prescriptionRef.id}`);

    // Update the patient document with the new prescription ID
    const patientRef = db.collection('Patients').doc(patientId);
    await patientRef.update({
      prescriptionsIDs: admin.firestore.FieldValue.arrayUnion(prescriptionRef.id),
    });
    console.log(`Patient ID ${patientId} updated with new prescription ID: ${prescriptionRef.id}`);

    return res.status(200).send({
      success: true,
      message: 'Prescription added successfully.',
      prescriptionId: prescriptionRef.id
    });
  } catch (error) {
    console.error(`Error adding prescription for patient ID: ${patientId}`, error);
    return res.status(500).send({
      success: false,
      message: 'Error adding prescription.'
    });
  }
});

// Customize prescription using AI
export const customizePrescription = functions.https.onRequest(async (req, res) => {
  const { patientId, newPrescription } = req.body;

  try {
    const patientRef = db.collection('Patients').doc(patientId);
    const patientDoc = await patientRef.get();
    if (!patientDoc.exists) {
      return res.status(404).send({ message: 'Patient not found' });
    }

    const { prescriptionsIDs = [] } = patientDoc.data();
    const prescriptionsSnapshots = await Promise.all(prescriptionsIDs.map((id) =>
      db.collection('prescriptions').doc(id).get()
    ));

    const existingDrugs = prescriptionsSnapshots
      .filter(doc => doc.exists)
      .map((doc) => doc.data().drug)
      .concat(newPrescription.drug);

    const prompt = `A patient is on the following drugs: ${existingDrugs.join(', ')}.Suggest potential risks or dose adjustments for the new prescription: ${newPrescription.drug} ${newPrescription.dosage}.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    });

    const aiMessage = response.choices[0].message.content.trim();

    return res.status(200).send({
      success: true,
      customizedPrescription: {
        ...newPrescription,
        aiMessage: aiMessage,
      },
      message: 'Prescription has been customized successfully.',
    });
  } catch (error) {
    console.error('Error customizing prescription:', error);
    return res.status(500).send({
      success: false,
      message: 'Error customizing prescription.',
    });
  }
});