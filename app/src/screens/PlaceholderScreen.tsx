import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Parallel Universe AI</Text>
      <Text style={styles.subText}>Setup Complete!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#AAAAAA',
  },
});

export default PlaceholderScreen;
