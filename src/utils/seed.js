import { DEFAULT_CATEGORIES, DEFAULT_PAYMENT_METHODS } from '../data/initial';
import { monthKey, toDateKey } from './date';

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateDemoExpenses = (days = 365) => {
  const expenses = [];
  const today = new Date();

  for (let i = 0; i < days; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = toDateKey(date);
    const month = monthKey(date);

    const entriesToday = randomBetween(1, 3);
    let remainingDaily = 480;

    for (let j = 0; j < entriesToday; j += 1) {
      const amount = Math.max(50, Math.min(remainingDaily, randomBetween(60, 220)));
      remainingDaily -= amount;

      const category = DEFAULT_CATEGORIES[(i + j) % DEFAULT_CATEGORIES.length];
      const paymentMethod = DEFAULT_PAYMENT_METHODS[(i + j) % DEFAULT_PAYMENT_METHODS.length];

      expenses.push({
        id: `demo-${dateKey}-${j}`,
        amount,
        date: date.toISOString(),
        dateKey,
        month,
        category,
        paymentMethod,
        description: 'Demo expense'
      });
    }
  }

  return expenses;
};
