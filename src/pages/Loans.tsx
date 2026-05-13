import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  History, 
  FileText,
  Filter,
  Download,
  Calendar,
  AlertCircle,
  ArrowRight,
  BadgeDollarSign,
  Briefcase,
  Eye
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialLoans = [
  { id: 'L-998271', customer: 'Nguyễn Văn Lợi', amount: '2,500,000,000', interest: '8.5%', duration: '24 tháng', status: 'Active', nextPayment: '12/11/2023', paid: '1,200,000,000' },
  { id: 'L-998272', customer: 'Công ty TechCorp', amount: '15,000,000,000', interest: '7.2%', duration: '60 tháng', status: 'Active', nextPayment: '15/11/2023', paid: '3,500,000,000' },
  { id: 'L-998273', customer: 'Lê Minh Tuấn', amount: '500,000,000', interest: '9.0%', duration: '12 tháng', status: 'Late', nextPayment: '02/11/2023', paid: '450,000,000' },
  { id: 'L-998274', customer: 'Trần Thu Hà', amount: '1,200,000,000', interest: '8.8%', duration: '36 tháng', status: 'Pending', nextPayment: '-', paid: '0' },
];

export default function Loans() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredLoans = useMemo(() => {
    return initialLoans.filter(loan => 
      loan.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleOpenDetail = (loan: any) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Quản lý tín dụng</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Theo dõi khoản vay & Tín dụng</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo hồ sơ vay
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TỔNG DƯ NỢ', value: '45.2B', icon: <BadgeDollarSign className="w-5 h-5" />, color: 'primary' },
          { label: 'KHOẢN VAY QUÁ HẠN', value: '12', icon: <AlertCircle className="w-5 h-5" />, color: 'error' },
          { label: 'YÊU CẦU MỚI', value: '28', icon: <Briefcase className="w-5 h-5" />, color: 'secondary' },
          { label: 'TỶ LỆ NỢ XẤU', value: '0.45%', icon: <TrendingDown className="w-5 h-5" />, color: 'tertiary' },
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
              placeholder="Tìm kiếm hồ sơ vay, khách hàng..." 
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
                <th>Mã hồ sơ</th>
                <th>Khách hàng</th>
                <th className="text-right">Số tiền vay</th>
                <th className="text-center">Kỳ hạn</th>
                <th>Tiến độ</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan, i) => (
                <tr key={i}>
                  <td>
                    <span className="font-numeric-data text-primary font-bold">{loan.id}</span>
                  </td>
                  <td>
                    <span className="font-bold text-sm text-on-surface">{loan.customer}</span>
                  </td>
                  <td className="text-right">
                    <p className="font-numeric-data text-sm font-bold text-primary">{loan.amount}</p>
                    <p className="text-[9px] text-outline font-bold uppercase tracking-tighter">Next: {loan.nextPayment}</p>
                  </td>
                  <td className="text-center">
                    <p className="text-xs font-bold">{loan.duration}</p>
                    <p className="text-[9px] text-outline font-medium uppercase tracking-widest">{loan.interest} APR</p>
                  </td>
                  <td>
                    <div className="w-32 space-y-1">
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${Math.min(100, (parseInt(loan.paid.replace(/,/g, '')) / parseInt(loan.amount.replace(/,/g, '')) * 100))}%` }}
                        ></div>
                      </div>
                      <p className="text-[9px] font-bold text-outline uppercase">{Math.round((parseInt(loan.paid.replace(/,/g, '')) / parseInt(loan.amount.replace(/,/g, '')) * 100))}% đã trả</p>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      loan.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 
                      loan.status === 'Late' ? 'bg-error-container text-on-error-container' : 
                      'bg-surface-container-highest text-on-surface-variant'
                    )}>
                      {loan.status === 'Active' ? 'Đang vay' : loan.status === 'Late' ? 'Quá hạn' : 'Chờ duyệt'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetail(loan)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-outline font-medium">Không tìm thấy hồ sơ vay phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Loan Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo hồ sơ vay mới" maxWidth="lg">
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Khách hàng vay</label>
            <input type="text" placeholder="Tìm tên hoặc ID khách hàng..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Số tiền đề nghị</label>
              <input type="text" placeholder="Nhập số tiền..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Thời hạn (tháng)</label>
              <input type="number" placeholder="Ví dụ: 12, 24, 36..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Mục đích vay</label>
            <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
              <option>Vay kinh doanh</option>
              <option>Vay tiêu dùng</option>
              <option>Vay mua nhà/xe</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Gửi yêu cầu phê duyệt</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Hồ sơ vay chi tiết">
        {selectedLoan && (
          <div className="p-6 space-y-6">
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Mã hồ sơ</p>
                <p className="font-numeric-data text-xl text-primary font-bold">{selectedLoan.id}</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                selectedLoan.status === 'Active' ? 'bg-secondary/10 text-secondary' : 'bg-error-container text-on-error-container'
              )}>
                {selectedLoan.status === 'Active' ? 'Active' : selectedLoan.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Khách hàng</p>
                <p className="text-sm font-bold">{selectedLoan.customer}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Số tiền vay</p>
                <p className="text-sm font-bold">{selectedLoan.amount} VNĐ</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Lãi suất</p>
                <p className="text-sm font-bold">{selectedLoan.interest}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Kỳ hạn</p>
                <p className="text-sm font-bold">{selectedLoan.duration}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Đã tất toán</p>
                <p className="text-sm font-bold text-secondary">{selectedLoan.paid} VNĐ</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Ngày thanh toán tiếp</p>
                <p className="text-sm font-bold">{selectedLoan.nextPayment}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <p className="text-[10px] font-bold uppercase text-outline mb-3">Tác vụ quản lý</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface border border-outline-variant text-[10px] font-bold hover:bg-surface-container-low transition-all">
                  <FileText className="w-4 h-4" /> In hợp đồng
                </button>
                <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface border border-outline-variant text-[10px] font-bold hover:bg-surface-container-low transition-all">
                  <History className="w-4 h-4" /> Lịch sử thanh toán
                </button>
              </div>
            </div>

            <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Báo cáo nợ chi tiết <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

