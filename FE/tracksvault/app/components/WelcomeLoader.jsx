import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeLoading() {
  return (
    <LinearGradient
      colors={['#000000', '#3a3a3a']}
      style={styles.container}
    >
      <Text style={styles.text}>Welcome</Text>
      <ActivityIndicator size="large" color="#ccc" style={styles.loader} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#e0e0e0',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});
