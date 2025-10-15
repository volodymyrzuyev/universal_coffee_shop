import { useState } from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';

//Theme components for consistent styling
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';

// TODO: Integrate with backend API (Python FastAPI in /app)
export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Placeholder for backend integration

  //Handle if a user missed an input
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);

    // TODO: Replace with actual API call to backend
    //Still need some sort of time out here --
    setTimeout(() => {
      setLoading(false);
      alert(`Login attempted for ${username} (integration pending)`);
    }, 1000);
  };
//basic login screen layout for now we'll add to this 
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>
      {error ? <ThemedText style={{ color: 'red' }}>{error}</ThemedText> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
      {/* TODO: Add navigation to registration screen */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});