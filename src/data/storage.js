import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  expenses: 'expenses',
  settings: 'settings'
};

export const loadExpenses = async () => {
  const raw = await AsyncStorage.getItem(KEYS.expenses);
  return raw ? JSON.parse(raw) : [];
};

export const saveExpenses = async (expenses) => {
  await AsyncStorage.setItem(KEYS.expenses, JSON.stringify(expenses));
};

export const loadSettings = async () => {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  return raw ? JSON.parse(raw) : null;
};

export const saveSettings = async (settings) => {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
};
