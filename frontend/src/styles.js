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
  button: {
    alignItems: 'center',
    backgroundColor: '#3FA7D6',
    borderRadius: 10,
    marginTop: isTablet ? 20 : 10,
    padding: isTablet ? 20 : 15,
  },
  buttonText: {
    color: '#F9F9F9',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#E4F0F5',
    borderRadius: 10,
    marginBottom: isTablet ? 20 : 15,
    padding: isTablet ? 20 : 15,
  },
  container: {
    backgroundColor: '#F4F9F9',
    flex: 1,
    padding: isTablet ? 40 : 20,
  },
  input: {
    backgroundColor: '#F4F9F9',
    borderColor: '#B3C0C8',
    borderRadius: 5,
    borderWidth: 1,
    color: '#2D4059',
    fontSize: isTablet ? 18 : 16,
    marginBottom: 20,
    padding: isTablet ? 15 : 10,
  },
  logoutText: {
    color: '#3FA7D6',
    fontWeight: 'bold',
  },
  profileImage: {
    borderRadius: 20,
    height: 40,
    marginLeft: 'auto',
    width: 40,
  },
  text: {
    color: '#4B778D',
    fontSize: isTablet ? 20 : 18,
    lineHeight: isTablet ? 28 : 24,
  },
  title: {
    color: '#2D4059',
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: isTablet ? 30 : 20,
    marginTop: 50,
    textAlign: 'center',
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 20,
    position: 'absolute',
    right: 20,
    top: 20,
    width: '100%',
  },

});

export default globalStyles;
