//This file stores patient data in local storage for simplicity, you can replace this with Firebase Firestore or any other backend storage
/*import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveHealthData = async (data) => {
  try {
    const jsonData = JSON.stringify(data);
    await AsyncStorage.setItem('healthData', jsonData);
  } catch (error) {
    console.error('Error saving health data', error);
  }
};

export const getHealthData = async () => {
  try {
    const jsonData = await AsyncStorage.getItem('healthData');
    return jsonData != null ? JSON.parse(jsonData) : [];
  } catch (error) {
    console.error('Error retrieving health data', error);
  }
};
*/
import { collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Save health data to Firestore
export const saveHealthData = async (patientId, data) => {
  try {
    const patientRef = doc(db, 'patients', patientId);  // Referencing patient document in Firestore
    await setDoc(patientRef, data, { merge: true });  // Merge to avoid overwriting existing data
    console.log('Health data saved successfully');
  } catch (error) {
    console.error('Error saving health data', error);
  }
};

// Get health data from Firestore
export const getHealthData = async (patientId) => {
  try {
    const patientRef = doc(db, 'patients', patientId);  // Referencing patient document in Firestore
    const patientDoc = await getDoc(patientRef);

    if (patientDoc.exists()) {
      return patientDoc.data();
    } else {
      console.log('No such patient data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving health data', error);
  }
};

// Maybe, get all patients' health data
export const getAllHealthData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'patients'));
    const allData = [];
    querySnapshot.forEach((doc) => {
      allData.push({ id: doc.id, ...doc.data() });
    });
    return allData;
  } catch (error) {
    console.error('Error retrieving all health data', error);
  }
};
