import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import AuditLogs from './pages/AuditLogs';
import Cards from './pages/Cards';
import Loans from './pages/Loans';
import Bills from './pages/Bills';
import Beneficiaries from './pages/Beneficiaries';
import Branches from './pages/Branches';
import Users from './pages/Users';
import Settings from './pages/Settings';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
