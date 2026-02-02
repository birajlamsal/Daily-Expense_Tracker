import React from 'react';
import { formatReadable } from '../utils/date';

const ExpenseList = ({ expenses, currency }) => {
  if (!expenses.length) {
    return <div className="empty">No expenses logged yet.</div>;
  }

  return (
    <div className="card">
      <table className="table">
        <tbody>
          {expenses.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>{item.category}</strong>
                <div className="sub">{formatReadable(item.dateKey)} · {item.paymentMethod}</div>
                {item.description ? <div className="sub">{item.description}</div> : null}
              </td>
              <td style={{ textAlign: 'right', fontWeight: 700 }}>{currency} {item.amount.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
