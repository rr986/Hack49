//probably will not use
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { loginUser, getUserData } from '../services/LoginService';
import globalStyles from '../styles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const user = await loginUser(email, password);
      const userData = await getUserData(user.uid);
      console.log('User data:', userData);

      setLoading(false);

      // Navigate to Home screen with user data
      navigation.navigate('Home', { user: userData });
    } catch (error) {
      setLoading(false);
      Alert.alert('Login failed', error.message);
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={globalStyles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={globalStyles.input}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#3FA7D6" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
    </View>
  );
};

export default LoginScreen;
