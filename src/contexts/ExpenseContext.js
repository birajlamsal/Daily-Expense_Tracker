import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DEFAULT_SETTINGS, DEFAULT_USER } from '../data/initial';
import { loadDemoSeeded, loadExpenses, loadSettings, loadUser, saveDemoSeeded, saveExpenses, saveSettings, saveUser } from '../data/storage';
import { monthKey, toDateKey, todayKey } from '../utils/date';
import { generateDemoExpenses } from '../utils/seed';

export const ExpenseContext = createContext(null);

const hashPin = (pin) => {
  let hash = 0;
  for (let i = 0; i < pin.length; i += 1) {
    hash = (hash << 5) - hash + pin.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
};

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
  const [isLocked, setIsLocked] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedExpenses = await loadExpenses();
      const savedSettings = await loadSettings();
      const savedUser = await loadUser();
      const demoSeeded = await loadDemoSeeded();

      const activeUser = savedUser || DEFAULT_USER;
      setUser(activeUser);
      if (!savedUser) {\n        await saveUser(activeUser);\n      }\n\n      if (!savedExpenses.length && !demoSeeded) {\n        const seeded = generateDemoExpenses(365);\n        setExpenses(seeded);\n        await saveExpenses(seeded);\n        await saveDemoSeeded(true);\n      } else {\n        setExpenses(savedExpenses);\n      }\n\n+      setSettings(savedSettings || DEFAULT_SETTINGS);
      setIsLocked(Boolean(savedSettings?.pinEnabled));
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

  const monthlySpent = (date = new Date()) => {
    const key = monthKey(date);
    return expenses
      .filter((item) => monthKey(item.date) === key)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const remainingDaily = (date = todayKey()) => settings.dailyLimit - dailySpent(date);
  const remainingMonthly = (date = new Date()) => settings.monthlyLimit - monthlySpent(date);

  const addExpense = (expense) => {
    const dateKey = toDateKey(expense.date);
    const month = monthKey(expense.date);
    const dailyRemaining = remainingDaily(dateKey);
    const monthlyRemaining = remainingMonthly(expense.date);

    if (expense.amount > dailyRemaining) {
      Alert.alert('Daily limit reached', 'You cannot add more expenses for this day.');
      return { ok: false, reason: 'daily' };
    }
    if (expense.amount > monthlyRemaining) {
      Alert.alert('Monthly limit reached', 'You cannot add more expenses for this month.');
      return { ok: false, reason: 'monthly' };
    }

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
    const monthlyAfter = monthlyRemaining - expense.amount;
    if (dailyAfter <= settings.dailyLimit * 0.1) {
      Alert.alert('Daily limit warning', 'You are close to your daily spending limit.');
    }
    if (monthlyAfter <= settings.monthlyLimit * 0.1) {
      Alert.alert('Monthly limit warning', 'You are close to your monthly spending limit.');
    }

    return { ok: true };
  };

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const enablePin = (pin) => {
    updateSettings({ pinEnabled: true, pinHash: hashPin(pin) });
    setIsLocked(true);
  };

  const disablePin = () => {
    updateSettings({ pinEnabled: false, pinHash: '' });
    setIsLocked(false);
  };

  const unlock = (pin) => {
    if (hashPin(pin) === settings.pinHash) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const value = useMemo(
    () => ({
      expenses,
      settings,
      user,
      isAuthenticated,
      loading,
      isLocked,
      dailySpent,
      monthlySpent,
      remainingDaily,
      remainingMonthly,
      addExpense,
      updateSettings,
      enablePin,
      disablePin,
      unlock,
      login,
      logout
    }),
    [expenses, settings, user, isAuthenticated, loading, isLocked]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
