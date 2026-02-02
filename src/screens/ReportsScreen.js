import React, { useContext, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryChart from '../components/CategoryChart';
import LineChart from '../components/LineChart';
import { DEFAULT_CATEGORIES } from '../data/initial';
import { ExpenseContext } from '../contexts/ExpenseContext';
import { daysInMonth, formatReadable, formatMonthReadable, lastNDaysKeys, monthKey, previousMonthKey, todayKey } from '../utils/date';

const ReportsScreen = () => {
  const { expenses, settings } = useContext(ExpenseContext);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [rangeDays, setRangeDays] = useState(7);

  const currentMonth = monthKey(new Date());
  const monthLabel = formatMonthReadable(currentMonth);

  const filteredExpenses = useMemo(() => {
    if (categoryFilter === 'All') return expenses;
    return expenses.filter((item) => item.category === categoryFilter);
  }, [expenses, categoryFilter]);

  const monthExpenses = filteredExpenses.filter((item) => item.month === currentMonth);
  const monthTotal = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const daysElapsed = new Date().getDate();
  const savedToDate = settings.dailyLimit * daysElapsed - monthTotal;

  const prevMonth = previousMonthKey(new Date());
  const prevMonthTotal = expenses
    .filter((item) => item.month === prevMonth)
    .reduce((sum, item) => sum + item.amount, 0);
  const prevMonthSaved = settings.dailyLimit * daysInMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)) - prevMonthTotal;

  const rangeKeys = lastNDaysKeys(rangeDays, new Date());
  const rangeTotals = rangeKeys.map((key) =>
    filteredExpenses
      .filter((item) => item.dateKey === key)
      .reduce((sum, item) => sum + item.amount, 0)
  );

  const rangeChart = useMemo(() => {
    if (rangeDays <= 7) {
      return {
        labels: rangeKeys.map(formatReadable),
        values: rangeTotals
      };
    }
    const bucketCount = 7;
    const size = Math.ceil(rangeKeys.length / bucketCount);
    const labels = [];
    const values = [];
    for (let i = 0; i < rangeKeys.length; i += size) {
      const sliceKeys = rangeKeys.slice(i, i + size);
      const sliceTotals = rangeTotals.slice(i, i + size);
      const avg = sliceTotals.reduce((sum, v) => sum + v, 0) / sliceTotals.length;
      labels.push(`${formatReadable(sliceKeys[0])}–${formatReadable(sliceKeys[sliceKeys.length - 1])}`);
      values.push(Number(avg.toFixed(0)));
    }
    return { labels, values };
  }, [rangeDays, rangeKeys, rangeTotals]);

  const categoryTotals = DEFAULT_CATEGORIES.map((category) => ({
    category,
    amount: monthExpenses
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0)
  })).filter((item) => item.amount > 0);

  const dailyTotals = useMemo(() => {
    const map = {};
    monthExpenses.forEach((item) => {
      map[item.dateKey] = (map[item.dateKey] || 0) + item.amount;
    });
    return Object.keys(map)
      .sort()
      .map((key) => ({ date: key, total: map[key] }));
  }, [monthExpenses]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.sub}>Monthly overview · {monthLabel}</Text>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Total spent</Text>
          <Text style={styles.summaryValue}>{settings.currency} {monthTotal.toFixed(0)}</Text>
        </View>
        <View>
          <Text style={styles.summaryLabel}>Monthly remaining</Text>
          <Text style={styles.summaryValue}>{settings.currency} {(settings.monthlyLimit - monthTotal).toFixed(0)}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Saved so far</Text>
          <Text style={styles.summaryValue}>{settings.currency} {savedToDate.toFixed(0)}</Text>
        </View>
        <View>
          <Text style={styles.summaryLabel}>Saved last month</Text>
          <Text style={styles.summaryValue}>{settings.currency} {prevMonthSaved.toFixed(0)}</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {['All', ...DEFAULT_CATEGORIES].map((item) => (
          <Pressable
            key={item}
            onPress={() => setCategoryFilter(item)}
            style={[styles.filterChip, categoryFilter === item && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, categoryFilter === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.filterRow}>
        {[7, 30, 90].map((days) => (
          <Pressable
            key={days}
            onPress={() => setRangeDays(days)}
            style={[styles.filterChip, rangeDays === days && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, rangeDays === days && styles.filterTextActive]}>
              {days === 7 ? '7 Days' : days === 30 ? '1 Month' : '3 Months'}
            </Text>
          </Pressable>
        ))}
      </View>

      <LineChart
        title={`Last ${rangeDays === 7 ? '7 Days' : rangeDays === 30 ? '1 Month' : '3 Months'} Spending`}
        labels={rangeChart.labels}
        values={rangeChart.values}
      />

      <CategoryChart data={categoryTotals} currency={settings.currency} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Daily Spending Report</Text>
        <Text style={styles.sectionSub}>{todayKey()} current month</Text>
      </View>

      {dailyTotals.length === 0 ? (
        <Text style={styles.emptyText}>No entries yet.</Text>
      ) : (
        dailyTotals.map((item) => (
          <View key={item.date} style={styles.dayRow}>
            <Text style={styles.dayText}>{formatReadable(item.date)}</Text>
            <Text style={styles.dayAmount}>{settings.currency} {item.total.toFixed(0)}</Text>
          </View>
        ))
      )}
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
  summaryCard: {
    backgroundColor: '#fff8f0',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  summaryLabel: {
    color: '#7d6657',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d9c4b2',
    marginRight: 8,
    marginBottom: 8
  },
  filterChipActive: {
    backgroundColor: '#3e2a1f',
    borderColor: '#3e2a1f'
  },
  filterText: {
    color: '#6b4f3b'
  },
  filterTextActive: {
    color: '#fff'
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 6
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3e2a1f'
  },
  sectionSub: {
    color: '#7d6657'
  },
  dayRow: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  dayText: {
    color: '#3e2a1f'
  },
  dayAmount: {
    fontWeight: '700',
    color: '#3e2a1f'
  },
  emptyText: {
    color: '#7d6657'
  }
});

export default ReportsScreen;
