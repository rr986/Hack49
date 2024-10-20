import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate fetching notifications from the backend or local storage
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
    <View style={styles.container}>
      <Text style={styles.title}>Urgent Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  notificationCard: { padding: 15, backgroundColor: '#f0f0f0', marginBottom: 10, borderRadius: 5 },
});

export default NotificationsScreen;
