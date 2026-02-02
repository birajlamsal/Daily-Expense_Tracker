export const toDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = () => toDateKey(new Date());

export const monthKey = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const isSameMonth = (a, b) => monthKey(a) === monthKey(b);

export const lastNDaysKeys = (n, endDate = new Date()) => {
  const keys = [];
  const base = new Date(endDate);
  for (let i = 0; i < n; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    keys.push(toDateKey(d));
  }
  return keys.reverse();
};

export const formatReadable = (dateKey) => {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const formatMonthReadable = (monthKeyValue) => {
  const [y, m] = monthKeyValue.split('-').map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};
