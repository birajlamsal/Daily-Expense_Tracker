import React from 'react';
import { ExpenseContext } from '../context';

const SettingsScreen = () => {
  const { settings, updateSettings, logout, user } = React.useContext(ExpenseContext);
  const [dailyLimit, setDailyLimit] = React.useState(String(settings.dailyLimit));
  const [monthlyLimit, setMonthlyLimit] = React.useState(String(settings.monthlyLimit));
  const [currency, setCurrency] = React.useState(settings.currency);

  const saveLimits = () => {
    const daily = Number(dailyLimit);
    const monthly = Number(monthlyLimit);
    if (!daily || daily <= 0 || !monthly || monthly <= 0) {
      alert('Daily and monthly limits must be positive numbers.');
      return;
    }
    updateSettings({ dailyLimit: daily, monthlyLimit: monthly, currency: currency || 'Rs.' });
    alert('Your limits have been updated.');
  };

  return (
    <div>
      <div className="title">Settings</div>
      <div className="sub">Control limits, currency, and security.</div>

      <div className="card">
        <div className="label">Signed in as</div>
        <div className="sub" style={{ marginTop: 6 }}>{user.username}</div>
        <button className="button secondary" style={{ marginTop: 12 }} onClick={logout}>
          Logout
        </button>
      </div>

      <div className="card">
        <div className="label">Daily limit</div>
        <input className="input" value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} />

        <div className="label">Monthly limit</div>
        <input className="input" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} />

        <div className="label">Currency prefix</div>
        <input className="input" value={currency} onChange={(e) => setCurrency(e.target.value)} />

        <button className="button" style={{ marginTop: 16 }} onClick={saveLimits}>
          Save Limits
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
