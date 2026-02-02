import React, { createContext, useMemo, useState } from 'react';
import { DEFAULT_SETTINGS, DEFAULT_USER } from './data/initial';
import { loadDemoSeeded, loadExpenses, loadSettings, loadUser, saveDemoSeeded, saveExpenses, saveSettings, saveUser } from './data/storage';
import { monthKey, parseDateKey, toDateKey, todayKey } from './utils/date';
import { generateDemoExpenses } from './utils/seed';

export const ExpenseContext = createContext(null);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => loadExpenses());
  const [settings, setSettings] = useState(() => loadSettings() || DEFAULT_SETTINGS);
  const [user, setUser] = useState(() => loadUser() || DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const seeded = loadDemoSeeded();
    if (!expenses.length && !seeded) {
      const demo = generateDemoExpenses(365);
      setExpenses(demo);
      saveExpenses(demo);
      saveDemoSeeded(true);
    }
  }, [expenses.length]);

  React.useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  React.useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    saveUser(user);
  }, [user]);

  const dailySpent = (date = todayKey()) =>
    expenses
      .filter((item) => toDateKey(item.date) === date)
      .reduce((sum, item) => sum + item.amount, 0);

  const monthlySpentBeforeDate = (dateKey) => {
    const date = parseDateKey(dateKey);
    const month = monthKey(date);
    return expenses
      .filter((item) => item.month === month && item.dateKey < dateKey)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const monthlySpent = (date = new Date()) => {
    const key = monthKey(date);
    return expenses
      .filter((item) => monthKey(item.date) === key)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const dailyAllowance = (dateKey = todayKey()) => {
    const date = parseDateKey(dateKey);
    const day = date.getDate();
    const base = settings.dailyLimit;
    const spentBefore = monthlySpentBeforeDate(dateKey);
    const carryoverBefore = base * (day - 1) - spentBefore;
    return base + carryoverBefore;
  };

  const remainingDaily = (date = todayKey()) => dailyAllowance(date) - dailySpent(date);
  const remainingMonthly = (date = new Date()) => settings.monthlyLimit - monthlySpent(date);

  const addExpense = (expense) => {
    const dateKey = toDateKey(expense.date);
    const month = monthKey(expense.date);
    const next = [
      {
        ...expense,
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        dateKey,
        month
      },
      ...expenses
    ];
    setExpenses(next);

    const dailyAfter = remainingDaily(dateKey) - expense.amount;
    if (dailyAfter < 0) {
      alert('Daily allowance exceeded. Tomorrow’s allowance will adjust.');
    }
  };

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const login = (username, password) => {
    const ok = username === user.username && password === user.password;
    if (ok) {
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      expenses,
      settings,
      user,
      isAuthenticated,
      dailySpent,
      monthlySpent,
      remainingDaily,
      remainingMonthly,
      dailyAllowance,
      addExpense,
      updateSettings,
      login,
      logout
    }),
    [expenses, settings, user, isAuthenticated]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
