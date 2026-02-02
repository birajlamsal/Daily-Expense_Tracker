import React, { useContext } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseContext } from '../contexts/ExpenseContext';
import { backSvg } from '../utils/icons';

const AddExpenseScreen = ({ navigation }) => {
  const { addExpense, settings } = useContext(ExpenseContext);

  const handleSubmit = (payload) => {
    const result = addExpense(payload);
    if (result?.ok) {
      navigation.goBack();
    }
    return result;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Log an Expense</Text>
        {Platform.OS === 'ios' ? (
          <View style={styles.backRow}>
            <Pressable onPress={() => navigation.goBack()}>
              <View style={styles.backButton}>
                <View style={styles.backIcon}>
                  <SvgXml width={18} height={18} xml={backSvg} />
                </View>
                <Text style={styles.backText}>Back</Text>
              </View>
            </Pressable>
          </View>
        ) : null}
        <Text style={styles.sub}>Stay within your daily and monthly limits.</Text>
        <ExpenseForm onSubmit={handleSubmit} currency={settings.currency} />
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
    padding: 20
  },
  backRow: {
    marginTop: 10,
    marginBottom: 6
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIcon: {
    marginRight: 6
  },
  backText: {
    color: '#c0835a',
    fontWeight: '700'
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
