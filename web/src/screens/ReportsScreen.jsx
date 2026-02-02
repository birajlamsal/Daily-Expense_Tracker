import React from 'react';
import { ExpenseContext } from '../context';
import { DEFAULT_CATEGORIES } from '../data/initial';
import { daysInMonth, formatReadable, formatMonthReadable, lastNDaysKeys, monthKey, previousMonthKey, todayKey } from '../utils/date';
import { CategoryChart, SpendingChart } from '../components/Charts.jsx';

const ReportsScreen = () => {
  const { expenses, settings } = React.useContext(ExpenseContext);
  const [categoryFilter, setCategoryFilter] = React.useState('All');

  const currentMonth = monthKey(new Date());
  const monthLabel = formatMonthReadable(currentMonth);

  const filteredExpenses = categoryFilter === 'All'
    ? expenses
    : expenses.filter((item) => item.category === categoryFilter);

  const monthExpenses = filteredExpenses.filter((item) => item.month === currentMonth);
  const monthTotal = monthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const daysElapsed = new Date().getDate();
  const savedToDate = settings.dailyLimit * daysElapsed - monthTotal;

  const prevMonth = previousMonthKey(new Date());
  const prevMonthTotal = expenses
    .filter((item) => item.month === prevMonth)
    .reduce((sum, item) => sum + item.amount, 0);
  const prevMonthSaved = settings.dailyLimit * daysInMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)) - prevMonthTotal;

  const last7Keys = lastNDaysKeys(7, new Date());
  const last7Totals = last7Keys.map((key) =>
    filteredExpenses
      .filter((item) => item.dateKey === key)
      .reduce((sum, item) => sum + item.amount, 0)
  );

  const categoryTotals = DEFAULT_CATEGORIES.map((category) => ({
    category,
    amount: monthExpenses
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0)
  })).filter((item) => item.amount > 0);

  const dailyTotals = React.useMemo(() => {
    const map = {};
    monthExpenses.forEach((item) => {
      map[item.dateKey] = (map[item.dateKey] || 0) + item.amount;
    });
    return Object.keys(map)
      .sort()
      .map((key) => ({ date: key, total: map[key] }));
  }, [monthExpenses]);

  return (
    <div>
      <div className="title">Reports</div>
      <div className="sub">Monthly overview · {monthLabel}</div>

      <div className="grid two">
        <div className="card">
          <div className="label">Total spent</div>
          <div className="title">{settings.currency} {monthTotal.toFixed(0)}</div>
        </div>
        <div className="card">
          <div className="label">Monthly remaining</div>
          <div className="title">{settings.currency} {(settings.monthlyLimit - monthTotal).toFixed(0)}</div>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <div className="label">Saved so far</div>
          <div className="title">{settings.currency} {savedToDate.toFixed(0)}</div>
        </div>
        <div className="card">
          <div className="label">Saved last month</div>
          <div className="title">{settings.currency} {prevMonthSaved.toFixed(0)}</div>
        </div>
      </div>

      <div className="chips">
        {['All', ...DEFAULT_CATEGORIES].map((item) => (
          <button
            key={item}
            type="button"
            className={`chip ${categoryFilter === item ? 'active' : ''}`}
            onClick={() => setCategoryFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <SpendingChart
        title="Last 7 Days Spending"
        labels={last7Keys.map(formatReadable)}
        values={last7Totals}
      />

      <CategoryChart data={categoryTotals} />

      <div className="card">
        <div className="label">Daily Spending Report</div>
        <div className="sub">{todayKey()} current month</div>
        {dailyTotals.length === 0 ? (
          <div className="empty">No entries yet.</div>
        ) : (
          <table className="table">
            <tbody>
              {dailyTotals.map((item) => (
                <tr key={item.date}>
                  <td>{formatReadable(item.date)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{settings.currency} {item.total.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsScreen;
