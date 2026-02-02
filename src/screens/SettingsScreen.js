import React, { useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { ExpenseContext } from '../contexts/ExpenseContext';

const SettingsScreen = () => {
  const { settings, updateSettings, exportData, importData } = useContext(ExpenseContext);
  const [dailyLimit, setDailyLimit] = useState(String(settings.dailyLimit));
  const [monthlyLimit, setMonthlyLimit] = useState(String(settings.monthlyLimit));
  const [currency, setCurrency] = useState(settings.currency);
  const [name, setName] = useState(settings.name || '');

  const saveLimits = () => {
    const daily = Number(dailyLimit);
    const monthly = Number(monthlyLimit);
    if (!daily || daily <= 0 || !monthly || monthly <= 0) {
      Alert.alert('Invalid limits', 'Daily and monthly limits must be positive numbers.');
      return;
    }
    updateSettings({ dailyLimit: daily, monthlyLimit: monthly, currency: currency || 'Rs.', name: name.trim() });
    Alert.alert('Saved', 'Your limits have been updated.');
  };


  const handleCopy = async () => {
    await Clipboard.setStringAsync(exportData());
    Alert.alert('Copied', 'Your data has been copied to the clipboard.');
  };

  const handleDownload = async () => {
    const filename = `expense-export-${Date.now()}.json`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, exportData(), { encoding: FileSystem.EncodingType.UTF8 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Export Expense Data' });
    } else {
      Alert.alert('Saved', `Export file saved to cache: ${fileUri}`);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true
      });
      if (result.canceled || !result.assets?.length) {
        return;
      }
      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
      importData(content);
      Alert.alert('Import complete', 'Your data has been restored.');
    } catch (error) {
      Alert.alert('Import failed', error.message || 'Invalid data.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>Control limits, currency, and security.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          style={styles.input}
        />
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
        <Text style={styles.label}>Export / Import Data</Text>
        <Text style={styles.helper}>Use JSON to move data between devices.</Text>
        <View style={styles.pinRow}>
          <Pressable style={styles.saveButton} onPress={handleDownload}>
            <Text style={styles.saveText}>Download</Text>
          </Pressable>
          <Pressable style={styles.altButton} onPress={handleCopy}>
            <Text style={styles.altText}>Copy</Text>
          </Pressable>
        </View>
        <Pressable style={styles.saveButton} onPress={handleImport}>
          <Text style={styles.saveText}>Import</Text>
        </Pressable>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
