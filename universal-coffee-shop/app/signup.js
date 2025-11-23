import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

const API_BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://127.0.0.1:8080";

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

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.detail || "Sign-up failed.";
        Alert.alert("Error", msg);
        return;
      }

      Alert.alert("Success", "Account created! Please log in.");
      router.replace("/login-form");
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
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
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
    flex: 2,
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
    paddingTop: 20,
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
    marginBottom: 25,
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
    fontSize: 12,
    fontFamily: "Anton-Regular",
  },
});