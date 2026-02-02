import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const CategoryChart = ({ data }) => {
  if (!data.length) {
    return <div className="empty">No category data yet.</div>;
  }

  const labels = data.map((item) => item.category);
  const values = data.map((item) => item.amount);
  const colors = ['#c0835a', '#8c5a3c', '#d9b38c', '#a47551', '#e6c9a8', '#b08968', '#6b4f3b'];

  return (
    <div className="card">
      <div className="label">Category Breakdown</div>
      <Pie
        data={{
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors
            }
          ]
        }}
        options={{ plugins: { legend: { position: 'bottom' } } }}
      />
    </div>
  );
};

export const SpendingChart = ({ labels, values, title }) => {
  if (!values.length) {
    return <div className="empty">No spending data yet.</div>;
  }

  return (
    <div className="card">
      <div className="label">{title}</div>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Spending',
              data: values,
              backgroundColor: '#c0835a'
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } }
        }}
      />
    </div>
  );
};
