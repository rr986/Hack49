import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, ScrollView } from 'react-native';
import { checkDrugInteractionsFn } from '../services/DrugInteractionService';
import globalStyles from '../styles';

const DrugInteractionScreen = () => {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [interactionData, setInteractionData] = useState(null);

  const handleCheckInteractions = async () => {
    try {
      const result = await checkDrugInteractionsFn([drug1, drug2]);
      if (result.hasInteraction) {
        Alert.alert("Warning", result.message);
      } else {
        Alert.alert("Safe", "No drug interactions detected.");
      }
      setInteractionData(result);
    } catch (error) {
      Alert.alert("Error", "Failed to check drug interactions.");
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
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

      {interactionData && (
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Interaction Results</Text>
          <Text>{interactionData.message}</Text>
          {interactionData.interactions && interactionData.interactions.map((interaction, index) => (
            <View key={index}>
              <Text style={globalStyles.text}>{interaction.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default DrugInteractionScreen;
