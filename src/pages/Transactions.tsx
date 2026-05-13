import React from 'react';
import { 
  ChevronRight, 
  Download, 
  Plus, 
  Search, 
  RefreshCw, 
  Calendar,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Undo2,
  ArrowRight,
  ShieldAlert,
  Contact2,
  TrendingUp,
  ReceiptText
} from 'lucide-react';
import { cn } from '../lib/utils';

const transactions = [
  { id: 'TXN-88219405', sender: 'TechCorp VN', senderAcc: '****5521', receiver: 'Logistics Global', receiverAcc: '****9902', amount: '15,000.00 USD', type: 'Transfer', status: 'COMPLETED', time: '30/10/2023 14:22:10', fee: '25.00 USD' },
  { id: 'TXN-88219406', sender: 'An Binh Co.', senderAcc: '****1123', receiver: 'Nguyen Van B', receiverAcc: '****8877', amount: '2,450.00 USD', type: 'Transfer', status: 'PENDING', time: '30/10/2023 15:45:01', fee: '5.00 USD' },
  { id: 'TXN-88219407', sender: 'Investment Fund X', senderAcc: '****3344', receiver: 'Main Account', receiverAcc: '****0011', amount: '50,000.00 USD', type: 'Interest', status: 'FAILED', time: '30/10/2023 16:10:55', fee: '0.00 USD' },
  { id: 'TXN-88219408', sender: 'Retailer ABC', senderAcc: '****2211', receiver: 'Supplier XYZ', receiverAcc: '****4455', amount: '8,920.50 USD', type: 'Transfer', status: 'REVERSED', time: '30/10/2023 09:12:30', fee: '12.50 USD' },
  { id: 'TXN-88219409', sender: 'User Personal', senderAcc: '****9988', receiver: 'Savings Account', receiverAcc: '****0000', amount: '500.00 USD', type: 'Transfer', status: 'CANCELLED', time: '29/10/2023 23:59:59', fee: '0.00 USD' },
];

