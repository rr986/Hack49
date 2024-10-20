/*import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D4059',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#4B778D',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#3FA7D6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#F9F9F9',
    fontWeight: '600',
  },
  card: {
     backgroundColor: '#E4F0F5',
     padding: 15,
     borderRadius: 10,
     marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B3C0C8',
    backgroundColor: '#F4F9F9',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#2D4059',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D4059',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#B3C0C8',
    marginTop: 5,
  },
});

export default globalStyles;

*/

import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 20,
    backgroundColor: '#F4F9F9',
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#2D4059',
    marginBottom: isTablet ? 30 : 20,
    marginTop: 50,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  logoutText: {
    color: '#3FA7D6',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 'auto', // Push the profile image as far right as possible
  },
  text: {
    fontSize: isTablet ? 20 : 18,
    color: '#4B778D',
    lineHeight: isTablet ? 28 : 24,
  },
  button: {
    backgroundColor: '#3FA7D6',
    padding: isTablet ? 20 : 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: isTablet ? 20 : 10,
  },
  buttonText: {
    fontSize: isTablet ? 18 : 16,
    color: '#F9F9F9',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#E4F0F5',
    padding: isTablet ? 20 : 15,
    borderRadius: 10,
    marginBottom: isTablet ? 20 : 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B3C0C8',
    backgroundColor: '#F4F9F9',
    padding: isTablet ? 15 : 10,
    borderRadius: 5,
    fontSize: isTablet ? 18 : 16,
    color: '#2D4059',
    marginBottom: 20,
  },
});

export default globalStyles;
