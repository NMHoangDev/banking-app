import React from 'react';
import { 
  ChevronRight, 
  Search, 
  Send, 
  Info, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  ChevronDown,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Transfer() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-3xl text-primary tracking-tight">Chuyển tiền nội bộ</h2>
        <nav className="flex text-[11px] font-bold text-on-surface-variant mt-3 gap-2 uppercase tracking-[0.1em] items-center">
          <span className="hover:text-primary transition-colors cursor-pointer">Trang chủ</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-primary transition-colors cursor-pointer">Giao dịch</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-black">Chuyển tiền nội bộ</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border border-outline-variant p-10 rounded-[40px] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ArrowRightLeft className="w-32 h-32 text-primary" />
            </div>
            
            <form className="space-y-8 relative z-10">
              <div className="space-y-3">
                <label className="label-uppercase tracking-[0.15em] text-on-surface-variant font-black">TÀI KHOẢN NGUỒN</label>
                <div className="relative group">
                  <select className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold appearance-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all pr-12 shadow-sm cursor-pointer">
                    <option>0012 3345 6789 - Corporate Operational - 1.250.000.000 VND</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs font-bold text-on-surface-variant opacity-60">Số dư khả dụng:</span>
                  <span className="text-sm font-numeric font-black text-primary tracking-tight">1.250.000.000 <span className="text-[10px] opacity-60">VND</span></span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="label-uppercase tracking-[0.15em] text-on-surface-variant font-black">SỐ TÀI KHOẢN ĐÍCH</label>
                  <input className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" placeholder="Nhập số tài khoản" type="text" />
                </div>
                <div className="space-y-3">
                  <label className="label-uppercase tracking-[0.15em] text-on-surface-variant font-black">TÊN NGƯỜI THỰC HIỆN</label>
                  <input className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold text-on-surface-variant/60 cursor-not-allowed shadow-inner" readOnly type="text" value="Nguyen Van A" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="label-uppercase tracking-[0.15em] text-on-surface-variant font-black">SỐ TIỀN CHUYỂN</label>
                <div className="relative group">
                  <input className="w-full bg-white border border-outline-variant rounded-[32px] px-8 py-6 text-4xl font-numeric font-black text-primary focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all pr-24 shadow-sm" placeholder="0.00" type="text" />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-2xl text-primary/30 tracking-widest">VND</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="label-uppercase tracking-[0.15em] text-on-surface-variant font-black">NỘI DUNG CHUYỂN TIỀN</label>
                <textarea className="w-full bg-white border border-outline-variant rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm resize-none" placeholder="Ví dụ: Thanh toan hop dong cung cap dich vu thang 10" rows={4} />
              </div>

              <div className="pt-6">
                <button className="w-full bg-primary-container text-white font-bold text-lg py-5 rounded-2xl hover:bg-primary shadow-2xl shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group" type="button">
                  <Send className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  Xác nhận chuyển tiền
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-outline-variant p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
            <h3 className="font-display font-bold text-xl text-primary mb-8 relative z-10">Thông tin hạn mức</h3>
            <div className="space-y-8 relative z-10">
              <div>
                <p className="label-uppercase text-on-surface-variant font-black tracking-widest text-[9px] opacity-60 mb-2">Số dư hiện tại</p>
                <p className="font-display font-bold text-3xl text-primary tracking-tighter">1.250.000.000 <span className="text-sm font-black opacity-40 uppercase">VND</span></p>
              </div>
              <div className="h-px bg-outline-variant/30" />
              <div className="space-y-6">
                <div className="flex justify-between items-center group/sub">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-bold text-on-surface-variant">Hạn mức / giao dịch</span>
                  </div>
                  <span className="font-numeric font-black text-sm text-primary">500.000.000</span>
                </div>
                <div className="flex justify-between items-center group/sub">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-on-surface-variant">Hạn mức ngày</span>
                  </div>
                  <span className="font-numeric font-black text-sm text-primary">2.000.000.000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-container text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
            <h3 className="font-display font-bold text-xl mb-8 relative z-10">Chi tiết thanh toán</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium opacity-60">Số tiền chuyển</span>
                <span className="font-numeric font-black text-sm">100.000.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium opacity-60">Phí dịch vụ dự tính</span>
                <span className="font-numeric font-black text-sm">2.200</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-widest mb-1">Tổng khấu trừ</span>
                <div className="text-right">
                  <p className="font-display font-bold text-3xl tracking-tighter">100.002.200</p>
                  <p className="label-uppercase opacity-40 text-[9px] font-black tracking-widest mt-1">VIETNAM DONG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
