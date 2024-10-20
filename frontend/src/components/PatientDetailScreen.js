import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { checkDrugInteractions } from '../services/DrugInteractionService';
import { validatePrescriptionInput, customizePrescriptionForPatient } from '../services/PrescriptionValidationService';
import { getPatientLabData } from '../services/LabMonitoringService';

const PatientDetailScreen = ({ route }) => {
  const { patient } = route.params;
  const [drugInteractions, setDrugInteractions] = useState(null);
  const [prescriptionValidation, setPrescriptionValidation] = useState(null);
  const [labData, setLabData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      // Fetch real-time drug interaction data
      const drugInteractionResult = await checkDrugInteractions(patient.drugs);
      setDrugInteractions(drugInteractionResult);

      // Fetch prescription validation results
      const validationResult = await validatePrescriptionInput(patient.prescriptions);
      setPrescriptionValidation(validationResult);

      // Fetch lab monitoring data
      const labResult = await getPatientLabData(patient.id);
      setLabData(labResult);
    };
    fetchPatientData();
  }, [patient]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{patient.firstName} {patient.lastName}</Text>
      <Text>Admit Reason: {patient.admitReason}</Text>

      <Text style={styles.sectionTitle}>Drugs Currently Prescribed</Text>
      {patient.drugs.map((drug, index) => (
        <View key={index} style={styles.drugCard}>
          <Text>{drug.name}</Text>
          <Text>Dosage: {drug.dose}</Text>
        </View>
      ))}

      <Button
        title="Check Drug Interactions"
        onPress={() => Alert.alert('Drug Interaction Results', JSON.stringify(drugInteractions))}
      />

      <Text style={styles.sectionTitle}>Prescription Validation</Text>
      <Button
        title="Validate Prescription"
        onPress={() => Alert.alert('Validation Results', JSON.stringify(prescriptionValidation))}
      />

      <Text style={styles.sectionTitle}>Lab Monitoring Data</Text>
      {labData ? (
        <View>
          <Text>Lab Test: {labData.testName}</Text>
          <Text>Result: {labData.result}</Text>
        </View>
      ) : (
        <Text>No lab data available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  drugCard: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
});

export default PatientDetailScreen;
