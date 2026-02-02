import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DEFAULT_SETTINGS } from '../data/initial';
import { loadDemoSeeded, loadExpenses, loadSettings, saveDemoSeeded, saveExpenses, saveSettings } from '../data/storage';
import { monthKey, parseDateKey, toDateKey, todayKey } from '../utils/date';
import { generateDemoExpenses } from '../utils/seed';

export const ExpenseContext = createContext(null);

const scheduleDailyReminder = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily spending check-in',
      body: 'Remember to log expenses and keep within today\'s limit.'
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true
    }
  });
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedExpenses = await loadExpenses();
      const savedSettings = await loadSettings();
      const demoSeeded = await loadDemoSeeded();

      if (!savedExpenses.length && !demoSeeded) {
        const seeded = generateDemoExpenses(365);
        setExpenses(seeded);
        await saveExpenses(seeded);
        await saveDemoSeeded(true);
      } else {
        setExpenses(savedExpenses);
      }

      setSettings(savedSettings || DEFAULT_SETTINGS);
      setLoading(false);
      scheduleDailyReminder();
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveExpenses(expenses);
    }
  }, [expenses, loading]);

  useEffect(() => {
    if (!loading) {
      saveSettings(settings);
    }
  }, [settings, loading]);

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

  const tomorrowKey = (dateKey = todayKey()) => {
    const d = parseDateKey(dateKey);
    d.setDate(d.getDate() + 1);
    return toDateKey(d);
  };

  const tomorrowAllowance = () => dailyAllowance(tomorrowKey());

  const addExpense = (expense) => {
    const dateKey = toDateKey(expense.date);
    const month = monthKey(expense.date);
    const dailyRemaining = remainingDaily(dateKey);
    const monthlyRemaining = remainingMonthly(expense.date);

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

    const dailyAfter = dailyRemaining - expense.amount;
    if (dailyAfter < 0) {
      Alert.alert('Daily allowance exceeded', 'You have used more than your rolling daily allowance. Tomorrow’s allowance will adjust.');
    }

    return { ok: true };
  };

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const exportData = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      expenses
    };
    return JSON.stringify(payload, null, 2);
  };

  const importData = (jsonString) => {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid data format.');
    }
    if (!Array.isArray(parsed.expenses)) {
      throw new Error('Expenses are missing.');
    }
    if (!parsed.settings || typeof parsed.settings !== 'object') {
      throw new Error('Settings are missing.');
    }
    setExpenses(parsed.expenses);
    setSettings((prev) => ({ ...prev, ...parsed.settings }));
    saveDemoSeeded(true);
  };

  const value = useMemo(
    () => ({
      expenses,
      settings,
      loading,
      dailySpent,
      monthlySpent,
      remainingDaily,
      remainingMonthly,
      dailyAllowance,
      tomorrowAllowance,
      addExpense,
      updateSettings,
      exportData,
      importData
    }),
    [expenses, settings, loading]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