export default function Transactions() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex text-xs font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Transactions</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Giám sát giao dịch</span>
          </nav>
          <h2 className="font-display font-bold text-3xl text-on-surface tracking-tight">Giám sát giao dịch</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 border border-outline text-on-surface font-bold text-sm rounded-xl hover:bg-surface-container-low transition-all shadow-sm">
            <Download className="w-4.5 h-4.5" />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:shadow-xl transition-all shadow-md active:scale-95">
            <Plus className="w-5 h-5" />
            Tạo giao dịch mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng thanh khoản', value: '1,284,050.00', unit: 'USD', change: '+12.4%', icon: 'show_chart', color: 'text-secondary' },
          { label: 'Giao dịch chờ', value: '42', unit: '', desc: 'Cần phê duyệt trong 2h tới', icon: 'pending_actions', color: 'text-on-tertiary-container' },
          { label: 'Tỷ lệ lỗi', value: '0.04%', unit: '', change: 'Tăng 0.01%', icon: 'error', color: 'text-error' },
          { label: 'Tổng phí (24h)', value: '14,250.50', unit: 'USD', desc: 'Dựa trên 1,420 giao dịch', icon: 'receipt', color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 border border-outline-variant rounded-3xl shadow-sm hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-on-surface-variant label-uppercase font-bold tracking-[0.08em] opacity-70">{stat.label}</span>
              <span className={cn("material-symbols-outlined text-2xl group-hover:scale-110 transition-transform", stat.color)}>{stat.icon}</span>
            </div>
            <div className="text-3xl font-display font-bold text-on-surface tracking-tighter">
              {stat.value} {stat.unit && <span className="text-sm font-bold opacity-40">{stat.unit}</span>}
            </div>
            {stat.change && (
              <div className={cn("mt-2 text-[10px] flex items-center gap-1 font-bold", stat.change.includes('+') || stat.change.includes('Tăng') ? 'text-secondary' : 'text-error')}>
                <TrendingUp className="w-3 h-3" />
                {stat.change} {stat.label.includes('thanh khoản') && 'so với tháng trước'}
              </div>
            )}
            {stat.desc && <div className="mt-2 text-[10px] text-on-surface-variant font-bold opacity-60 uppercase tracking-widest">{stat.desc}</div>}
          </div>
        ))}
      </div>

      <div className="bg-surface-container-low p-8 border border-outline-variant rounded-3xl flex flex-wrap items-center gap-8 shadow-inner">
        <div className="flex flex-col gap-2 min-w-[180px]">
          <label className="label-uppercase tracking-[0.1em] text-on-surface-variant font-black">Trạng thái</label>
          <select className="bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary shadow-sm">
            <option>Tất cả trạng thái</option>
            <option>COMPLETED</option>
            <option>PENDING</option>
            <option>FAILED</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 min-w-[180px]">
          <label className="label-uppercase tracking-[0.1em] text-on-surface-variant font-black">Loại giao dịch</label>
          <select className="bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary shadow-sm">
            <option>Tất cả loại</option>
            <option>Transfer</option>
            <option>Interest</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 min-w-[240px]">
          <label className="label-uppercase tracking-[0.1em] text-on-surface-variant font-black">Khoảng ngày</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
            <input className="w-full bg-white border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary shadow-sm" type="text" defaultValue="01/10/2023 - 31/10/2023" />
          </div>
        </div>
        <div className="pt-7 flex gap-3 ml-auto">
          <button className="p-2.5 text-on-surface-variant hover:bg-white rounded-xl transition-all shadow-sm group">
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button className="bg-primary px-8 py-2.5 text-white font-bold rounded-xl hover:scale-[1.02] shadow-lg shadow-primary/20 transition-all uppercase tracking-widest text-xs">
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant">
                <th className="px-6 py-5 label-uppercase text-on-surface-variant">ID Giao dịch</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant">Người gửi</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant">Người nhận</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant text-right">Số tiền</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant">Loại</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant">Trạng thái</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant">Thời gian tạo</th>
                <th className="px-6 py-5 label-uppercase text-on-surface-variant text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {transactions.map((txn, i) => (
                <tr key={i} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5 font-numeric text-primary font-bold tracking-tight">{txn.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm font-display">{txn.sender}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-60 tracking-wider">A/C: {txn.senderAcc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm font-display">{txn.receiver}</span>
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-60 tracking-wider">A/C: {txn.receiverAcc}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-numeric font-bold text-sm text-on-surface">{txn.amount}</td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-surface-container-highest/50 rounded-lg text-on-surface-variant uppercase tracking-widest ring-1 ring-outline-variant/20">{txn.type}</span>
                  </td>
                  <td className="px-6 py-5 uppercase">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest leading-none",
                      txn.status === 'COMPLETED' ? 'bg-secondary/10 text-secondary' : 
                      txn.status === 'PENDING' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 
                      txn.status === 'FAILED' ? 'bg-error-container text-on-error-container font-black' : 
                      'bg-surface-container-highest text-on-surface-variant opacity-60'
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", txn.status === 'COMPLETED' ? 'bg-secondary' : txn.status === 'PENDING' ? 'bg-on-tertiary-container animate-pulse' : txn.status === 'FAILED' ? 'bg-error' : 'bg-outline')} />
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-numeric text-[11px] font-bold text-on-surface-variant opacity-60">{txn.time}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2.5 hover:bg-white text-on-surface-variant hover:text-primary rounded-xl shadow-sm border border-transparent hover:border-outline-variant" title="Xem chi tiết">
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2.5 hover:bg-error-container text-error rounded-xl shadow-sm transition-all" title="Hoàn tác">
                        <Undo2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-primary-container p-8 rounded-[40px] shadow-2xl text-white overflow-hidden relative group hover:scale-[1.01] transition-transform duration-500">
          <div className="relative z-10">
            <h3 className="font-display font-bold text-2xl mb-4 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-secondary-fixed" /> Trung tâm bảo mật
            </h3>
            <p className="text-sm font-medium opacity-80 mb-8 leading-relaxed max-w-md">Các giao dịch trên $10,000.00 yêu cầu xác thực đa yếu tố (MFA). Đảm bảo thiết bị Token của bạn đang hoạt động bình thường.</p>
            <button className="bg-white text-primary-container px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-secondary-fixed hover:text-on-secondary-fixed-variant transition-all">
              Thiết lập Token bảo mật <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <ShieldAlert className="absolute -right-12 -bottom-12 w-64 h-64 text-white/5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none" />
        </div>

        <div className="bg-white border border-outline-variant p-8 rounded-[40px] shadow-sm flex gap-6 hover:shadow-xl transition-all">
          <div className="w-20 h-20 bg-primary-container/10 rounded-[28px] border border-outline-variant flex items-center justify-center shrink-0 shadow-inner group overflow-hidden">
            <Contact2 className="w-10 h-10 text-primary-container group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-primary mb-2">Cần hỗ trợ tra soát?</h3>
            <p className="text-sm font-medium text-on-surface-variant mb-6 leading-relaxed">Đội ngũ kỹ thuật của chúng tôi sẵn sàng hỗ trợ 24/7 cho các vấn đề liên quan đến API hoặc giao dịch bị kẹt.</p>
            <div className="flex flex-wrap gap-6">
              <span className="text-xs font-black text-primary flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-sm">call</span> 1900 6688
              </span>
              <span className="text-xs font-black text-primary flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-sm">mail</span> treasury@ebank.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
