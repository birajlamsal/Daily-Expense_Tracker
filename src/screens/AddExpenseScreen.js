import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseContext } from '../contexts/ExpenseContext';

const AddExpenseScreen = () => {
  const { addExpense, settings } = useContext(ExpenseContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log an Expense</Text>
      <Text style={styles.sub}>Stay within your daily and monthly limits.</Text>
      <ExpenseForm onSubmit={addExpense} currency={settings.currency} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f3ee'
  },
  content: {
    padding: 20
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  sub: {
    color: '#7d6657',
    marginBottom: 16
  }
});

export default AddExpenseScreen;
