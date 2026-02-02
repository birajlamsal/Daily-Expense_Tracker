import React from 'react';
import { ExpenseContext } from '../context';
import { DEFAULT_CATEGORIES, DEFAULT_PAYMENT_METHODS } from '../data/initial';
import { todayKey } from '../utils/date';

const AddExpenseScreen = () => {
  const { addExpense, settings } = React.useContext(ExpenseContext);
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(todayKey());
  const [category, setCategory] = React.useState(DEFAULT_CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = React.useState(DEFAULT_PAYMENT_METHODS[0]);
  const [description, setDescription] = React.useState('');

  const handleSubmit = () => {
    const parsed = Number(amount);
    if (!parsed || Number.isNaN(parsed) || parsed <= 0) {
      alert('Enter a valid amount.');
      return;
    }
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      alert('Use date format YYYY-MM-DD.');
      return;
    }

    addExpense({
      amount: parsed,
      date: new Date(`${date}T12:00:00`),
      category,
      paymentMethod,
      description: description.trim()
    });

    setAmount('');
    setDescription('');
    setDate(todayKey());
    setCategory(DEFAULT_CATEGORIES[0]);
    setPaymentMethod(DEFAULT_PAYMENT_METHODS[0]);
  };

  return (
    <div>
      <div className="title">Log an Expense</div>
      <div className="sub">Stay within your rolling daily allowance.</div>

      <div className="card">
        <div className="label">Amount</div>
        <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`${settings.currency} 0`} />

        <div className="label">Date (YYYY-MM-DD)</div>
        <input className="input" value={date} onChange={(e) => setDate(e.target.value)} />

        <div className="label">Category</div>
        <div className="chips">
          {DEFAULT_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${category === item ? 'active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="label">Payment Method</div>
        <div className="chips">
          {DEFAULT_PAYMENT_METHODS.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${paymentMethod === item ? 'active' : ''}`}
              onClick={() => setPaymentMethod(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="label">Description (optional)</div>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Lunch at restaurant" />

        <button className="button" style={{ marginTop: 16 }} onClick={handleSubmit}>
          Log Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseScreen;
