import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { logoutUser } from '../services/LoginService';  // Assuming logoutUser is defined
import globalStyles from '../styles';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error("Error logging out", error);
      alert('Logout failed');
    }
  };

  const handleProfilePress = () => {
    // Logic to navigate to profile screen
    alert('Profile clicked');
  };

  return (
    <View style={globalStyles.container}>

      <View style={globalStyles.topBar}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={globalStyles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={require('../utils/assets/images/profile-circle-icon.png')}
            style={globalStyles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <Text style={globalStyles.title}>Welcome to the ADE Manager</Text>

      <Button title="Patients" onPress={() => navigation.navigate('Patients')} />
      <Button title="Drug Interactions" onPress={() => navigation.navigate('Drug Interaction')} />
      <Button title="Prescription" onPress={() => navigation.navigate('Prescription')} />
      <Button title="Lab Monitoring" onPress={() => navigation.navigate('Lab Monitoring')} />
      <Button title="Polypharmacy" onPress={() => navigation.navigate('Polypharmacy')} />
      <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} />
    </View>
  );
};

export default HomeScreen;
