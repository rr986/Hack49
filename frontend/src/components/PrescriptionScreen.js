import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUserPatientsFn } from '../services/PatientDataStorage';
import { retrievePatientPrescriptionsFn, validatePrescriptionInputFn, customizePrescriptionFn, checkPolypharmacyRisksFn, addPrescriptionFn } from '../services/PrescriptionValidationService';
import globalStyles from '../styles';

const PrescriptionScreen = () => {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [drug, setDrug] = useState('');
  const [dose, setDose] = useState('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [prescriptionValidated, setPrescriptionValidated] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [customizedPrescription, setCustomizedPrescription] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getUserPatientsFn('WmD4yXXhogKH6DbLRg70');
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients', error);
      }
    };

    fetchPatients();
  }, []);

  const handleValidate = async () => {
    try {
      if (!patientId) {
        Alert.alert('Validation Failed', 'Please select a patient.');
        return;
      }

      const newPrescription = { drug, dose, date, purpose };
      const validationErrors = await validatePrescriptionInputFn({ patientId, newPrescription });

      if (validationErrors.length) {
        Alert.alert('Validation Errors', validationErrors.join('\n'));
        setPrescriptionValidated(false);
      } else {
        // Check polypharmacy risks
        const polypharmacyResult = await checkPolypharmacyRisksFn({ patientId, newPrescription });
        if (polypharmacyResult.hasRisk) {
          Alert.alert('Polypharmacy Risk', polypharmacyResult.message);
          setPrescriptionValidated(false);
          return;
        }

        // Customize prescription using AI
        const result = await customizePrescriptionFn({ patientId, newPrescription });
        setCustomizedPrescription(result);
        setAiMessage(result.aiMessage || '');
        setPrescriptionValidated(true);

        Alert.alert('Prescription Validated', 'The prescription has been validated and customized.');
      }
    } catch (error) {
      console.error('Error during validation', error);
      Alert.alert('Validation Error', 'An error occurred during validation.');
      setPrescriptionValidated(false);
    }
  };

  const handleAddPrescription = async () => {
    try {
      if (!prescriptionValidated) {
        Alert.alert('Error', 'Please validate the prescription before adding.');
        return;
      }

      const newPrescription = { drug, dose, date, purpose };
      const result = await addPrescriptionFn(patientId, newPrescription);

      if (result.success) {
        Alert.alert('Success', 'Prescription added successfully.');
        // Reset form after success
        setDrug('');
        setDose('');
        setDate('');
        setPurpose('');
        setCustomizedPrescription(null);
        setAiMessage('');
      } else {
        Alert.alert('Error', result.message || 'Failed to add prescription.');
      }
    } catch (error) {
      console.error('Error adding prescription', error);
      Alert.alert('Error', 'An error occurred while adding the prescription.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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

        <TextInput
          placeholder="Drug"
          value={drug}
          onChangeText={setDrug}
          style={globalStyles.input}
        />
        <TextInput
          placeholder="Dose"
          value={dose}
          onChangeText={setDose}
          style={globalStyles.input}
        />
        <TextInput
          placeholder="Date"
          value={date}
          onChangeText={setDate}
          style={globalStyles.input}
        />
        <TextInput
          placeholder="Purpose (optional)"
          value={purpose}
          onChangeText={setPurpose}
          style={globalStyles.input}
        />

        <Button title="Validate Prescription" onPress={handleValidate} />

        {customizedPrescription && (
          <View style={globalStyles.card}>
            <Text>AI Message: {aiMessage}</Text>
            <Text>Drug: {customizedPrescription.drug}</Text>
            <Text>Adjusted Dose: {customizedPrescription.adjustedDose}</Text>
          </View>
        )}

        <Button title="Add Prescription" onPress={handleAddPrescription} disabled={!prescriptionValidated} />
      </View>
    </ScrollView>
  );
};

export default PrescriptionScreen;
