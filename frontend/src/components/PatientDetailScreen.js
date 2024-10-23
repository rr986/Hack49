import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { getPatientDataFn } from '../services/PatientDataStorage';
import globalStyles from '../styles';

const PatientDetailScreen = ({ route }) => {
  const { patientId } = route.params;  // Retrieve the patientId from navigation
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch the patient data by ID
        const data = await getPatientDataFn(patientId);
        setPatient(data);
      } catch (error) {
        console.error('Error fetching patient data', error);
        Alert.alert('Error', 'Failed to load patient details.');
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (!patient) {
    return (
      <View style={globalStyles.container}>
        <Text>Loading patient data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>{patient.firstName} {patient.lastName}</Text>
      <Text>Admit Reason: {patient.reasonForAdmit}</Text>

      <Text style={globalStyles.sectionTitle}>Allergies</Text>
      <Text>{patient.allergies || 'None'}</Text>

      <Text style={globalStyles.sectionTitle}>Drugs Currently Prescribed</Text>
      {patient.drugs.map((drug, index) => (
        <View key={index} style={globalStyles.card}>
          <Text>{drug.name}</Text>
          <Text>Dosage: {drug.dose}</Text>
        </View>
      ))}

      <Text style={globalStyles.sectionTitle}>Lab Monitoring Data</Text>
      {patient.labData ? (
        <View>
          {patient.labData.map((lab, index) => (
            <View key={index}>
              <Text>Lab Test: {lab.testName}</Text>
              <Text>Result: {lab.result}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No lab data available.</Text>
      )}
    </ScrollView>
  );
};

export default PatientDetailScreen;
