import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { checkPolypharmacyRisks } from '../services/PrescriptionValidationService';

const PolypharmacyScreen = () => {
  const [patientData, setPatientData] = useState({ drugs: [] });
  const [polypharmacyRisk, setPolypharmacyRisk] = useState(null);

  useEffect(() => {
    // Simulate fetching patient drugs
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
    const result = await checkPolypharmacyRisks(patientData.drugs);
    if (result.hasRisk) {
      Alert.alert("Polypharmacy Risk", result.message);
    } else {
      Alert.alert("Safe", "No polypharmacy risks detected.");
    }
    setPolypharmacyRisk(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Polypharmacy Check</Text>
      <FlatList
        data={patientData.drugs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.drugCard}>
            <Text>{item.name} - {item.dose}</Text>
          </View>
        )}
      />
      <Button title="Check for Polypharmacy Risks" onPress={handleCheckPolypharmacy} />
      {polypharmacyRisk && <Text>{polypharmacyRisk.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  drugCard: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
});

export default PolypharmacyScreen;
