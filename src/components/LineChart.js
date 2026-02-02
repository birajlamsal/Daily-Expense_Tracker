import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const LineChart = ({ labels, values, title }) => {
  if (!values.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No spending data yet.</Text>
      </View>
    );
  }

  const maxValue = 1500;
  const minValue = 200;
  const chartWidth = Dimensions.get('window').width - 40;
  const chartHeight = 240;
  const padding = { top: 24, right: 16, bottom: 40, left: 36 };
  const width = chartWidth - padding.left - padding.right;
  const height = chartHeight - padding.top - padding.bottom;

  const points = values.map((raw, index) => {
    const clamped = clamp(raw, minValue, maxValue);
    const x = padding.left + (labels.length <= 1 ? width / 2 : (width / (labels.length - 1)) * index);
    const ratio = (clamped - minValue) / (maxValue - minValue);
    const y = padding.top + (1 - ratio) * height;
    return { x, y, val: raw };
  });

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`)
    .join(' ');

  const yAxisLabels = [1500, 1200, 900, 600, 300, 200];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Svg width={chartWidth} height={chartHeight}>
        {yAxisLabels.map((label) => {
          const ratio = (label - minValue) / (maxValue - minValue);
          const y = padding.top + (1 - ratio) * height;
          return (
            <React.Fragment key={label}>
              <Line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#efe3d8" strokeWidth={1} />
              <SvgText x={padding.left - 6} y={y + 4} fontSize="10" fill="#6b4f3b" textAnchor="end">
                {label}
              </SvgText>
            </React.Fragment>
          );
        })}

        <Path d={path} stroke="#c0835a" strokeWidth={3} fill="none" />

        {points.map((point, index) => (
          <React.Fragment key={`${point.x}-${point.y}`}>
            <Circle cx={point.x} cy={point.y} r={4} fill="#3e2a1f" />
            <SvgText x={point.x} y={point.y - 8} fontSize="10" fill="#3e2a1f" textAnchor="middle">
              {Math.round(point.val)}
            </SvgText>
            <SvgText
              x={point.x}
              y={chartHeight - 8}
              fontSize="9"
              fill="#6b4f3b"
              textAnchor="middle"
              transform={`rotate(35 ${point.x} ${chartHeight - 8})`}
            >
              {labels[index]}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
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

export default LineChart;
