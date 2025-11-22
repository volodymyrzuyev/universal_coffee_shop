import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";



const API_BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://0.0.0.0:8080";

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();


async function handleLogin() {
   
  if (!email || !password) {
    Alert.alert("Missing info", "Please enter both email and password.");
    return;
  } else
  
  {

  }

  setBusy(true);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data?.detail || "Invalid email or password.";
      Alert.alert("Login failed", msg);
      return;
    }
    // Store user_id in secure storage afetrter successful login
    await SecureStore.setItemAsync("user_id", String(data.user_id));

    if (data.mfa_required) {
      router.push({
        pathname: "/mfa",
        params: { challenge_id: data.challenge_id, email },
      });
      return;
    }


    if (data?.user) {
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));
    }
    if (data?.access_token) {
      await SecureStore.setItemAsync("access_token", String(data.access_token));
    }

    router.replace("/home");
  } catch (err) {
    Alert.alert("Network error", String(err?.message || err));
  } finally {
    setBusy(false);
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Log In</Text></View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.button, busy && { opacity: 0.7 }]}
          disabled={busy}
        >
          {busy ? <ActivityIndicator /> : <Text style={styles.buttonText}>Log In</Text>}
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
    width: "100%",
    gap: 12,
    marginTop: 20,
  },

  input: {
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
    marginTop: 16,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Anton-Regular",
  },

  secondaryButtonText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "Anton-Regular",
  },
});