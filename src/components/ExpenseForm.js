import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { DEFAULT_CATEGORIES, DEFAULT_PAYMENT_METHODS } from '../data/initial';
import { todayKey } from '../utils/date';

const ExpenseForm = ({ onSubmit, currency }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayKey());
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHODS[0]);
  const [description, setDescription] = useState('');

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  const handleSubmit = () => {
    if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Invalid date', 'Use format YYYY-MM-DD.');
      return;
    }

    const payload = {
      amount: parsedAmount,
      date: new Date(`${date}T12:00:00`),
      category,
      paymentMethod,
      description: description.trim()
    };

    const result = onSubmit(payload);
    if (result?.ok) {
      setAmount('');
      setDescription('');
      setDate(todayKey());
      setCategory(DEFAULT_CATEGORIES[0]);
      setPaymentMethod(DEFAULT_PAYMENT_METHODS[0]);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder={`${currency} 0`}
        style={styles.input}
      />

      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="2026-02-02"
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipsRow}>
        {DEFAULT_CATEGORIES.map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategory(item)}
            style={[styles.chip, category === item && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.chipsRow}>
        {DEFAULT_PAYMENT_METHODS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setPaymentMethod(item)}
            style={[styles.chip, paymentMethod === item && styles.chipActive]}
          >
            <Text style={[styles.chipText, paymentMethod === item && styles.chipTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Lunch at restaurant"
        style={styles.input}
      />

      <Pressable style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Log Expense</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff8f0',
    padding: 16,
    borderRadius: 18
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#6b4f3b',
    marginTop: 14
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d9c4b2',
    marginRight: 8,
    marginBottom: 8
  },
  chipActive: {
    backgroundColor: '#c0835a',
    borderColor: '#c0835a'
  },
  chipText: {
    color: '#6b4f3b'
  },
  chipTextActive: {
    color: '#fff'
  },
  submit: {
    marginTop: 18,
    backgroundColor: '#3e2a1f',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center'
  },
  submitText: {
    color: '#fff',
    fontWeight: '700'
  }
});

export default ExpenseForm;
