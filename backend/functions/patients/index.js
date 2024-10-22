import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { db } from '../utils/db.js';

// Function to get a single patient's data
export const getPatientData = functions.https.onCall(async (data, context) => {
  const { patientId } = data;
  console.log(`Fetching data for patient ID: ${patientId}`);

  try {
    const patientRef = db.collection('patients').doc(patientId);
    const patientDoc = await patientRef.get();

    if (!patientDoc.exists) {
      console.log(`Patient not found with ID: ${patientId}`);
      throw new functions.https.HttpsError('not-found', 'Patient data not found.');
    }

    console.log(`Patient data retrieved successfully: ${JSON.stringify(patientDoc.data())}`);
    return patientDoc.data();  // Returning the patient data
  } catch (error) {
    console.error(`Error retrieving patient data for patient ID: ${patientId}`, error);
    throw new functions.https.HttpsError('unknown', 'Error retrieving patient data.');
  }
});

// Function to retrieve all patients for a specific user
export const getUserPatients = functions.https.onCall(async (data, context) => {
  const { userID } = data;
  console.log(`Fetching patients for user ID: ${userID}`);

  try {
    const userRef = db.collection('users').doc(userID);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`User not found with ID: ${userID}`);
      throw new functions.https.HttpsError('not-found', 'User not found.');
    }

    const { patients: patientIDs } = userDoc.data();
    console.log(`User ${userID} has the following patient IDs: ${patientIDs}`);

    // Fetch all the patient's data based on the patientIDs
    const patientsPromises = patientIDs.map((patientID) => db.collection('patients').doc(patientID).get());
    const patientsSnapshots = await Promise.all(patientsPromises);

    const patients = patientsSnapshots.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(`Fetched patient data: ${JSON.stringify(patients)}`);

    return patients;  // Return the patient's data
  } catch (error) {
    console.error(`Error retrieving user patients for user ID: ${userID}`, error);
    throw new functions.https.HttpsError('unknown', 'Error retrieving user patients.');
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