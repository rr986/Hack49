import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import { getUserPatientsFn, retrievePatientPrescriptionsFn, checkPolypharmacyRisksFn } from '../services/PrescriptionValidationService';
import globalStyles from '../styles';

const PolypharmacyScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const result = await getUserPatientsFn();
      setPatients(result);
    };
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      if (!patientId) {
        Alert.alert("Error", "Please select a patient.");
        return;
      }
      const result = await retrievePatientPrescriptionsFn(patientId);
      setPrescriptions(result);
    } catch (error) {
      console.error('Error fetching prescriptions', error);
    }
  };

  const handleCheckPolypharmacy = async () => {
    const drugs = prescriptions.map(p => p.drug);
    const result = await checkPolypharmacyRisksFn(drugs);

    if (result.hasRisk) {
      Alert.alert("Polypharmacy Risk", result.message);
    } else {
      Alert.alert("Safe", "No polypharmacy risks detected.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text>Select Patient</Text>
      <Picker
        selectedValue={patientId}
        onValueChange={(itemValue) => setPatientId(itemValue)}
        style={globalStyles.input}
      >
        {patients.map((patient) => (
          <Picker.Item key={patient.id} label={`${patient.firstName} ${patient.lastName}`} value={patient.id} />
        ))}
      </Picker>

      <Button title="Fetch Prescriptions" onPress={fetchPrescriptions} />

      <FlatList
        data={prescriptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text>{item.drug} - {item.dose}</Text>
          </View>
        )}
      />

      <Button title="Check Polypharmacy Risks" onPress={handleCheckPolypharmacy} />
    </View>
  );
};

export default PolypharmacyScreen;
