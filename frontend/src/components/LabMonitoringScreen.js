import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { setLabMonitoring } from '../services/LabMonitoringService';
import globalStyles from '../styles';

const LabMonitoringScreen = () => {
  const [monitoringStatus, setMonitoringStatus] = useState(false);

  const handleSetMonitoring = async () => {
    const result = await setLabMonitoring();
    if (result.success) {
      setMonitoringStatus(true);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Lab Monitoring</Text>
      <Button title="Set Monitoring" onPress={handleSetMonitoring} />
      {monitoringStatus && <Text>Lab monitoring is active.</Text>}
    </View>
  );
};

export default LabMonitoringScreen;
