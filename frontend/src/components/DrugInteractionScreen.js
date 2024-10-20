//Has method to use backend to check if new drug has been added in real time and check against other drugs, also allows doctor to check drug against other if wants to do manually
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { checkDrugInteractions } from '../services/DrugInteractionService';

const DrugInteractionScreen = () => {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [interactionData, setInteractionData] = useState(null);

  const handleCheckInteractions = async () => {
    const result = await checkDrugInteractions([drug1, drug2]);  // Example: Checking interaction between two drugs
    if (result.hasInteraction) {
      Alert.alert("Warning", result.message);
    } else {
      Alert.alert("Safe", "No drug interactions detected.");
    }
    setInteractionData(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Drug Interactions</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter first drug"
        value={drug1}
        onChangeText={(text) => setDrug1(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter second drug"
        value={drug2}
        onChangeText={(text) => setDrug2(text)}
      />
      <Button title="Check Interactions" onPress={handleCheckInteractions} />
      {interactionData && <Text>{interactionData.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 },
});

export default DrugInteractionScreen;
