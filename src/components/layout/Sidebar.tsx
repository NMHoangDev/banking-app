import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/' },
  { icon: 'group', label: 'Customers', path: '/customers' },
  { icon: 'account_balance', label: 'Accounts', path: '/accounts' },
  { icon: 'receipt_long', label: 'Transactions', path: '/transactions' },
  { icon: 'credit_card', label: 'Cards', path: '/cards' },
  { icon: 'payments', label: 'Loans', path: '/loans' },
  { icon: 'description', label: 'Bills', path: '/bills' },
  { icon: 'person_add', label: 'Beneficiaries', path: '/beneficiaries' },
  { icon: 'location_on', label: 'Branches', path: '/branches' },
  { icon: 'manage_accounts', label: 'Users', path: '/users' },
  { icon: 'history', label: 'Audit Logs', path: '/audit-logs' },
  { icon: 'settings', label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-sidebar bg-primary-container border-r border-outline-variant flex flex-col z-50">
      <div className="p-6">
        <h1 className="font-display font-bold text-32 text-white">Enterprise Bank</h1>
        <p className="text-primary-fixed-dim text-xs opacity-70">Institutional Portal</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              isActive ? "sidebar-link-active" : "sidebar-link"
            )}
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant/20">
        <div className="flex items-center p-2 rounded-lg bg-on-primary-fixed-variant/30">
          <img 
            alt="User Profile" 
            className="w-8 h-8 rounded-full border border-outline-variant shadow-sm" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVVO2EJmBwsY4rjMjP67aogWbWrljrSarlSFuVkBx4_sEpsUyTU7Evr5yESjHIZEfdGro6cuzRANoCOxupBAZPuCmePIG037IojYnFhgWtJsGB7kiO54vPwgA1VcVx-YHf1-8y-bPDgPeVEksPAF3prJT9N_f3wzTRdqtktbkw1mHdx0gi5rm5OiZi3IViItFVKY1DtOk7HKLien3tqMQn4NHV9sKjPHD78jarG7UunrIkCTN_fDLdXV9TXioqBlAmlva7FV_tWytm"
          />
          <div className="ml-3 overflow-hidden">
            <p className="text-white font-numeric-data text-xs truncate">Quản trị viên</p>
            <p className="text-primary-fixed-dim text-[10px] truncate">Admin Portal</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
