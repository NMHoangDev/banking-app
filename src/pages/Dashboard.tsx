import React from 'react';
import { 
  Plus,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  History,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '../lib/utils';

const transactionData = [
  { name: '01 THG 10', volume: 4000 },
  { name: '10 THG 10', volume: 3000 },
  { name: '20 THG 10', volume: 5000 },
  { name: '30 THG 10', volume: 8490 },
];

const customerSegmentData = [
  { name: 'CÁ NHÂN', value: 80 },
  { name: 'DOANH NGHIỆP', value: 45 },
  { name: 'ƯU TIÊN', value: 65 },
  { name: 'TỔ CHỨC', value: 30 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-display font-bold text-24 text-primary-container">Bảng Điều Khiển Tổng Quan</h2>
        <p className="text-on-surface-variant text-sm">Chào mừng trở lại. Đây là tóm tắt tình hình tài chính của hệ thống hôm nay.</p>
      </div>

      {/* Top Section: 6 Statistic Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {[
          { icon: 'group', label: 'TỔNG KHÁCH HÀNG', value: '12,842', change: '+2.4%', trend: 'up', color: 'text-secondary' },
          { icon: 'account_balance_wallet', label: 'TÀI KHOẢN HOẠT ĐỘNG', value: '45,108', change: '+1.8%', trend: 'up', color: 'text-secondary' },
          { icon: 'sync_alt', label: 'GIAO DỊCH HÔM NAY', value: '3,492', change: 'Ổn định', trend: 'neutral' },
          { icon: 'payments', label: 'GIÁ TRỊ GIAO DỊCH', value: '84.2B', change: '+5.2%', trend: 'up', color: 'text-secondary' },
          { icon: 'real_estate_agent', label: 'KHOẢN VAY HOẠT ĐỘNG', value: '1,250', change: '-0.5%', trend: 'down', color: 'text-error' },
          { icon: 'pending_actions', label: 'HÓA ĐƠN CHƯA THANH TOÁN', value: '412', change: 'Cần xử lý', trend: 'warning', color: 'text-error' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-outline-variant p-4 flex flex-col justify-between rounded-lg shadow-sm">
            <div>
              <span className={cn("material-symbols-outlined mb-2 block", i === 2 ? "text-tertiary-container" : i === 4 ? "text-primary-container" : i === 5 ? "text-error" : i === 0 ? "text-secondary" : "text-primary")}>{stat.icon}</span>
              <p className="label-uppercase text-on-surface-variant uppercase">{stat.label}</p>
            </div>
            <div className="mt-4">
              <p className="font-display font-bold text-32 truncate">{stat.value}</p>
              <p className={cn("text-[10px] flex items-center gap-1", stat.trend === 'up' ? 'text-secondary' : stat.trend === 'down' ? 'text-error' : 'text-on-surface-variant')}>
                {stat.trend === 'up' && <span className="material-symbols-outlined text-[14px]">trending_up</span>}
                {stat.trend === 'down' && <span className="material-symbols-outlined text-[14px]">warning</span>}
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Two Large Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-outline-variant p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm text-primary">Khối Lượng Giao Dịch Hàng Ngày</h3>
            <span className="bg-primary-fixed text-on-primary-fixed text-[10px] px-2 py-1 font-bold rounded">HÀNG THÁNG</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002147" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#002147" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#74777f'}} />
                <Tooltip />
                <Area type="monotone" dataKey="volume" stroke="#002147" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm text-primary">Số Dư Theo Nhóm Khách Hàng</h3>
            <Settings className="w-5 h-5 text-outline cursor-pointer" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegmentData}>
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#74777f'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#002147" radius={[2, 2, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Table & Sidebar Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white border border-outline-variant rounded-lg overflow-hidden">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-semibold text-sm text-primary">Giao Dịch Gần Đây</h3>
            <button className="text-primary-container text-sm hover:underline">Xem tất cả</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-3 label-uppercase text-on-surface-variant">Mã GD</th>
                  <th className="px-6 py-3 label-uppercase text-on-surface-variant">Khách Hàng</th>
                  <th className="px-6 py-3 label-uppercase text-on-surface-variant">Số Tiền</th>
                  <th className="px-6 py-3 label-uppercase text-on-surface-variant">Trạng Thái</th>
                  <th className="px-6 py-3 label-uppercase text-on-surface-variant">Ngày Giờ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {[
                  { id: '#TXN-49021', name: 'Nguyễn Văn Thành', initial: 'NT', amount: '25,000,000 VND', status: 'COMPLETED', time: '14:20 - 24/10/2023', color: 'bg-primary-fixed text-on-primary-fixed' },
                  { id: '#TXN-49022', name: 'Lê Minh Hoàng', initial: 'LH', amount: '142,500,000 VND', status: 'PENDING', time: '14:15 - 24/10/2023', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
                  { id: '#TXN-49023', name: 'Trần Thị Phương', initial: 'TP', amount: '2,300,000 VND', status: 'FAILED', time: '13:58 - 24/10/2023', color: 'bg-primary-container text-white' },
                ].map((txn, i) => (
                  <tr key={i} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4 font-numeric-data">{txn.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold", txn.color)}>{txn.initial}</div>
                        <span className="text-sm font-medium">{txn.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-numeric-data">{txn.amount}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold",
                        txn.status === 'COMPLETED' ? 'bg-secondary-container text-on-secondary-container' : 
                        txn.status === 'PENDING' ? 'bg-surface-container-highest text-on-surface-variant' : 
                        'bg-error-container text-on-error-container'
                      )}>{txn.status}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-on-surface-variant">{txn.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-outline-variant p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-error">gpp_maybe</span> Cảnh Báo Bảo Mật
              </h3>
              <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full">2 MỚI</span>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-error-container rounded-lg border-l-4 border-error">
                <p className="font-bold text-sm text-on-error-container">Đăng nhập bất thường</p>
                <p className="text-[11px] text-on-error-container opacity-80">IP: 192.168.1.105 • 10 phút trước</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg border-l-4 border-outline">
                <p className="font-bold text-sm text-on-surface">Thay đổi hạn mức thẻ</p>
                <p className="text-[11px] text-on-surface-variant">Thẻ đuôi *9021 • 1 giờ trước</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant p-4 rounded-lg flex-1">
            <h3 className="font-semibold text-sm text-primary mb-4 flex items-center gap-2">
              <History className="w-4 h-4" /> Nhật Ký Hệ Thống
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Tạo tài khoản mới', desc: 'Admin [ID: 29] thực hiện', time: '14:05:22' },
                { title: 'Phê duyệt khoản vay', desc: 'Hệ thống tự động phê duyệt', time: '13:52:10' },
                { title: 'Cập nhật tỷ giá', desc: 'Từ nguồn dữ liệu Reuters', time: '13:00:00' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 bg-outline-variant rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold">{log.title}</p>
                    <p className="text-[11px] text-on-surface-variant">{log.desc}</p>
                    <p className="text-[10px] text-outline font-numeric-data">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-outline-variant rounded text-sm font-medium hover:bg-surface-container-low transition-colors">Tải báo cáo nhật ký</button>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 bg-primary-container text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
