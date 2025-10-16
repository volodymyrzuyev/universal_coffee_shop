// universal-coffee-shop/app/launch.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LaunchScreen() {
  const router = useRouter();

  // Pan gesture.... i couldn't get swipe to work
  // This gesture activates when you drag your finger up by at least 10 pixels.
  const onPanUp = Gesture.Pan()
    .activeOffsetY(-10) // Activates when swiping up
    .onEnd(() => {
      router.push('/login');
    });

  return (
    <GestureDetector gesture={onPanUp}>
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>THE</Text>
          <Text style={styles.title}>WORLD</Text>
          <Text style={styles.title}>RUNS ON</Text>
          <Text style={styles.stylizedTitle}>COFFEE</Text>
          <Text style={styles.stylizedTitle}>SHOPS</Text>
        </View>
        <Text style={styles.swipeUpText}>SWIPE UP</Text>
      </SafeAreaView>
    </GestureDetector>
  );
}

// styling for page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 64,
    color: '#000000',
    fontFamily: 'Anton-Regular',
    lineHeight: 70,
    textTransform: 'uppercase',
  },
  stylizedTitle: {
    fontSize: 72,
    fontFamily: 'Canopee',
  },
  swipeUpText: {
    fontSize: 14,
    color: '#000000',
    letterSpacing: 2,
    fontFamily: 'Anton-Regular',
  },
});