import React from "react";
import { View, Text, StyleSheet } from "react-native";

const About: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Universal Coffee Shop</Text>
      <Text style={styles.text}>
        This mobile app is part of the IT 426 – Advanced Software Engineering 
        project (Fall 2025). It demonstrates how modern teams combine front-end 
        and back-end development using React Native, FastAPI, and agile principles.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF8F0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6B4226",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
});

export default About;
