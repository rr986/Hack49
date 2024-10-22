import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { checkDrugInteractionsFn } from '../services/DrugInteractionService';
import { validatePrescriptionInputFn, customizePrescriptionFn } from '../services/PrescriptionValidationService';
import { getPatientLabDataFn } from '../services/LabMonitoringService';
import globalStyles from '../styles';

const PatientDetailScreen = ({ route }) => {
  const { patient } = route.params;
  const [drugInteractions, setDrugInteractions] = useState(null);
  const [prescriptionValidation, setPrescriptionValidation] = useState(null);
  const [labData, setLabData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      const drugInteractionResult = await checkDrugInteractionsFn(patient.drugs);
      setDrugInteractions(drugInteractionResult);

      const validationResult = await validatePrescriptionInputFn(patient.prescriptions);
      setPrescriptionValidation(validationResult);

      const labResult = await getPatientLabDataFn(patient.id);
      setLabData(labResult);
    };
    fetchPatientData();
  }, [patient]);

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>{patient.firstName} {patient.lastName}</Text>
      <Text>Admit Reason: {patient.admitReason}</Text>

      <Text style={globalStyles.sectionTitle}>Drugs Currently Prescribed</Text>
      {patient.drugs.map((drug, index) => (
        <View key={index} style={globalStyles.card}>
          <Text>{drug.name}</Text>
          <Text>Dosage: {drug.dose}</Text>
        </View>
      ))}

      <Button
        title="Check Drug Interactions"
        onPress={() => Alert.alert('Drug Interaction Results', JSON.stringify(drugInteractions))}
      />

      <Text style={globalStyles.sectionTitle}>Prescription Validation</Text>
      <Button
        title="Validate Prescription"
        onPress={() => Alert.alert('Validation Results', JSON.stringify(prescriptionValidation))}
      />

      <Text style={globalStyles.sectionTitle}>Lab Monitoring Data</Text>
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

export default PatientDetailScreen;
