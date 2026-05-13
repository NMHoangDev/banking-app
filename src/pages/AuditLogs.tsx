import React from 'react';
import { 
  ChevronRight, 
  Download, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight as ChevronRightIcon,
  X,
  Printer,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

const auditLogs = [
  { user: 'Lê Văn Thành', initial: 'LT', ip: '192.168.1.45', action: 'UPDATE', table: 'ACCOUNTS', time: '25/05/2024 14:32:11', record: '#ACC-99281' },
  { user: 'Nguyễn Thị Mai', initial: 'NM', ip: '10.0.0.12', action: 'DELETE', table: 'BENEFICIARIES', time: '25/05/2024 11:05:44', record: '#BEN-4410' },
  { user: 'Trần Hoàng Nam', initial: 'TN', ip: '192.168.1.92', action: 'INSERT', table: 'TRANSACTIONS', time: '25/05/2024 09:12:00', record: '#TRX-882193' },
  { user: 'Lê Văn Thành', initial: 'LT', ip: '192.168.1.45', action: 'UPDATE', table: 'LOAN_CONTRACTS', time: '24/05/2024 16:45:22', record: '#LN-3301' },
];

export default function AuditLogs() {
  return (
    <div className="space-y-8 relative h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display font-bold text-3xl text-primary tracking-tight">Nhật Ký Kiểm Toán Hệ Thống</h2>
          <p className="text-on-surface-variant font-medium mt-1">Theo dõi và giám sát mọi thay đổi dữ liệu trong hệ thống lõi.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline rounded-xl font-bold text-sm hover:bg-surface-container-low transition-all shadow-sm">
            <Download className="w-4.5 h-4.5" />
            Xuất Báo Cáo
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:shadow-xl transition-all shadow-md">
            <Filter className="w-4.5 h-4.5" />
            Bộ Lọc Nâng Cao
          </button>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-3xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-sm border-t-8 border-primary">
        <div className="space-y-2">
          <label className="label-uppercase tracking-widest text-[9px] text-on-surface-variant font-black">Người dùng</label>
          <select className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary">
            <option>Tất cả người dùng</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="label-uppercase tracking-widest text-[9px] text-on-surface-variant font-black">Bảng dữ liệu</label>
          <select className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary">
            <option>Tất cả các bảng</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="label-uppercase tracking-widest text-[9px] text-on-surface-variant font-black">Thời gian</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 p-3 text-sm font-bold" type="text" defaultValue="24/05/2024 - 25/05/2024" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Áp dụng</button>
          <button className="px-4 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-outline-variant">
              <th className="px-8 py-5 label-uppercase text-on-surface-variant">Người dùng</th>
              <th className="px-8 py-5 label-uppercase text-on-surface-variant text-center">Hành động</th>
              <th className="px-8 py-5 label-uppercase text-on-surface-variant">Bảng bị tác động</th>
              <th className="px-8 py-5 label-uppercase text-on-surface-variant">Thời gian</th>
              <th className="px-8 py-5 label-uppercase text-on-surface-variant">ID Bản ghi</th>
              <th className="px-8 py-5 label-uppercase text-on-surface-variant text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {auditLogs.map((log, i) => (
              <tr key={i} className="hover:bg-primary/5 transition-colors group cursor-pointer">
                <td className="px-8 py-5 text-sm">
                  <div className="flex items-center gap-4 text-xs font-bold ring-4 ring-white shadow-sm shrink-0">
                    <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center text-primary font-bold text-xs">
                      {log.initial}
                    </div>
                    <div>
                      <p className="font-numeric text-on-surface font-black tracking-tight">{log.user}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold opacity-60">IP: {log.ip}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black tracking-widest",
                    log.action === 'UPDATE' ? 'bg-secondary-container text-on-secondary-fixed-variant' : 
                    log.action === 'DELETE' ? 'bg-error-container text-on-error-container' : 
                    'bg-primary-fixed text-on-primary-fixed-variant'
                  )}>
                    {log.action}
                  </span>
                </td>
                <td className="px-8 py-5 font-numeric font-black text-sm text-on-surface tracking-widest opacity-80">{log.table}</td>
                <td className="px-8 py-5 font-numeric font-bold text-xs text-on-surface-variant">{log.time}</td>
                <td className="px-8 py-5 font-numeric font-bold text-[11px] text-on-surface-variant opacity-60 tracking-wider font-mono">{log.record}</td>
                <td className="px-8 py-5 text-right">
                  <button className="text-primary font-black text-xs uppercase tracking-widest hover:underline">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comparison Drawer Animation placeholder/Mockup */}
      <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-2xl z-50 border-l border-outline-variant translate-x-0 transition-transform duration-500 shadow-primary/20">
        <div className="h-full flex flex-col">
          <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
            <div>
              <h3 className="font-display font-bold text-2xl text-primary tracking-tight">Chi Tiết Thay Đổi</h3>
              <p className="text-[10px] font-black text-on-surface-variant tracking-[0.2em] mt-1 opacity-60 uppercase">ID: #LOG-882104 | ACCOUNTS</p>
            </div>
            <button className="p-3 hover:bg-surface-container-highest rounded-full transition-all text-on-surface-variant">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <div className="grid grid-cols-2 gap-6 bg-surface-container-low/40 p-6 rounded-3xl border border-outline-variant/30">
              <div>
                <p className="label-uppercase text-[9px] tracking-widest text-on-surface-variant opacity-60 mb-2">Thời gian thực hiện</p>
                <p className="font-numeric font-black text-sm">25/05/2024 14:32:11</p>
              </div>
              <div>
                <p className="label-uppercase text-[9px] tracking-widest text-on-surface-variant opacity-60 mb-2">Hành động</p>
                <p className="font-numeric font-black text-xs text-secondary bg-secondary/5 px-2 py-1 rounded w-fit">UPDATE (Sửa đổi)</p>
              </div>
              <div>
                <p className="label-uppercase text-[9px] tracking-widest text-on-surface-variant opacity-60 mb-2">Thực hiện bởi</p>
                <p className="font-numeric font-black text-sm">Lê Văn Thành</p>
              </div>
              <div>
                <p className="label-uppercase text-[9px] tracking-widest text-on-surface-variant opacity-60 mb-2">Địa chỉ IP</p>
                <p className="font-numeric font-black text-sm">192.168.1.45</p>
              </div>
            </div>

            <h4 className="font-display font-bold text-lg text-primary pb-3 border-b border-outline-variant/30 tracking-tight">So Sánh Dữ Liệu (Trước vs Sau)</h4>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black tracking-widest text-on-surface-variant opacity-60 uppercase">Hạn mức giao dịch (Daily Limit)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-error-container/20 border border-error/10 rounded-2xl">
                    <p className="text-[9px] text-error font-black tracking-widest mb-3 uppercase">TRƯỚC</p>
                    <code className="text-xs font-black text-on-error-container bg-white px-3 py-1.5 rounded shadow-sm">50,000,000 VND</code>
                  </div>
                  <div className="p-5 bg-secondary-container/20 border border-secondary/10 rounded-2xl">
                    <p className="text-[9px] text-secondary font-black tracking-widest mb-3 uppercase">SAU</p>
                    <code className="text-xs font-black text-on-secondary-fixed-variant bg-white px-3 py-1.5 rounded shadow-sm scale-110 origin-left inline-block">200,000,000 VND</code>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs font-bold text-on-surface tracking-tight">
                <label className="text-[10px] font-black tracking-widest text-on-surface-variant opacity-60 uppercase">Trạng thái tài khoản (Status)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-error-container/20 border border-error/10 rounded-2xl">
                    <p className="text-[9px] text-error font-black tracking-widest mb-3 uppercase">TRƯỚC</p>
                    <code className="text-xs font-mono font-bold text-error">"PENDING_APPROVAL"</code>
                  </div>
                  <div className="p-5 bg-secondary-container/20 border border-secondary/10 rounded-2xl">
                    <p className="text-[9px] text-secondary font-black tracking-widest mb-3 uppercase">SAU</p>
                    <code className="text-xs font-mono font-bold text-secondary">"ACTIVE"</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border border-outline-variant/30 border-dashed rounded-3xl bg-surface-container-low/20">
               <div className="flex gap-4 items-start">
                  <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                  <p className="text-xs font-medium text-on-surface-variant italic leading-relaxed">Bản ghi này đã được ký số và xác thực bởi hệ thống Core Banking Security. Mọi hành vi can thiệp vào nhật ký này sẽ được ghi lại tự động.</p>
               </div>
            </div>
          </div>

          <div className="p-8 border-t border-outline-variant bg-surface flex gap-4 shadow-inner">
            <button className="flex-1 px-6 py-4 border border-outline-variant rounded-2xl font-black text-[11px] uppercase tracking-widest text-on-surface hover:bg-surface-container-low transition-all flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" /> In Chi Tiết
            </button>
            <button className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
              Xác nhận Kiểm tra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
