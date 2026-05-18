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
  Eye,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialLoans = [
  { id: 'L-998271', customer: 'Nguyễn Văn Lợi', amount: '2,500,000,000', interest: '8.5%', duration: '24', status: 'Active', nextPayment: '12/11/2023', paid: '1,200,000,000' },
  { id: 'L-998272', customer: 'Công ty TechCorp', amount: '15,000,000,000', interest: '7.2%', duration: '60', status: 'Active', nextPayment: '15/11/2023', paid: '3,500,000,000' },
  { id: 'L-998273', customer: 'Lê Minh Tuấn', amount: '500,000,000', interest: '9.0%', duration: '12', status: 'Late', nextPayment: '02/11/2023', paid: '450,000,000' },
  { id: 'L-998274', customer: 'Trần Thu Hà', amount: '1,200,000,000', interest: '8.8%', duration: '36', status: 'Pending', nextPayment: '-', paid: '0' },
];

export default function Loans() {
  const [loans, setLoans] = useState(initialLoans);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Loan Payment Flow Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [loanToPay, setLoanToPay] = useState<any>(null);
  const [payStep, setPayStep] = useState(1);
  const [paymentAccount, setPaymentAccount] = useState('1000000001');
  const [payAmount, setPayAmount] = useState('50,000,000');

  // Form state for creating a loan
  const [newCustomer, setNewCustomer] = useState('');
  const [newAmount, setNewAmount] = useState('500,000,000');
  const [newDuration, setNewDuration] = useState('24');
  const [newInterest, setNewInterest] = useState('8.5');
  const [newPurpose, setNewPurpose] = useState('Vay kinh doanh');

  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const matchesSearch = loan.customer.toLowerCase().includes(searchTerm.toLowerCase()) || loan.id.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, loans]);

  const handleOpenDetail = (loan: any) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
  };

  const handleOpenPayFlow = (loan: any) => {
    setLoanToPay(loan);
    // Suggest standard monthly payment or 50M
    const remainingVal = parseInt(loan.amount.replace(/,/g, '')) - parseInt(loan.paid.replace(/,/g, ''));
    const suggested = Math.min(remainingVal, 50000000);
    setPayAmount(suggested.toLocaleString());
    setPayStep(1);
    setIsPayModalOpen(true);
  };

  const executeLoanPayment = () => {
    if (!loanToPay) return;
    const cleanPayAmount = parseInt(payAmount.replace(/,/g, ''));
    
    setLoans(prevLoans => 
      prevLoans.map(l => {
        if (l.id === loanToPay.id) {
          const currentPaid = parseInt(l.paid.replace(/,/g, ''));
          const newPaidVal = currentPaid + cleanPayAmount;
          const totalLoan = parseInt(l.amount.replace(/,/g, ''));
          const newStatus = newPaidVal >= totalLoan ? 'Closed' : l.status === 'Late' ? 'Active' : l.status;
          return {
            ...l,
            paid: newPaidVal.toLocaleString(),
            status: newStatus
          };
        }
        return l;
      })
    );

    // If detail modal is open for the same loan, update selectedLoan
    if (selectedLoan && selectedLoan.id === loanToPay.id) {
      setSelectedLoan((prev: any) => {
        const currentPaid = parseInt(prev.paid.replace(/,/g, ''));
        const newPaidVal = currentPaid + cleanPayAmount;
        const totalLoan = parseInt(prev.amount.replace(/,/g, ''));
        const newStatus = newPaidVal >= totalLoan ? 'Closed' : prev.status === 'Late' ? 'Active' : prev.status;
        return {
          ...prev,
          paid: newPaidVal.toLocaleString(),
          status: newStatus
        };
      });
    }

    setPayStep(3); // Go to Success
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `L-${Math.floor(100000 + Math.random() * 900000)}`;
    const newLoan = {
      id: generatedId,
      customer: newCustomer,
      amount: newAmount,
      interest: `${newInterest}%`,
      duration: `${newDuration} tháng`,
      status: 'Pending',
      nextPayment: '-',
      paid: '0'
    };

    setLoans(prev => [newLoan, ...prev]);
    setIsAddModalOpen(false);
    // Reset Form
    setNewCustomer('');
    setNewAmount('500,000,000');
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
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#002147] hover:bg-[#001936] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo hồ sơ vay mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TỔNG DƯ NỢ CẤP PHÁT', value: loans.filter(l => l.status === 'Active' || l.status === 'Late').reduce((sum, l) => sum + parseInt(l.amount.replace(/,/g, '')), 0).toLocaleString() + ' VND', icon: <BadgeDollarSign className="w-5 h-5" />, color: 'primary' },
          { label: 'KHOẢN VAY QUÁ HẠN', value: loans.filter(l => l.status === 'Late').length, icon: <AlertCircle className="w-5 h-5" />, color: 'error' },
          { label: 'HỒ SƠ CHỜ PHÊ DUYỆT', value: loans.filter(l => l.status === 'Pending').length, icon: <Briefcase className="w-5 h-5" />, color: 'secondary' },
          { label: 'ĐÃ TẤT TOÁN', value: loans.filter(l => l.status === 'Closed').length, icon: <CheckCircle2 className="w-5 h-5" />, color: 'tertiary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
            <div className={cn("p-2.5 rounded-xl w-fit mb-4", `bg-${stat.color}-container text-on-${stat.color}-container`)}>
              {stat.icon}
            </div>
            <div>
              <p className="label-uppercase text-on-surface-variant mb-1">{stat.label}</p>
              <p className="font-display font-bold text-xl text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center gap-4 border-b border-outline-variant bg-surface-container-low/30 justify-between">
          <div className="flex flex-1 max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã vay, khách hàng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 text-xs font-bold text-on-surface-variant focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="Active">Đang vay</option>
              <option value="Late">Quá hạn</option>
              <option value="Pending">Chờ duyệt</option>
            </select>
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
                <th className="text-right">Số tiền vay (VND)</th>
                <th className="text-center">Kỳ hạn / Lãi suất</th>
                <th>Tiến độ thanh toán</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const total = parseInt(loan.amount.replace(/,/g, ''));
                const paid = parseInt(loan.paid.replace(/,/g, ''));
                const percent = total > 0 ? Math.round((paid / total) * 100) : 0;
                
                return (
                  <tr key={loan.id}>
                    <td>
                      <span className="font-numeric-data text-primary font-bold">{loan.id}</span>
                    </td>
                    <td>
                      <span className="font-bold text-sm text-on-surface">{loan.customer}</span>
                    </td>
                    <td className="text-right">
                      <p className="font-numeric-data text-sm font-bold text-primary">{loan.amount}</p>
                      {loan.nextPayment !== '-' && (
                        <p className="text-[9px] text-outline font-bold uppercase tracking-tighter">Hạn: {loan.nextPayment}</p>
                      )}
                    </td>
                    <td className="text-center">
                      <p className="text-xs font-bold">{loan.duration.includes('tháng') ? loan.duration : `${loan.duration} tháng`}</p>
                      <p className="text-[9px] text-outline font-medium uppercase tracking-widest">{loan.interest} APR</p>
                    </td>
                    <td>
                      <div className="w-32 space-y-1">
                        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <p className="text-[9px] font-bold text-outline uppercase">{percent}% đã trả ({loan.paid} VND)</p>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        loan.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 
                        loan.status === 'Late' ? 'bg-error-container text-on-error-container' : 
                        'bg-surface-container-highest text-on-surface-variant'
                      )}>
                        {loan.status === 'Active' ? 'Đang vay' : loan.status === 'Late' ? 'Quá hạn' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenDetail(loan)}
                          className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-primary"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {(loan.status === 'Active' || loan.status === 'Late') && (
                          <button 
                            onClick={() => handleOpenPayFlow(loan)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg uppercase shadow-sm transition-all"
                            title="Trả nợ"
                          >
                            Trả nợ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-outline font-medium">Không tìm thấy hồ sơ vay phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Loan Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo hồ sơ vay mới" maxWidth="lg">
        <form onSubmit={handleCreateLoan} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Họ & Tên người vay / Tổ chức</label>
            <input 
              type="text" 
              required
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder="Nhập tên người vay hoặc tên doanh nghiệp..." 
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Số tiền vay đề nghị (VND)</label>
              <input 
                type="text" 
                required
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Ví dụ: 500,000,000..." 
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Kỳ hạn vay (tháng)</label>
              <input 
                type="number" 
                required
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                placeholder="Ví dụ: 12, 24, 36, 60..." 
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Lãi suất năm (% APR)</label>
              <input 
                type="text" 
                required
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Ví dụ: 8.5" 
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Mục đích sử dụng vốn</label>
              <select 
                value={newPurpose}
                onChange={(e) => setNewPurpose(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="Vay kinh doanh">Vay phát triển kinh doanh</option>
                <option value="Vay tiêu dùng">Vay tiêu dùng cá nhân</option>
                <option value="Vay mua nhà/xe">Vay mua nhà / mua ô tô</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Gửi yêu cầu phê duyệt</button>
          </div>
        </form>
      </Modal>

      {/* Loan Payment 2-Step Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Thực hiện thanh toán nợ gốc / lãi">
        {loanToPay && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", payStep >= 1 ? "bg-[#002147] text-white" : "bg-surface-container-high text-on-surface-variant")}>1</div>
              <div className="w-12 h-0.5 bg-outline-variant"></div>
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", payStep >= 2 ? "bg-[#002147] text-white" : "bg-surface-container-high text-on-surface-variant")}>2</div>
              <div className="w-12 h-0.5 bg-outline-variant"></div>
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", payStep >= 3 ? "bg-emerald-600 text-white" : "bg-surface-container-high text-on-surface-variant")}>
                {payStep === 3 ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
            </div>

            {payStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/30">
                  <p className="text-[9px] font-bold text-outline uppercase tracking-wider mb-1">Chi tiết khoản vay</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-[#002147]">{loanToPay.customer} ({loanToPay.id})</span>
                    <span className="text-xs font-bold text-outline">Dư nợ: {(parseInt(loanToPay.amount.replace(/,/g, '')) - parseInt(loanToPay.paid.replace(/,/g, ''))).toLocaleString()} VND</span>
                  </div>
                  <div className="w-full h-1 bg-outline-variant rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600" 
                      style={{ width: `${Math.round((parseInt(loanToPay.paid.replace(/,/g, '')) / parseInt(loanToPay.amount.replace(/,/g, ''))) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tài khoản trích nợ</label>
                  <select 
                    value={paymentAccount} 
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="1000000001">1000000001 - Nguyễn Văn Thành • Số dư: 245,000,000 VND</option>
                    <option value="1000000003">1000000003 - Lê Minh Hoàng • Số dư: 18,500,000 VND</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant">Số tiền trả nợ (VND)</label>
                  <input 
                    type="text" 
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
                  <button onClick={() => setIsPayModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
                  <button onClick={() => setPayStep(2)} className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all flex items-center gap-2">
                    Tiếp tục <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {payStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50/50 rounded-2xl border border-yellow-200 flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Xác nhận thanh toán nợ. Sau khi ấn nút bên dưới, số dư tài khoản của bạn sẽ lập tức bị trừ và số nợ sẽ được ghi giảm.
                  </p>
                </div>

                <div className="space-y-2.5 p-4 bg-surface rounded-2xl border border-outline-variant/30 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                    <span className="text-outline">Mã khoản vay</span>
                    <span className="font-mono font-bold text-[#002147]">{loanToPay.id}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                    <span className="text-outline">Khách hàng</span>
                    <span className="font-bold">{loanToPay.customer}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
                    <span className="text-outline">Số tiền trích nợ</span>
                    <span className="font-bold text-[#002147]">{payAmount} VND</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-outline">Dư nợ còn lại sau giao dịch</span>
                    <span className="font-bold text-emerald-600">
                      {(parseInt(loanToPay.amount.replace(/,/g, '')) - parseInt(loanToPay.paid.replace(/,/g, '')) - parseInt(payAmount.replace(/,/g, ''))).toLocaleString()} VND
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
                  <button onClick={() => setPayStep(1)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Quay lại</button>
                  <button onClick={executeLoanPayment} className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all">Xác nhận trả nợ</button>
                </div>
              </div>
            )}

            {payStep === 3 && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-primary">Thanh toán nợ thành công!</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Hồ sơ dư nợ của khách hàng đã được cập nhật thành công.</p>
                </div>

                <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-left space-y-2 max-w-sm mx-auto text-xs">
                  <div className="flex justify-between">
                    <span className="text-outline">Mã hồ sơ vay:</span>
                    <span className="font-bold">{loanToPay.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Số tiền trả:</span>
                    <span className="font-bold text-primary">{payAmount} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Từ tài khoản:</span>
                    <span className="font-mono font-bold">{paymentAccount}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsPayModalOpen(false)} 
                  className="w-full max-w-xs py-2.5 bg-[#002147] hover:bg-[#001936] text-white text-xs font-bold rounded-xl shadow-md transition-all uppercase"
                >
                  Hoàn tất
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Hồ sơ vay chi tiết" maxWidth="lg">
        {selectedLoan && (
          <div className="p-6 space-y-6">
            <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant flex justify-between items-center shadow-inner">
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Mã hồ sơ vay</p>
                <p className="font-numeric-data text-2xl text-primary font-bold">{selectedLoan.id}</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                selectedLoan.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 
                selectedLoan.status === 'Late' ? 'bg-error-container text-on-error-container' : 
                'bg-surface-container-highest text-on-surface-variant'
              )}>
                {selectedLoan.status === 'Active' ? 'Đang hoạt động' : selectedLoan.status === 'Late' ? 'Quá hạn' : 'Chờ phê duyệt'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Khách hàng vay</p>
                <p className="text-sm font-bold text-primary">{selectedLoan.customer}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Tổng số tiền vay</p>
                <p className="text-sm font-bold text-primary">{selectedLoan.amount} VNĐ</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Lãi suất năm (APR)</p>
                <p className="text-sm font-bold">{selectedLoan.interest}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Kỳ hạn vay vốn</p>
                <p className="text-sm font-bold">{selectedLoan.duration.includes('tháng') ? selectedLoan.duration : `${selectedLoan.duration} tháng`}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Đã trả nợ gốc</p>
                <p className="text-sm font-bold text-emerald-600">{selectedLoan.paid} VNĐ</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-outline mb-1">Dư nợ còn lại</p>
                <p className="text-sm font-bold text-red-600">{(parseInt(selectedLoan.amount.replace(/,/g, '')) - parseInt(selectedLoan.paid.replace(/,/g, ''))).toLocaleString()} VNĐ</p>
              </div>
            </div>

            {/* Repayment schedule history */}
            {(selectedLoan.status === 'Active' || selectedLoan.status === 'Late') && (
              <div className="border-t border-outline-variant pt-4">
                <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Lịch sử thanh toán định kỳ (Repayments)
                </h5>
                <div className="space-y-2">
                  {[
                    { period: 'Kỳ 1 (Tháng 10/2023)', amount: '50,000,000 VND', date: '12/10/2023', status: 'PAID' },
                    { period: 'Kỳ 2 (Tháng 11/2023)', amount: '50,000,000 VND', date: '12/11/2023', status: 'PAID' },
                    { period: 'Kỳ 3 (Tháng 12/2023)', amount: '50,000,000 VND', date: '-', status: selectedLoan.status === 'Late' ? 'LATE' : 'FUTURE' }
                  ].map((rep, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 hover:bg-surface-container-low rounded-xl border border-outline-variant/20 transition-colors">
                      <div>
                        <p className="text-xs font-bold text-[#002147]">{rep.period}</p>
                        <p className="text-[9px] text-outline">Hạn trả: 12 hàng tháng • Thực trả: {rep.date}</p>
                      </div>
                      <span className={cn(
                        "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md",
                        rep.status === 'PAID' ? 'bg-secondary-container text-on-secondary-container' : 
                        rep.status === 'LATE' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface-variant'
                      )}>{rep.status === 'PAID' ? 'Đã trả' : rep.status === 'LATE' ? 'Quá hạn' : 'Sắp tới'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-outline-variant">
              <p className="text-[10px] font-bold uppercase text-outline mb-3">Tác vụ quản lý</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface border border-outline-variant text-[10px] font-bold hover:bg-surface-container-low transition-all">
                  <FileText className="w-4 h-4" /> Hợp đồng vay
                </button>
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenPayFlow(selectedLoan);
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <DollarSign className="w-4 h-4" /> Trả nợ khoản vay
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
