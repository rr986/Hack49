import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { setLabMonitoringFn, getPatientLabDataFn } from '../services/LabMonitoringService';
import { getUserPatientsFn } from '../services/PatientDataStorage';
import globalStyles from '../styles';

const LabMonitoringScreen = () => {
  const [monitoringStatus, setMonitoringStatus] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [labData, setLabData] = useState(null);  // State for lab data

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const userID = 'WmD4yXXhogKH6DbLRg70'; // Replace with your actual user ID
        const data = await getUserPatientsFn(userID);
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        Alert.alert('Error', 'Failed to fetch patients.');
      }
    };

    fetchPatients();
  }, []);

  // Handle selecting a patient and fetching their lab data
  const handlePatientSelect = async (patientId) => {
    setSelectedPatientId(patientId);
    if (patientId) {
      try {
        const data = await getPatientLabDataFn(patientId);
        setLabData(data);
      } catch (error) {
        console.error('Error fetching lab data:', error);
        Alert.alert('Error', 'Failed to fetch lab data.');
      }
    } else {
      setLabData(null);
    }
  };

  // Handle setting lab monitoring for the selected patient
  const handleSetMonitoring = async () => {
    if (!selectedPatientId) {
      Alert.alert('Error', 'Please select a patient before setting lab monitoring.');
      return;
    }

    try {
      const monitoringData = {
        monitoringStatus: true,
        patientID: selectedPatientId,
        testName: "INR",
      };
      const result = await setLabMonitoringFn(selectedPatientId, monitoringData);

      if (result.success) {
        setMonitoringStatus(true);
        Alert.alert('Success', 'Lab monitoring is active for selected patient.');
      }
    } catch (error) {
      console.error('Error setting lab monitoring:', error);
      Alert.alert('Error', 'Failed to set lab monitoring.');
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Lab Monitoring</Text>

      <Picker
        selectedValue={selectedPatientId}
        onValueChange={(itemValue) => handlePatientSelect(itemValue)}
        style={globalStyles.input}
      >
        <Picker.Item label="Select a patient..." value="" />
        {patients.map((patient) => (
          <Picker.Item
            key={patient.id}
            label={`${patient.firstName} ${patient.lastName}`}
            value={patient.id}
          />
        ))}
      </Picker>

      {labData && (
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Lab Data for Selected Patient:</Text>
          <Text>Test Name: {labData.testName}</Text>
          <Text>Monitoring Status: {labData.monitoringStatus ? 'Active' : 'Inactive'}</Text>
        </View>
      )}

      <Button title="Set Monitoring" onPress={handleSetMonitoring} />

      {monitoringStatus && (
        <Text>Lab monitoring is active for the selected patient (Test: INR).</Text>
      )}
    </View>
  );
};

export default LabMonitoringScreen;
