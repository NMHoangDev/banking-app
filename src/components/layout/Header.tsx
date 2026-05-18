import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="h-header bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 text-primary-container">
          <span className="material-symbols-outlined text-[30px]">account_balance</span>
          <span className="font-display text-[38px] leading-none font-semibold">BankDB System</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-on-surface-variant">
          <NavLink to="/" className="text-sm font-semibold hover:text-primary transition-colors">
            Trang chủ
          </NavLink>
          <NavLink to="/customers" className="text-sm font-semibold hover:text-primary transition-colors">
            Tính năng
          </NavLink>
          <NavLink to="/beneficiaries" className="text-sm font-semibold hover:text-primary transition-colors">
            Về chúng tôi
          </NavLink>
          <NavLink to="/settings" className="text-sm font-semibold hover:text-primary transition-colors">
            Hỗ trợ
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">language</span>
            <span className="font-semibold">VI</span>
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>

          <div className="hidden sm:block w-px h-6 bg-outline-variant" />

          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-primary-container font-semibold hover:bg-surface-container-low transition-colors"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
