import React from 'react';
import { ExpenseContext } from '../context';

const LoginScreen = () => {
  const { login, user } = React.useContext(ExpenseContext);
  const [username, setUsername] = React.useState(user.username);
  const [password, setPassword] = React.useState(user.password);

  const handleLogin = () => {
    const ok = login(username.trim(), password);
    if (!ok) {
      alert('Invalid username or password.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="title">Expense Tracker Login</div>
        <div className="sub">Use the demo account to explore features.</div>

        <div className="label">Username</div>
        <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />

        <div className="label">Password</div>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="button" style={{ marginTop: 16 }} onClick={handleLogin}>
          Login
        </button>

        <div className="sub" style={{ marginTop: 12 }}>
          Demo: {user.username} / {user.password}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
