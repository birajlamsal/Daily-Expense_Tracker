import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExpenseContext } from '../contexts/ExpenseContext';

const LockScreen = () => {
  const { unlock } = useContext(ExpenseContext);
  const [pin, setPin] = useState('');

  const handleUnlock = () => {
    const ok = unlock(pin);
    if (!ok) {
      Alert.alert('Incorrect PIN', 'Please try again.');
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Expense Tracker</Text>
      <Text style={styles.sub}>Enter your PIN to continue</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
        placeholder="PIN"
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={handleUnlock}>
        <Text style={styles.buttonText}>Unlock</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ee',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
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
  input: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#f0e0d0',
    textAlign: 'center'
  },
  button: {
    marginTop: 16,
    backgroundColor: '#3e2a1f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700'
  }
});

export default LockScreen;
