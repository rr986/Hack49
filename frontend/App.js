import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from "firebase/app";  // Import Firebase functions
import { getAnalytics } from "firebase/analytics";  // Optional, only if you're using Analytics
// Import getAnalytics only for the web
import { Platform } from 'react-native';  // Use Platform API to check if it's web

// Import your screens
import HomeScreen from './src/components/HomeScreen';
import PatientsScreen from './src/components/PatientsScreen';
import PatientDetailScreen from './src/components/PatientDetailScreen';
import DrugInteractionScreen from './src/components/DrugInteractionScreen';
import PrescriptionScreen from './src/components/PrescriptionScreen';
import LabMonitoringScreen from './src/components/LabMonitoringScreen';
import NotificationsScreen from './src/components/NotificationsScreen';
import PolypharmacyScreen from './src/components/PolypharmacyScreen';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLq3wooKWJr7fsk_GiqDYROOxOy78d6Mw",
  authDomain: "ade-manager.firebaseapp.com",
  projectId: "ade-manager",
  storageBucket: "ade-manager.appspot.com",
  messagingSenderId: "840153785316",
  appId: "1:840153785316:web:350950aefc362b1b929df1",
  measurementId: "G-1YRG7MEH12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: If using analytics, initialize it like this (but only if you're on the web platform)
if (typeof window !== "undefined") {
  const analytics = getAnalytics(app);
}

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
