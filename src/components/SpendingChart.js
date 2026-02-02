import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const SpendingChart = ({ labels, values, title }) => {
  if (!values.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No spending data yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: values }]
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        fromZero
        showValuesOnTopOfBars
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff8f0',
  backgroundGradientTo: '#fff8f0',
  color: () => '#c0835a',
  labelColor: () => '#6b4f3b',
  decimalPlaces: 0
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff8f0',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16
  },
  title: {
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6b4f3b',
    marginBottom: 8
  },
  empty: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  emptyText: {
    color: '#7d6657'
  }
});

export default SpendingChart;
