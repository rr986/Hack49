import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getUserPatientsFn } from '../services/PatientDataStorage';
import globalStyles from '../styles';

const PatientsScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getUserPatientsFn('WmD4yXXhogKH6DbLRg70');
        setPatients(data || []);
        setFilteredPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients', error);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on the search term
  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = patients.filter((patient) =>
      patient.firstName.toLowerCase().includes(text.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  // Navigate to the selected patient's detail screen
  const handlePatientSelect = (patientId) => {
    navigation.navigate('Patient Detail', { patientId });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Patients</Text>

      {/* Search input */}
      <TextInput
        style={globalStyles.input}
        placeholder="Search by name..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Dropdown for selecting a patient */}
      <Picker
        selectedValue={selectedPatientId}
        onValueChange={(itemValue) => {
          setSelectedPatientId(itemValue);
          handlePatientSelect(itemValue); // Navigate on selecting a patient
        }}
        style={globalStyles.input}
      >
        <Picker.Item label="Select a patient..." value="" />
        {filteredPatients.map((patient) => (
          <Picker.Item
            key={patient.id}
            label={`${patient.firstName} ${patient.lastName}`}
            value={patient.id}
          />
        ))}
      </Picker>

      {/* If a patient is selected, allow clicking on their name to navigate */}
      {selectedPatientId && (
        <TouchableOpacity
          onPress={() => handlePatientSelect(selectedPatientId)}
          style={globalStyles.button}
        >
          <Text style={globalStyles.buttonText}>View Patient Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PatientsScreen;
