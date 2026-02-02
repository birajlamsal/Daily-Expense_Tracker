import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LimitCard = ({ title, limit, remaining, currency }) => {
  const spent = limit - remaining;
  const ratio = limit > 0 ? Math.min(spent / limit, 1) : 0;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{currency} {remaining.toFixed(0)} remaining</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.sub}>{currency} {spent.toFixed(0)} spent of {currency} {limit.toFixed(0)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff8f0',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#5a4636',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3
  },
  title: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6b4f3b'
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e2a1f',
    marginVertical: 8
  },
  barBackground: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#efe3d8'
  },
  barFill: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#c0835a'
  },
  sub: {
    marginTop: 8,
    color: '#7d6657'
  }
});

export default LimitCard;
