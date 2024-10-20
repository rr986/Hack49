import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import globalStyles from '../styles';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = () => {
      const sampleNotifications = [
        { id: 1, message: 'Drug interaction alert: Aspirin and Warfarin' },
        { id: 2, message: 'Reminder: Review patient X lab results for INR' },
        { id: 3, message: 'Polypharmacy risk detected for patient Y' },
      ];
      setNotifications(sampleNotifications);
    };

    fetchNotifications();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Urgent Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default NotificationsScreen;
