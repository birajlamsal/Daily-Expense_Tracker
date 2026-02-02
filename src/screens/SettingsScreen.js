import React, { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ExpenseContext } from '../contexts/ExpenseContext';

const SettingsScreen = () => {
  const { settings, updateSettings, enablePin, disablePin, logout, user } = useContext(ExpenseContext);
  const [dailyLimit, setDailyLimit] = useState(String(settings.dailyLimit));
  const [monthlyLimit, setMonthlyLimit] = useState(String(settings.monthlyLimit));
  const [currency, setCurrency] = useState(settings.currency);
  const [pin, setPin] = useState('');

  const saveLimits = () => {
    const daily = Number(dailyLimit);
    const monthly = Number(monthlyLimit);
    if (!daily || daily <= 0 || !monthly || monthly <= 0) {
      Alert.alert('Invalid limits', 'Daily and monthly limits must be positive numbers.');
      return;
    }
    updateSettings({ dailyLimit: daily, monthlyLimit: monthly, currency: currency || 'Rs.' });
    Alert.alert('Saved', 'Your limits have been updated.');
  };

  const handlePinEnable = () => {
    if (pin.length < 4) {
      Alert.alert('PIN too short', 'Use at least 4 digits.');
      return;
    }
    enablePin(pin);
    setPin('');
    Alert.alert('PIN enabled', 'You will be asked for a PIN when the app opens.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>Control limits, currency, and security.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.helper}>{user.username}</Text>
        <Pressable style={styles.altButton} onPress={logout}>
          <Text style={styles.altText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily limit</Text>
        <TextInput
          value={dailyLimit}
          onChangeText={setDailyLimit}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.label}>Monthly limit</Text>
        <TextInput
          value={monthlyLimit}
          onChangeText={setMonthlyLimit}
          keyboardType="numeric"
          style={styles.input}
        />
        <Text style={styles.label}>Currency prefix</Text>
        <TextInput
          value={currency}
          onChangeText={setCurrency}
          placeholder="Rs."
          style={styles.input}
        />
        <Pressable style={styles.saveButton} onPress={saveLimits}>
          <Text style={styles.saveText}>Save Limits</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>App PIN</Text>
        <Text style={styles.helper}>Optional lock for sensitive spending data.</Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="numeric"
          placeholder="Enter 4+ digit PIN"
          style={styles.input}
        />
        <View style={styles.pinRow}>
          <Pressable style={styles.saveButton} onPress={handlePinEnable}>
            <Text style={styles.saveText}>Enable PIN</Text>
          </Pressable>
          <Pressable style={styles.altButton} onPress={disablePin}>
            <Text style={styles.altText}>Disable PIN</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ee'
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  sub: {
    color: '#7d6657',
    marginBottom: 16
  },
  card: {
    backgroundColor: '#fff8f0',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#6b4f3b',
    marginTop: 8
  },
  helper: {
    color: '#7d6657',
    marginTop: 6
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#f0e0d0'
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#3e2a1f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1
  },
  saveText: {
    color: '#fff',
    fontWeight: '700'
  },
  altButton: {
    marginTop: 16,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#3e2a1f',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1
  },
  altText: {
    color: '#3e2a1f',
    fontWeight: '700'
  },
  pinRow: {
    flexDirection: 'row'
  }
});

export default SettingsScreen;
