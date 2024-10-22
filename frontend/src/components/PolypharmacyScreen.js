import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import { checkPolypharmacyRisksFn } from '../services/PrescriptionValidationService';
import globalStyles from '../styles';

const PolypharmacyScreen = () => {
  const [patientData, setPatientData] = useState({ drugs: [] });
  const [polypharmacyRisk, setPolypharmacyRisk] = useState(null);

  useEffect(() => {
    const samplePatient = {
      id: 1,
      drugs: [
        { name: 'Aspirin', dose: '100mg' },
        { name: 'Warfarin', dose: '5mg' },
        { name: 'Lisinopril', dose: '10mg' },
      ],
    };
    setPatientData(samplePatient);
  }, []);

  const handleCheckPolypharmacy = async () => {
    const result = await checkPolypharmacyRisksFn(patientData.drugs);
    if (result.hasRisk) {
      Alert.alert("Polypharmacy Risk", result.message);
    } else {
      Alert.alert("Safe", "No polypharmacy risks detected.");
    }
    setPolypharmacyRisk(result);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Polypharmacy Check</Text>
      <FlatList
        data={patientData.drugs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text>{item.name} - {item.dose}</Text>
          </View>
        )}
      />
      <Button title="Check for Polypharmacy Risks" onPress={handleCheckPolypharmacy} />
      {polypharmacyRisk && <Text>{polypharmacyRisk.message}</Text>}
    </View>
  );
};

export default PolypharmacyScreen;
