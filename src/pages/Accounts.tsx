import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  History, 
  Send, 
  LockOpen,
  Filter,
  Download,
  ChevronLeft,
  Users,
  ReceiptText,
  CreditCard,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialAccounts = [
  { id: '1902 4456 789 012', name: 'Nguyễn Văn Lợi', initial: 'NL', type: 'Thanh toán', balance: '1,245,000,000', status: 'Hoạt động', date: '12/05/2023', color: 'bg-primary-fixed' },
  { id: '1902 8823 445 119', name: 'Phạm Minh Tuấn', initial: 'PT', type: 'Tiết kiệm', balance: '15,800,000,000', status: 'Đã khóa', date: '24/01/2022', color: 'bg-secondary-container' },
  { id: '1902 1198 223 008', name: 'Trần Thu Hà', initial: 'TH', type: 'Thanh toán', balance: '85,240,000', status: 'Hoạt động', date: '05/09/2023', color: 'bg-primary-fixed' },
  { id: '1902 5567 112 443', name: 'Lê Văn Vũ', initial: 'LV', type: 'Vay vốn', balance: '-2,450,000,000', status: 'Hoạt động', date: '15/02/2021', color: 'bg-tertiary-fixed' },
];

export default function Accounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Tất cả');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredAccounts = useMemo(() => {
    return initialAccounts.filter(acc => {
      const matchesSearch = acc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           acc.id.includes(searchTerm);
      const matchesType = filterType === 'Tất cả' || acc.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const handleOpenDetail = (acc: any) => {
    setSelectedAccount(acc);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Quản lý tài khoản</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Danh sách tài khoản ngân hàng</h2>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Mở tài khoản mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TỔNG THANH KHOẢN', value: '45.2B', icon: <Building2 className="w-5 h-5" />, color: 'primary' },
          { label: 'TÀI KHOẢN HOẠT ĐỘNG', value: '842', icon: <Users className="w-5 h-5" />, color: 'secondary' },
          { label: 'TÀI KHOẢN ĐANG KHÓA', value: '12', icon: <Lock className="w-5 h-5" />, color: 'error' },
          { label: 'THANH KHOẢN RÒNG', value: '+2.4%', icon: <TrendingUp className="w-5 h-5" />, color: 'tertiary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className={cn("p-2.5 rounded-xl", `bg-${stat.color}-container text-on-${stat.color}-container`)}>
                {stat.icon}
              </span>
            </div>
            <div>
              <p className="label-uppercase text-on-surface-variant mb-1">{stat.label}</p>
              <p className="font-display font-bold text-2xl text-primary tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center gap-4 border-b border-outline-variant bg-surface-container-low/20">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['Tất cả', 'Thanh toán', 'Tiết kiệm', 'Vay vốn'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                  filterType === type 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                )}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="md:flex-1"></div>
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input 
              type="text" 
              placeholder="Số tài khoản, tên khách hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Số tài khoản</th>
                <th>Khách hàng</th>
                <th>Phân loại</th>
                <th className="text-right">Số dư hiện tại</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc, i) => (
                <tr key={i}>
                  <td>
                    <span className="font-numeric-data text-primary font-bold">{acc.id}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white shadow-sm", acc.color)}>
                        {acc.initial}
                      </div>
                      <span className="font-bold text-sm text-on-surface">{acc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-0.5 rounded-full ring-1 ring-outline-variant/30">
                      {acc.type}
                    </span>
                  </td>
                  <td className="text-right">
                    <span className={cn("font-numeric-data font-bold", acc.balance.startsWith('-') ? 'text-error' : 'text-primary')}>
                      {acc.balance} <span className="text-[9px] font-bold opacity-40 ml-0.5">VNĐ</span>
                    </span>
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      acc.status === 'Hoạt động' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    )}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetail(acc)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <History className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-outline font-medium">Không tìm thấy tài khoản phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Mở tài khoản mới">
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Chọn khách hàng</label>
            <div className="relative">
              <input type="text" placeholder="Tìm tên hoặc ID khách hàng..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Loại tài khoản</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>Tài khoản thanh toán</option>
                <option>Tài khoản tiết kiệm</option>
                <option>Tài khoản ưu đãi</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tiền tệ</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>VNĐ</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Mở tài khoản</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết tài khoản">
        {selectedAccount && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
              <div>
                <p className="text-[10px] font-bold uppercase text-outline mb-1">Số tài khoản</p>
                <p className="font-numeric-data text-lg text-primary font-bold">{selectedAccount.id}</p>
              </div>
              <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", selectedAccount.status === 'Hoạt động' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error')}>
                {selectedAccount.status}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
                <span className="text-sm text-on-surface-variant">Chủ tài khoản</span>
                <span className="text-sm font-bold text-primary">{selectedAccount.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
                <span className="text-sm text-on-surface-variant">Loại tài khoản</span>
                <span className="text-sm font-bold">{selectedAccount.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
                <span className="text-sm text-on-surface-variant">Số dư hiện tại</span>
                <span className="font-numeric-data font-bold text-primary">{selectedAccount.balance} VNĐ</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/50">
                <span className="text-sm text-on-surface-variant">Ngày mở tài khoản</span>
                <span className="text-sm font-bold">{selectedAccount.date}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all">
                <History className="w-6 h-6 text-primary" />
                <span className="text-[10px] font-bold uppercase">Lịch sử GD</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-[10px] font-bold uppercase">Thẻ liên kết</span>
              </button>
            </div>

            <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Quay lại danh sách <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

