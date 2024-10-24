import { getNotificationsForUserFn } from '../services/NotificationsService';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, FlatList } from 'react-native';
import globalStyles from '../styles';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userID = 'WmD4yXXhogKH6DbLRg70';
        const fetchedNotifications = await getNotificationsForUserFn(userID);

        const notificationsArray = fetchedNotifications.Notifications.map((message, index) => ({
          id: index + 1,
          message,
        }));

        setNotifications(notificationsArray);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
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
