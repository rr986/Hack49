import { getNotificationsForUserFn } from '../services/NotificationService'; // Update import

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userID = 'WmD4yXXhogKH6DbLRg70';  // Replace with actual userID
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
