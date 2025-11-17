import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const API_BASE =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://192.168.1.164:8080";

export default function MFAScreen() {
  const { challenge_id, email } = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

 async function handleVerify() {
  if (!code) {
    Alert.alert("Missing code", "Please enter the 6-digit code");
    return;
  }

  setBusy(true);

  try {
    const res = await fetch(`${API_BASE}/auth/mfa/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challenge_id,
        code,
      }),
    });

    const data = await res.json().catch(() => ({}));
    console.log("MFA verify response:", data); 

    if (!res.ok) {
      Alert.alert(
        "Verification failed",
        data?.detail || "Invalid or expired code"
      );
      return;
    }

    try {
      if (data?.token && SecureStore?.setItemAsync) {
        await SecureStore.setItemAsync("access_token", String(data.token));
      }
      if (data?.user_id && SecureStore?.setItemAsync) {
        await SecureStore.setItemAsync("user_id", String(data.user_id));
      }
      if (data?.is_admin !== undefined && SecureStore?.setItemAsync) {
        await SecureStore.setItemAsync(
          "is_admin",
          JSON.stringify(data.is_admin)
        );
      }
    } catch (err) {
      console.log("SecureStore error (ignored on web):", err);

    }

    console.log("Navigating to /home now...");
    router.replace("/home");
  } catch (e) {
    console.error("MFA verify error:", e);
    Alert.alert("Error", String(e?.message || e));
  } finally {
    setBusy(false);
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Code</Text>
        <Text>We sent a code to {email}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="6-digit code"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleVerify}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Verify</Text>
          )}
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
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
