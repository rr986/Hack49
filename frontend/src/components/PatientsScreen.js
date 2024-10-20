import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getHealthData } from '../services/HealthDataStorage';

const PatientsScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const data = await getHealthData();
      setPatients(data || []);
      setFilteredPatients(data || []);
    };
    fetchPatients();
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
    const filtered = patients.filter(patient =>
      patient.firstName.toLowerCase().includes(text.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handlePatientPress = (patient) => {
    navigation.navigate('Patient Detail', { patient });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePatientPress(item)}>
            <View style={styles.patientCard}>
              <Text>{item.firstName} {item.lastName}</Text>
              <Text>Admit Reason: {item.admitReason}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  searchInput: { marginBottom: 20, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  patientCard: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
});

export default PatientsScreen;
