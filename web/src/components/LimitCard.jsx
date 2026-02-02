import React from 'react';

const LimitCard = ({ title, limit, remaining, currency }) => {
  const spent = limit - remaining;
  const ratio = limit > 0 ? Math.min(spent / limit, 1) : 0;

  return (
    <div className="card">
      <div className="label">{title}</div>
      <div className="title">{currency} {remaining.toFixed(0)} remaining</div>
      <div className="limit-bar">
        <span style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="sub">{currency} {spent.toFixed(0)} spent of {currency} {limit.toFixed(0)}</div>
    </div>
  );
};

export default LimitCard;
