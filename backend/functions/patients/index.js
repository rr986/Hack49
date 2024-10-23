import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { db } from '../utils/db.js';

// Function to get a single patient's data
export const getPatientData = functions.https.onRequest(async (req, res) => {
  const { patientId } = req.body;

  // Log the patient ID and collection reference
  console.log(`Fetching data for patient ID: ${patientId}`);
  console.log(`Collection name: Patients`);

  try {
    // Reference to the patient document in the "Patients" collection
    const patientRef = db.collection('Patients').doc(patientId);

    // Log the path to the patient document reference
    console.log(`Document reference: ${patientRef.path}`);

    const patientDoc = await patientRef.get();

    if (!patientDoc.exists) {
      console.log(`Patient not found with ID: ${patientId}`);
      return res.status(404).send('Patient not found.');
    }

    console.log(`Patient data retrieved successfully: ${JSON.stringify(patientDoc.data())}`);
    return res.status(200).send(patientDoc.data());  // Return the patient data
  } catch (error) {
    console.error(`Error retrieving patient data for patient ID: ${patientId}`, error);
    return res.status(500).send('Error retrieving patient data.');
  }
});

// Function to retrieve all patients for a specific user
export const getUserPatients = functions.https.onRequest(async (req, res) => {
  const { userID } = req.body;

  try {
    const userRef = db.collection('users').doc(userID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send('User not found.');
    }

    const { patients: patientIDs } = userDoc.data();

    const patientsPromises = patientIDs.map((patientID) => db.collection('Patients').doc(patientID).get());
    const patientsSnapshots = await Promise.all(patientsPromises);

    const patients = patientsSnapshots.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).send(patients);
  } catch (error) {
    console.error('Error retrieving patients:', error);
    return res.status(500).send('Error retrieving user patients.');
  }
});



/*Not used:
// Function to add a new patient to a user's patient list
exports.addPatientToUser = functions.https.onCall(async (data, context) => {
  const { userID, newPatientID } = data;
  try {
    const userRef = db.collection('users').doc(userID);
    await userRef.update({
      patients: admin.firestore.FieldValue.arrayUnion(newPatientID), // Add new patientID to the array
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding patient to user:', error);
    throw new functions.https.HttpsError('unknown', 'Error adding patient to user.');
  }
});

// Function to retrieve all patients' data
exports.getAllPatientsData = functions.https.onCall(async (data, context) => {
  try {
    const patientsSnapshot = await db.collection('patients').get();
    const patients = patientsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return patients;
  } catch (error) {
    console.error('Error retrieving all patients:', error);
    throw new functions.https.HttpsError('unknown', 'Error retrieving all patients.');
  }
});

// Function to create or update patient data

*/