import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ExpenseProvider, ExpenseContext } from './context';
import LoginScreen from './screens/LoginScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import AddExpenseScreen from './screens/AddExpenseScreen.jsx';
import ReportsScreen from './screens/ReportsScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import homeIcon from '../../Images/home.svg';
import reportIcon from '../../Images/report.svg';
import settingIcon from '../../Images/setting.svg';

const AppShell = () => {
  const { isAuthenticated } = React.useContext(ExpenseContext);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="container">
      <div className="nav">
        <NavLink to="/" end>
          <img src={homeIcon} alt="" width="18" height="18" style={{ marginRight: 6 }} />
          Home
        </NavLink>
        <NavLink to="/add">Add Expense</NavLink>
        <NavLink to="/reports">
          <img src={reportIcon} alt="" width="18" height="18" style={{ marginRight: 6 }} />
          Reports
        </NavLink>
        <NavLink to="/settings">
          <img src={settingIcon} alt="" width="18" height="18" style={{ marginRight: 6 }} />
          Settings
        </NavLink>
      </div>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/add" element={<AddExpenseScreen />} />
        <Route path="/reports" element={<ReportsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <ExpenseProvider>
    <AppShell />
  </ExpenseProvider>
);

export default App;
