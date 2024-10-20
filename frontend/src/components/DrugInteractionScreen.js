import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { checkDrugInteractions } from '../services/DrugInteractionService';
import globalStyles from '../styles';

const DrugInteractionScreen = () => {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [interactionData, setInteractionData] = useState(null);

  const handleCheckInteractions = async () => {
    const result = await checkDrugInteractions([drug1, drug2]);
    if (result.hasInteraction) {
      Alert.alert("Warning", result.message);
    } else {
      Alert.alert("Safe", "No drug interactions detected.");
    }
    setInteractionData(result);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Check Drug Interactions</Text>
      <TextInput
        style={globalStyles.input}
        placeholder="Enter first drug"
        value={drug1}
        onChangeText={(text) => setDrug1(text)}
      />
      <TextInput
        style={globalStyles.input}
        placeholder="Enter second drug"
        value={drug2}
        onChangeText={(text) => setDrug2(text)}
      />
      <Button title="Check Interactions" onPress={handleCheckInteractions} />
      {interactionData && <Text>{interactionData.message}</Text>}
    </View>
  );
};

export default DrugInteractionScreen;
