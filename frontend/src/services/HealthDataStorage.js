import firestore from '@react-native-firebase/firestore';

export const saveHealthData = async (patientId, data) => {
  try {
    await firestore()
      .collection('patients')
      .doc(patientId)
      .set(data); 
  } catch (error) {
    console.error('Error saving health data to Firestore', error);
  }
};

export const getHealthData = async () => {
  try {
    const patientsSnapshot = await firestore().collection('patients').get();
    const patientsList = patientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return patientsList;
  } catch (error) {
    console.error('Error retrieving health data from Firestore', error);
    return [];
  }
};
