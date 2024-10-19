import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the ADE Manager</Text>
      <Button title="Patients" onPress={() => navigation.navigate('Patients')} />
      <Button title="Drug Interactions" onPress={() => navigation.navigate('Drug Interaction')} />
      <Button title="Prescription" onPress={() => navigation.navigate('Prescription')} />
      <Button title="Lab Monitoring" onPress={() => navigation.navigate('Lab Monitoring')} />
      <Button title="Polypharmacy" onPress={() => navigation.navigate('Polypharmacy')} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default HomeScreen;
