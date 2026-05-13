import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  History, 
  FileText,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  Receipt,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialBills = [
  { id: 'BILL-44921', service: 'Tiền điện EVN', customer: 'Nguyễn Văn Thành', amount: '1,240,000', dueDate: '15/11/2023', status: 'Paid', provider: 'EVN Miền Bắc' },
  { id: 'BILL-44922', service: 'Tiền nước Sawaco', customer: 'Lê Minh Hoàng', amount: '245,000', dueDate: '10/11/2023', status: 'Unpaid', provider: 'Sawaco TP.HCM' },
  { id: 'BILL-44923', service: 'Internet Viettel', customer: 'Trần Thị Phương', amount: '350,000', dueDate: '20/11/2023', status: 'Paid', provider: 'Viettel Telecom' },
  { id: 'BILL-44924', service: 'Chung cư Vinhomes', customer: 'Vũ Anh Duy', amount: '2,800,000', dueDate: '05/11/2023', status: 'Overdue', provider: 'Vinhomes Management' },
];

export default function Bills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredBills = useMemo(() => {
    return initialBills.filter(bill => 
      bill.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.includes(searchTerm) ||
      bill.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleOpenDetail = (bill: any) => {
    setSelectedBill(bill);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Thanh toán hóa đơn</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Quản lý & Thanh toán hóa đơn</h2>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo hóa đơn mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'HÓA ĐƠN THÁNG NÀY', value: '45,210', icon: <Receipt className="w-5 h-5" />, color: 'primary' },
          { label: 'CHƯA THANH TOÁN', value: '1,250', icon: <Clock className="w-5 h-5" />, color: 'tertiary' },
          { label: 'QUÁ HẠN 7 NGÀY', value: '142', icon: <AlertCircle className="w-5 h-5" />, color: 'error' },
          { label: 'DOANH THU THU HỘ', value: '8.4B', icon: <TrendingUp className="w-5 h-5" />, color: 'secondary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className={cn("p-2.5 rounded-xl w-fit mb-4", `bg-${stat.color}-container text-on-${stat.color}-container`)}>
              {stat.icon}
            </div>
            <div>
              <p className="label-uppercase text-on-surface-variant mb-1">{stat.label}</p>
              <p className="font-display font-bold text-2xl text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center gap-4 border-b border-outline-variant bg-surface-container-low/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input 
              type="text" 
              placeholder="Tìm kiếm hóa đơn, dịch vụ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-surface border border-outline-variant p-2 rounded-lg hover:bg-surface-container-low transition-all">
              <Download className="w-4 h-4 text-outline" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Thông tin đối tác</th>
                <th>Khách hàng</th>
                <th className="text-right">Số tiền</th>
                <th>Hạn thanh toán</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 text-primary rounded-lg border border-primary/10">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-primary">{bill.service}</span>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs font-bold text-on-surface-variant">{bill.provider}</p>
                    <p className="text-[10px] text-outline font-bold uppercase tracking-tighter">REF: {bill.id}</p>
                  </td>
                  <td>
                    <span className="font-bold text-sm text-on-surface truncate max-w-[120px] block">{bill.customer}</span>
                  </td>
                  <td className="text-right">
                    <span className="font-numeric-data text-sm font-bold text-primary">{bill.amount}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      {bill.dueDate}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      bill.status === 'Paid' ? 'bg-secondary-container text-on-secondary-container' : 
                      bill.status === 'Overdue' ? 'bg-error-container text-on-error-container' : 
                      'bg-surface-container-highest text-on-surface-variant'
                    )}>
                      {bill.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : 
                       bill.status === 'Overdue' ? <AlertCircle className="w-3 h-3" /> : 
                       <Clock className="w-3 h-3" />}
                      {bill.status === 'Paid' ? 'Đã thu' : bill.status === 'Overdue' ? 'Quá hạn' : 'Chờ thu'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetail(bill)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-outline font-medium">Không tìm thấy hóa đơn phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bill Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo hóa đơn thanh toán mới">
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Loại dịch vụ</label>
            <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Tiền điện EVN</option>
              <option>Tiền nước Sawaco</option>
              <option>Viễn thông / Internet</option>
              <option>Phí chung cư / Dự án</option>
              <option>Thuế / Phí nhà nước</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Mã khách hàng (Provider ID)</label>
              <input type="text" placeholder="Vd: PE01..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Số tiền thu hộ</label>
              <input type="text" placeholder="0 VNĐ" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Ngày hết hạn thanh toán</label>
            <input type="date" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Tạo hóa đơn</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Hóa đơn điện tử chi tiết">
        {selectedBill && (
          <div className="p-6 space-y-6">
            <div className="p-6 bg-surface-container rounded-3xl border border-outline-variant flex flex-col items-center text-center">
              <div className="p-3 bg-white rounded-2xl shadow-sm mb-4 ring-1 ring-outline-variant/50">
                <Receipt className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display font-bold text-lg text-primary">{selectedBill.service}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline">{selectedBill.provider}</p>
              <div className="mt-4 py-2 px-6 bg-white rounded-full border border-outline-variant shadow-inner font-numeric-data text-2xl font-bold text-primary">
                {selectedBill.amount} VNĐ
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Mã hóa đơn</span>
                <span className="font-bold text-primary">{selectedBill.id}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Khách hàng</span>
                <span className="font-bold">{selectedBill.customer}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Hạn thanh toán</span>
                <span className="font-bold text-error">{selectedBill.dueDate}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Trạng thái</span>
                <span className={cn(
                  "font-bold uppercase text-[10px]",
                  selectedBill.status === 'Paid' ? 'text-secondary' : 'text-error'
                )}>{selectedBill.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all">
                <History className="w-6 h-6 text-primary" />
                <span className="text-[9px] font-bold uppercase">Lịch sử thu</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-[9px] font-bold uppercase">Gửi nhắc nhợ</span>
              </button>
            </div>

            <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              In hóa đơn thu hộ <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

