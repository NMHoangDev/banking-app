import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ChevronRight, 
  MoreHorizontal,
  Eye,
  FileEdit,
  IdCard,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  Plus,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const stats = [
  { label: 'TỔNG KHÁCH HÀNG', value: '24,582', change: '+12%', icon: 'group', color: 'primary' },
  { label: 'KHÁCH HÀNG VIP', value: '1,204', change: '+5.2%', icon: 'verified_user', color: 'secondary' },
  { label: 'CHỜ PHÊ DUYỆT', value: '156', change: '-2.4%', icon: 'hourglass_empty', color: 'error' },
  { label: 'TÀI KHOẢN KHÓA', value: '42', icon: 'block', color: 'on-tertiary-container' },
];

const initialCustomers = [
  { name: 'Nguyễn Văn Hoàng', id: '48293-94', dob: '12/05/1988', gender: 'Nam', phone: '0912 345 678', email: 'hoang.nv@email.com', address: 'Số 15, Phố Duy Tân, Cầu Giấy, Hà Nội', created: '15/01/2021', status: 'Hoạt động', accounts: 3, initial: 'NH', color: 'bg-primary-fixed' },
  { name: 'Trần Thị Lan', id: '59302-12', dob: '24/11/1995', gender: 'Nữ', phone: '0988 776 554', email: 'lan.tran95@email.com', address: 'Landmark 81, P22, Bình Thạnh, TP.HCM', created: '02/03/2023', status: 'Hoạt động', accounts: 1, initial: 'TL', color: 'bg-secondary-container' },
  { name: 'Phạm Anh Tuấn', id: '67210-55', dob: '05/09/1982', gender: 'Nam', phone: '0903 445 566', email: 'tuan.pa@workmail.vn', address: '24 Đường Láng, Đống Đa, Hà Nội', created: '19/11/2019', status: 'Đã khóa', accounts: 2, initial: 'PT', color: 'bg-tertiary-fixed' },
  { name: 'Lê Minh', id: '71204-09', dob: '15/07/2000', gender: 'Nam', phone: '0332 111 222', email: 'minh.le@outlook.com', address: 'Số 102, Trần Hưng Đạo, Hải Phòng', created: '05/01/2024', status: 'Chờ xác thực', accounts: 0, initial: 'LM', color: 'bg-surface-container-highest' },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.includes(searchTerm) ||
      c.phone.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleOpenDetail = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary">Quản lý khách hàng</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Danh sách khách hàng</h2>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm hover:bg-primary/90 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm khách hàng
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2.5 rounded-xl", `bg-${stat.color}/10 text-${stat.color}`)}>
                <span className="material-symbols-outlined text-20">{stat.icon}</span>
              </div>
              {stat.change && (
                <span className={cn(
                  "text-[9px] font-bold flex items-center bg-opacity-10 px-2 py-0.5 rounded-full",
                  stat.change.startsWith('+') ? "bg-secondary text-secondary" : "bg-error text-error"
                )}>
                  {stat.change}
                </span>
              )}
            </div>
            <div>
              <p className="label-uppercase text-on-surface-variant mb-1">{stat.label}</p>
              <p className="font-display font-bold text-2xl tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center gap-4 border-b border-outline-variant bg-surface-container-low/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input 
              type="text" 
              placeholder="Tìm kiếm khách hàng, ID, số điện thoại..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center bg-surface border border-outline-variant px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
              <Filter className="w-4 h-4 mr-2" />
              Lọc nâng cao
            </button>
            <button className="bg-surface border border-outline-variant p-2 rounded-lg hover:bg-surface-container-low transition-all">
              <Download className="w-4 h-4 text-outline" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Thông tin liên hệ</th>
                <th className="hidden lg:table-cell">Địa chỉ</th>
                <th>Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center">
                      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-primary font-bold text-xs ring-2 ring-white shadow-sm mr-3", cust.color)}>
                        {cust.initial}
                      </div>
                      <div>
                        <p className="font-bold text-primary truncate max-w-[150px]">{cust.name}</p>
                        <p className="text-[9px] font-bold text-outline tracking-wider uppercase">ID: {cust.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="font-numeric-data text-xs">{cust.phone}</p>
                    <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{cust.email}</p>
                  </td>
                  <td className="hidden lg:table-cell">
                    <p className="text-[10px] text-on-surface-variant line-clamp-1 max-w-[200px]">
                      {cust.address}
                    </p>
                  </td>
                  <td>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      cust.status === 'Hoạt động' ? 'bg-secondary-container text-on-secondary-container' : 
                      cust.status === 'Đã khóa' ? 'bg-error-container text-on-error-container' : 
                      'bg-surface-container-highest text-on-surface-variant'
                    )}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetail(cust)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant" title="Chi tiết">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant" title="Sửa">
                        <FileEdit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-outline font-medium">
                    Không tìm thấy khách hàng phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-surface-container-low/30 px-6 py-4 border-t border-outline-variant flex items-center justify-between">
          <p className="text-[10px] font-bold text-on-surface-variant flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Tổng số {initialCustomers.length} bản ghi
          </p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg border border-outline-variant bg-white disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold px-3 py-1 bg-primary text-white rounded-lg">1</span>
            <button className="p-1.5 rounded-lg border border-outline-variant bg-white hover:bg-surface-container-low transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Thêm khách hàng mới"
        maxWidth="lg"
      >
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Họ và tên</label>
              <input type="text" placeholder="Nhập tên khách hàng" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Ngày sinh</label>
              <input type="date" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Số điện thoại</label>
              <input type="tel" placeholder="09xx..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Email</label>
              <input type="email" placeholder="example@bank.com" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Địa chỉ thường trú</label>
            <textarea placeholder="Nhập địa chỉ chi tiết" rows={3} className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Tạo khách hàng</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title="Thông tin chi tiết"
      >
        {selectedCustomer && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 p-4 bg-primary-container/10 rounded-2xl border border-primary/10">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-md", selectedCustomer.color)}>
                {selectedCustomer.initial}
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-primary">{selectedCustomer.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Customer ID: {selectedCustomer.id}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase text-outline mb-1">Ngày sinh</p>
                  <p className="text-sm font-semibold">{selectedCustomer.dob}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-outline mb-1">Giới tính</p>
                  <p className="text-sm font-semibold">{selectedCustomer.gender}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-outline mb-1">Ngày tham gia</p>
                  <p className="text-sm font-semibold">{selectedCustomer.created}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase text-outline mb-1">Số tài khoản</p>
                  <p className="text-sm font-semibold">{selectedCustomer.accounts}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-outline-variant">
                <p className="text-[9px] font-bold uppercase text-outline mb-3">Liên kết nhanh</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-surface border border-outline-variant text-[10px] font-bold hover:bg-surface-container-low transition-all">
                    <UserPlus className="w-3.5 h-3.5" /> Xem tài khoản
                  </button>
                  <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-surface border border-outline-variant text-[10px] font-bold hover:bg-surface-container-low transition-all">
                    <IdCard className="w-3.5 h-3.5" /> Quản lý thẻ
                  </button>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-8 py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Đến hồ sơ khách hàng <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

