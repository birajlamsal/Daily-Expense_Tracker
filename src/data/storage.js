import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  expenses: 'expenses',
  settings: 'settings',
  user: 'user',
  demoSeeded: 'demoSeeded'
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

export const loadUser = async () => {
  const raw = await AsyncStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
};

export const saveUser = async (user) => {
  await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
};

export const loadDemoSeeded = async () => {
  const raw = await AsyncStorage.getItem(KEYS.demoSeeded);
  return raw ? JSON.parse(raw) : false;
};

export const saveDemoSeeded = async (value) => {
  await AsyncStorage.setItem(KEYS.demoSeeded, JSON.stringify(value));
};
