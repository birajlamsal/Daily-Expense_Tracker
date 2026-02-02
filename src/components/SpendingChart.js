import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const SpendingChart = ({ labels, values, title, labelRotation = 0 }) => {
  if (!values.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No spending data yet.</Text>
      </View>
    );
  }

  const chartHeight = 320;
  const chartWidth = Dimensions.get('window').width - 40 - 36;
  const maxValue = Math.max(...values, 1);
  const roundedMax = Math.ceil(maxValue / 500) * 500;
  const yAxisLabels = Array.from({ length: 5 }, (_, idx) =>
    String(roundedMax - idx * (roundedMax / 4))
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartRow}>
        <View style={[styles.yAxis, { height: chartHeight }]}>
          {yAxisLabels.map((label) => (
            <Text key={label} style={styles.yAxisLabel}>{label}</Text>
          ))}
        </View>
        <BarChart
          data={{
            labels,
            datasets: [{ data: values }]
          }}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          fromZero
          segments={4}
          showValuesOnTopOfBars
          verticalLabelRotation={labelRotation}
          xLabelsOffset={-6}
          yLabelsOffset={8}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>
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
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  yAxis: {
    width: 36,
    justifyContent: 'space-between',
    paddingRight: 4
  },
  yAxisLabel: {
    color: '#6b4f3b',
    fontSize: 10,
    textAlign: 'right'
  },
  chart: {
    paddingRight: 12,
    paddingLeft: 12
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
