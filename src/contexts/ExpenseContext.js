import React, { createContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { DEFAULT_SETTINGS, DEFAULT_USER } from '../data/initial';
import { loadDemoSeeded, loadExpenses, loadSettings, loadUser, saveDemoSeeded, saveExpenses, saveSettings, saveUser } from '../data/storage';
import { monthKey, parseDateKey, toDateKey, todayKey } from '../utils/date';
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
      if (!savedUser) {
        await saveUser(activeUser);
      }

      if (!savedExpenses.length && !demoSeeded) {
        const seeded = generateDemoExpenses(365);
        setExpenses(seeded);
        await saveExpenses(seeded);
        await saveDemoSeeded(true);
      } else {
        setExpenses(savedExpenses);
      }

      setSettings(savedSettings || DEFAULT_SETTINGS);
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

  const login = (username, password) => {
    const ok = username === user.username && password === user.password;
    if (ok) {
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (settings.pinEnabled) {
      setIsLocked(true);
    }
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
      dailyAllowance,
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
