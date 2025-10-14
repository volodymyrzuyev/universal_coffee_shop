import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Universal Coffee Shop</Text>
      <Text style={styles.text}>
        This app was developed for IT 426 Fall 2025 to demonstrate software 
        engineering concepts such as system design, requirements engineering, 
        and agile development.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#555' },
});
