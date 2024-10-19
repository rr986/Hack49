import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your custom components
import HomeScreen from './src/components/HomeScreen';
import HealthDataScreen from './src/components/HealthDataScreen';
import QAndAComponent.js from './src/components/QAndAComponent';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Screen' }}
        />
        <Stack.Screen
          name="HealthData"
          component={HealthDataScreen}
          options={{ title: 'Health Data' }}
        />
        <Stack.Screen
          name="QAndA"
          component={QAndAComponent}
          options={{ title: 'Health Q and A' }}
        />
    </NavigationContainer>
  );
};

export default App;
