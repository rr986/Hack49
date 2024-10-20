//This file stores patient data in local storage for simplicity, you can replace this with Firebase Firestore or any other backend storage
import AsyncStorage from '@react-native-async-storage/async-storage';

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
