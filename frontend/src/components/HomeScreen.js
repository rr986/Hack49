import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Add logic to handle logout
    alert('Logged out');
  };

  const handleProfilePress = () => {
    // Add logic to navigate to profile
    alert('Profile clicked');
  };

  return (
    <View style={globalStyles.container}>

      {/* Top Bar with Logout and Profile Icon */}
      <View style={globalStyles.topBar}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={globalStyles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleProfilePress}>
          <Image
            source={require('../utils/assets/images/profile-circle-icon.png')}
            style={globalStyles.profileImage}  // Use the globalStyles for profile image
          />
        </TouchableOpacity>
      </View>

      <Text style={globalStyles.title}>Welcome to the ADE Manager</Text>

      {/* Navigation Buttons */}
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
