import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExpenseContext } from '../contexts/ExpenseContext';

const LoginScreen = () => {
  const { login, user } = useContext(ExpenseContext);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);

  const handleLogin = () => {
    const ok = login(username.trim(), password);
    if (!ok) {
      Alert.alert('Login failed', 'Invalid username or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker Login</Text>
      <Text style={styles.sub}>Use the demo account to explore features.</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Text style={styles.demo}>Demo: {user.username} / {user.password}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  sub: {
    color: '#7d6657',
    marginTop: 6,
    marginBottom: 16
  },
  label: {
    alignSelf: 'flex-start',
    color: '#6b4f3b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    marginTop: 8
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#f0e0d0',
    marginTop: 8
  },
  button: {
    marginTop: 16,
    backgroundColor: '#3e2a1f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  },
  demo: {
    marginTop: 12,
    color: '#7d6657'
  }
});

export default LoginScreen;
