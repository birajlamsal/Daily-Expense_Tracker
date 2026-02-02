import React from 'react';
import { ExpenseContext } from '../context';
import LimitCard from '../components/LimitCard.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import { todayKey } from '../utils/date';

const HomeScreen = () => {
  const { expenses, settings, remainingDaily, remainingMonthly, dailySpent, monthlySpent, dailyAllowance } = React.useContext(ExpenseContext);
  const today = todayKey();
  const recent = expenses.slice(0, 5);

  return (
    <div>
      <div className="title">Today</div>
      <div className="sub">{today}</div>

      <LimitCard
        title="Daily Allowance (Rolling)"
        limit={dailyAllowance(today)}
        remaining={remainingDaily(today)}
        currency={settings.currency}
      />
      <LimitCard
        title="Monthly Limit"
        limit={settings.monthlyLimit}
        remaining={remainingMonthly(new Date())}
        currency={settings.currency}
      />

      <div className="grid two">
        <div className="card">
          <div className="label">Spent today</div>
          <div className="title">{settings.currency} {dailySpent(today).toFixed(0)}</div>
        </div>
        <div className="card">
          <div className="label">Spent this month</div>
          <div className="title">{settings.currency} {monthlySpent(new Date()).toFixed(0)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <div className="title" style={{ fontSize: 18 }}>Recent Expenses</div>
        <a href="/reports" className="sub">View reports</a>
      </div>
      <ExpenseList expenses={recent} currency={settings.currency} />

      <a className="button" href="/add">Add Expense</a>
    </div>
  );
};

export default HomeScreen;
