import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const colors = ['#c0835a', '#8c5a3c', '#d9b38c', '#a47551', '#e6c9a8', '#b08968', '#6b4f3b'];

const CategoryChart = ({ data, currency }) => {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No category data yet.</Text>
      </View>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.category,
    amount: item.amount,
    color: colors[index % colors.length],
    legendFontColor: '#6b4f3b',
    legendFontSize: 12
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Category Breakdown</Text>
      <PieChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <Text style={styles.note}>Total shown in {currency}</Text>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff8f0',
  backgroundGradientTo: '#fff8f0',
  color: () => '#6b4f3b',
  decimalPlaces: 0,
  labelColor: () => '#6b4f3b'
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
  note: {
    color: '#7d6657',
    marginTop: 6
  },
  empty: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  emptyText: {
    color: '#7d6657'
  }
});

export default CategoryChart;
