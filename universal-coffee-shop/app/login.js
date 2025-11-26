//login screen
// universal-coffee-shop/app/login.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UNIVERSAL</Text>
        <Text style={styles.stylizedTitle}>COFFEE SHOP</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('/signup')}>
          <Text style={styles.primaryButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/login-form')}>
          <Text style={styles.secondaryButtonText}>
            ALREADY HAVE AN ACCOUNT? LOG IN
          </Text>
        </TouchableOpacity>
      </View>
      
          <TouchableOpacity  
          onPress={() => router.push('/AddCoffeeShop')}>
          <Text >ADD COFFEESHOP DEV ONLY</Text>
        </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    color: '#000',
    fontFamily: 'Anton-Regular',
    textAlign: 'center',
    lineHeight: 50,
  },
  stylizedTitle: {
    fontSize: 54,
    fontFamily: 'Canopee',
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Anton-Regular',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Anton-Regular',
  },
});