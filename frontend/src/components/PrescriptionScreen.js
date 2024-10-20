import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { validatePrescriptionInput, customizePrescriptionForPatient } from '../services/PrescriptionValidationService';
import globalStyles from '../styles';

const PrescriptionScreen = () => {
  const [drug, setDrug] = useState('');
  const [dose, setDose] = useState('');
  const [age, setAge] = useState('');
  const [kidneyFunction, setKidneyFunction] = useState('');
  const [prescription, setPrescription] = useState({});

  const handleValidate = async () => {
    const validationErrors = await validatePrescriptionInput({ drug, dose, age, kidneyFunction });
    if (validationErrors.length) {
      Alert.alert("Validation Errors", validationErrors.join("\n"));
    } else {
      const customizedPrescription = await customizePrescriptionForPatient({ drug, dose, age, kidneyFunction });
      setPrescription(customizedPrescription);
      Alert.alert("Prescription Validated", `Customized Prescription: ${JSON.stringify(customizedPrescription)}`);
    }
  };

  return (
    <View style={globalStyles.container}>
      <TextInput placeholder="Drug" onChangeText={(text) => setDrug(text)} style={globalStyles.input} />
      <TextInput placeholder="Dose" onChangeText={(text) => setDose(text)} style={globalStyles.input} />
      <TextInput placeholder="Age" onChangeText={(text) => setAge(text)} style={globalStyles.input} />
      <TextInput placeholder="Kidney Function" onChangeText={(text) => setKidneyFunction(text)} style={globalStyles.input} />
      <Button title="Validate Prescription" onPress={handleValidate} />
      {prescription && (
        <View style={globalStyles.card}>
          <Text>Drug: {prescription.drug}</Text>
          <Text>Adjusted Dose: {prescription.adjustedDose}</Text>
        </View>
      )}
    </View>
  );
};

export default PrescriptionScreen;
