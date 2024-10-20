import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/components/HomeScreen';
import PatientsScreen from './src/components/PatientsScreen';
import PatientDetailScreen from './src/components/PatientDetailScreen';
import DrugInteractionScreen from './src/components/DrugInteractionScreen';
import PrescriptionScreen from './src/components/PrescriptionScreen';
import LabMonitoringScreen from './src/components/LabMonitoringScreen';
import NotificationsScreen from './src/components/NotificationsScreen';
import PolypharmacyScreen from './src/components/PolypharmacyScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patients" component={PatientsScreen} />
        <Stack.Screen name="Patient Detail" component={PatientDetailScreen} />
        <Stack.Screen name="Drug Interaction" component={DrugInteractionScreen} />
        <Stack.Screen name="Prescription" component={PrescriptionScreen} />
        <Stack.Screen name="Lab Monitoring" component={LabMonitoringScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Polypharmacy" component={PolypharmacyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
