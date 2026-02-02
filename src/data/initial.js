export const DEFAULT_LIMITS = {
  dailyLimit: 500,
  monthlyLimit: 15000
};

export const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Health',
  'Other'
];

export const DEFAULT_PAYMENT_METHODS = ['Cash', 'Online'];

export const DEFAULT_SETTINGS = {
  ...DEFAULT_LIMITS,
  currency: 'Rs.',
  name: ''
};
