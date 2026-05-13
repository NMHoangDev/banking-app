import React from 'react';

export function Header() {
  return (
    <header className="h-header bg-surface flex items-center justify-between px-8 border-b border-outline-variant z-40 sticky top-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
            placeholder="Tìm kiếm mã khách hàng, số tài khoản..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="flex items-center text-on-surface-variant hover:bg-surface-container-low p-2 rounded transition-all">
          <span className="material-symbols-outlined">help_outline</span>
          <span className="ml-2 font-semibold text-sm">Trợ giúp</span>
        </button>
        <button className="relative text-on-surface-variant hover:bg-surface-container-low p-2 rounded transition-all">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant"></div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center hover:bg-primary/90 transition-all">
          <span className="material-symbols-outlined mr-2">person_add</span>
          Thêm Khách Hàng
        </button>
      </div>
    </header>
  );
}
