import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import LimitCard from '../components/LimitCard';
import { ExpenseContext } from '../contexts/ExpenseContext';
import { todayKey } from '../utils/date';

const HomeScreen = ({ navigation }) => {
  const { expenses, settings, remainingDaily, remainingMonthly, dailySpent, monthlySpent, dailyAllowance, tomorrowAllowance } = useContext(ExpenseContext);
  const today = todayKey();
  const todayFormatted = useMemo(() => {
    const date = new Date();
    const day = date.getDate();
    const suffix = day >= 11 && day <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th';
    const month = date.toLocaleDateString(undefined, { month: 'short' });
    const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month}, ${weekday} ${year}`;
  }, []);
  const recent = expenses.slice(0, 5);
  const greeting = useMemo(() => (settings.name ? `Hello ${settings.name}` : 'Hello'), [settings.name]);
  const slideAnim = useRef(new Animated.Value(30)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, [slideAnim, opacityAnim]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={recent}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Animated.Text style={[styles.greeting, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
            {greeting}
          </Animated.Text>
          <Text style={styles.headline}>Today</Text>
          <Text style={styles.sub}>{todayFormatted}</Text>

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
              <Text style={styles.statLabel}>Tomorrow's allowance</Text>
              <Text style={styles.statValue}>{settings.currency} {tomorrowAllowance().toFixed(0)}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Spent this month</Text>
              <Text style={styles.statValue}>{settings.currency} {monthlySpent(new Date()).toFixed(0)}</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No expenses logged yet.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>{item.category}</Text>
            <Text style={styles.rowMeta}>{item.dateKey} · {item.paymentMethod}</Text>
            {item.description ? <Text style={styles.rowDesc}>{item.description}</Text> : null}
          </View>
          <Text style={styles.rowAmount}>{settings.currency} {item.amount.toFixed(0)}</Text>
        </View>
      )}
      ListFooterComponent={
        <Pressable style={styles.addButton} onPress={() => navigation.navigate('Add Expense')}>
          <Text style={styles.addText}>Add Expense</Text>
        </Pressable>
      }
    />
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
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6b4f3b',
    marginBottom: 6
  },
  sub: {
    color: '#7d6657',
    marginBottom: 16
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 6
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14
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
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center'
  },
  emptyText: {
    color: '#7d6657'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#5a4636',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2
  },
  rowTitle: {
    fontWeight: '700',
    color: '#3e2a1f'
  },
  rowMeta: {
    color: '#7d6657',
    marginTop: 2
  },
  rowDesc: {
    color: '#5a4636',
    marginTop: 4
  },
  rowAmount: {
    fontWeight: '700',
    color: '#3e2a1f'
  }
});

export default HomeScreen;
