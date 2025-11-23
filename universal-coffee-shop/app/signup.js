import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

const API_BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://192.168.1.175:8080";

export default function Signup() {
  const router = useRouter();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);


  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }

    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      //This contains the data send from the endpoint '/auth/register'
      const data = await res.json().catch(() => ({}));
      
      //this hits if the user tried to create an account with an email
      //that already exists and blocks them from doing so
      if (data.uniqueEmail == false) {
         Alert.alert("An account with this email already exist");
        return;
      }
      //This executes if the user enters information with a brand new
      // unique email
      else if(data.uniqueEmail == true){
        Alert.alert("Success", "Account created! Please log in.");
        router.replace("/login-form");
      }

    //this hits if theres a network error   
    } catch (err) {
      Alert.alert("Network error", String(err?.message || err));
    } finally {
      setBusy(false);
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Create Account</Text></View>

      <View style={styles.form}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={"grey"}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={"grey"}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={"grey"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleSignup}
          style={[styles.button, busy && { opacity: 0.7 }]}
          disabled={busy}
        >
          {busy ? <ActivityIndicator /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login-form")}>
          <Text style={styles.switchText}>Already have an account? Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 48,
    color: "#000",
    fontFamily: "Anton-Regular",
    textAlign: "center",
    lineHeight: 50,
  },

  stylizedTitle: {
    fontSize: 54,
    fontFamily: "Canopee",
    textAlign: "center",
  },

  form: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 1,
    width: "100%",
    gap: 12,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },

  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 15,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Anton-Regular",
  },

  switchText: {
    textAlign: "center",
    color: "#000",
    fontSize: 14,
    fontFamily: "Anton-Regular",
  },
  backText: {
    textAlign: "center",
    marginTop: 12,
    color: "#000",
    fontSize: 14,
    fontFamily: "Anton-Regular",
  },
});