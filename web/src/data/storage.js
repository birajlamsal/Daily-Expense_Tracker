const KEYS = {
  expenses: 'web_expenses',
  settings: 'web_settings',
  user: 'web_user',
  demoSeeded: 'web_demoSeeded'
};

export const loadExpenses = () => {
  const raw = localStorage.getItem(KEYS.expenses);
  return raw ? JSON.parse(raw) : [];
};

export const saveExpenses = (expenses) => {
  localStorage.setItem(KEYS.expenses, JSON.stringify(expenses));
};

export const loadSettings = () => {
  const raw = localStorage.getItem(KEYS.settings);
  return raw ? JSON.parse(raw) : null;
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
};

export const loadUser = () => {
  const raw = localStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
};

export const saveUser = (user) => {
  localStorage.setItem(KEYS.user, JSON.stringify(user));
};

export const loadDemoSeeded = () => {
  const raw = localStorage.getItem(KEYS.demoSeeded);
  return raw ? JSON.parse(raw) : false;
};

export const saveDemoSeeded = (value) => {
  localStorage.setItem(KEYS.demoSeeded, JSON.stringify(value));
};
