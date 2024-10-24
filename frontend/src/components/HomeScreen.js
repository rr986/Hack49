import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { loginUserFn, logoutUserFn, getUserDetailsFn } from '../services/LoginService';  // Assuming logoutUser is defined
import globalStyles from '../styles';

const HomeScreen = ({ navigation }) => {
        const [userDetails, setUserDetails] = useState(null);

        useEffect(() => {
            const autoLogin = async () => {
                try {

                    const email = 'user@health.edu';
                    const password = 'password';

                    // Log the email and password to verify
                    console.log('Email:', email);
                    console.log('Password:', password);

                    // Automatically log in the user with the email and password
                    const userCredential = await loginUserFn(email, password);
                    console.log('Auto-login successful:', userCredential);

                    // Fetch additional user details after successful login
                    const userData = await getUserDetailsFn(email, password);
                    console.log('User details fetched:', userData);
                    setUserDetails(userData);
                } catch (error) {
                    console.error('Error in auto-login:', error);
                }
            };

            autoLogin();
        }, []);

    const handleLogout = async () => {
        try {
            await logoutUserFn(userDetails?.userID);
            console.log('User logged out');
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
