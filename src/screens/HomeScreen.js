import React, { useContext } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import LimitCard from '../components/LimitCard';
import ExpenseList from '../components/ExpenseList';
import { ExpenseContext } from '../contexts/ExpenseContext';
import { todayKey } from '../utils/date';

const HomeScreen = ({ navigation }) => {
  const { expenses, settings, remainingDaily, remainingMonthly, dailySpent, monthlySpent, dailyAllowance } = useContext(ExpenseContext);
  const today = todayKey();
  const recent = expenses.slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headline}>Today</Text>
      <Text style={styles.sub}>{today}</Text>

      <LimitCard
        title="Daily Allowance (Rolling)"
        limit={dailyAllowance(today)}
        remaining={remainingDaily(today)}
        currency={settings.currency}
      />
      <LimitCard
        title="Monthly Limit"
        limit={settings.monthlyLimit}
        remaining={remainingMonthly(new Date())}
        currency={settings.currency}
      />

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Spent today</Text>
          <Text style={styles.statValue}>{settings.currency} {dailySpent(today).toFixed(0)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Spent this month</Text>
          <Text style={styles.statValue}>{settings.currency} {monthlySpent(new Date()).toFixed(0)}</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <Pressable onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.link}>View reports</Text>
        </Pressable>
      </View>
      <ExpenseList expenses={recent} currency={settings.currency} />

      <Pressable style={styles.addButton} onPress={() => navigation.navigate('Add Expense')}>
        <Text style={styles.addText}>Add Expense</Text>
      </Pressable>
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
  headline: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  sub: {
    color: '#7d6657',
    marginBottom: 16
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    marginRight: 10
  },
  statLabel: {
    color: '#7d6657',
    fontSize: 12
  },
  statValue: {
    marginTop: 6,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  link: {
    color: '#c0835a',
    fontWeight: '700'
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#3e2a1f',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center'
  },
  addText: {
    color: '#fff',
    fontWeight: '700'
  }
});

export default HomeScreen;
