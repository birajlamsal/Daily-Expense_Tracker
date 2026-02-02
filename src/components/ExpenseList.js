import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { formatReadable } from '../utils/date';

const ExpenseList = ({ expenses, currency }) => {
  if (!expenses.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No expenses logged yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>{item.category}</Text>
            <Text style={styles.meta}>{formatReadable(item.dateKey)} · {item.paymentMethod}</Text>
            {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
          </View>
          <Text style={styles.amount}>{currency} {item.amount.toFixed(0)}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontWeight: '700',
    color: '#3e2a1f'
  },
  meta: {
    color: '#7d6657',
    marginTop: 2
  },
  desc: {
    color: '#5a4636',
    marginTop: 4
  },
  amount: {
    fontWeight: '700',
    color: '#3e2a1f'
  }
});

export default ExpenseList;
