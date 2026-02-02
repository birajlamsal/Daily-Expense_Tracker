import React, { useContext } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseContext } from '../contexts/ExpenseContext';
const backIconUri = Asset.fromModule(require('../../Images/back.svg')).uri;

const AddExpenseScreen = ({ navigation }) => {
  const { addExpense, settings } = useContext(ExpenseContext);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Log an Expense</Text>
      {Platform.OS === 'ios' ? (
        <View style={styles.backRow}>
          <Pressable onPress={() => navigation.goBack()}>
            <View style={styles.backButton}>
              <View style={styles.backIcon}>
                <SvgUri width={18} height={18} uri={backIconUri} />
              </View>
              <Text style={styles.backText}>Back</Text>
            </View>
          </Pressable>
        </View>
      ) : null}
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
