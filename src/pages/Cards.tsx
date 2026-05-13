import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  History, 
  Eye, 
  EyeOff,
  Filter,
  Download,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialCards = [
  { id: '4532 **** **** 8821', holder: 'Nguyễn Văn Thành', type: 'Credit Platinum', expiry: '12/28', limit: '200,000,000', used: '45,200,000', status: 'Active', brand: 'Visa', color: 'bg-primary-container' },
  { id: '5421 **** **** 0092', holder: 'Lê Minh Hoàng', type: 'Debit Gold', expiry: '05/26', limit: '500,000,000', used: '12,000,000', status: 'Active', brand: 'Mastercard', color: 'bg-secondary-container' },
  { id: '4921 **** **** 4432', holder: 'Trần Thị Phương', type: 'Credit Signature', expiry: '10/27', limit: '1,000,000,000', used: '850,000,000', status: 'Blocked', brand: 'Visa', color: 'bg-error-container' },
  { id: '3567 **** **** 1120', holder: 'Vũ Anh Duy', type: 'Credit Classic', expiry: '03/25', limit: '50,000,000', used: '5,000,000', status: 'Active', brand: 'JCB', color: 'bg-tertiary-fixed' },
];

export default function Cards() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredCards = useMemo(() => {
    return initialCards.filter(card => 
      card.holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.id.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleOpenDetail = (card: any) => {
    setSelectedCard(card);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Quản lý thẻ</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Danh sách thẻ ngân hàng</h2>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Phát hành thẻ mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TỔNG THẺ ĐANG CHẠY', value: '1,284', icon: <CreditCard className="w-5 h-5" />, color: 'primary' },
          { label: 'THẺ ĐÃ KHÓA', value: '42', icon: <Lock className="w-5 h-5" />, color: 'error' },
          { label: 'THẺ CHỜ KÍCH HOẠT', value: '15', icon: <ShieldAlert className="w-5 h-5" />, color: 'tertiary' },
          { label: 'YÊU CẦU PHÁT HÀNH', value: '8', icon: <ShieldCheck className="w-5 h-5" />, color: 'secondary' },
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
              placeholder="Tìm kiếm số thẻ, chủ thẻ..." 
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
                <th>Thông tin thẻ</th>
                <th>Chủ thẻ</th>
                <th>Phân loại</th>
                <th>Hạn mức chi tiêu</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-6 rounded shrink-0 flex flex-col justify-between p-1 text-[7px] text-white font-bold shadow-sm", card.color)}>
                        <div className="flex justify-between items-start leading-none">
                          <div className="w-2 h-1.5 bg-yellow-400/80 rounded-sm"></div>
                          <span className="opacity-70">{card.brand}</span>
                        </div>
                        <div className="leading-none text-[5px] truncate uppercase tracking-tighter">**** {card.id.split(' ').pop()}</div>
                      </div>
                      <div>
                        <p className="font-numeric-data text-primary text-xs font-bold tracking-wider">{card.id}</p>
                        <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Hạn: {card.expiry}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-sm text-on-surface">{card.holder}</span>
                  </td>
                  <td>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{card.type}</span>
                  </td>
                  <td>
                    <div className="space-y-1 max-w-[120px]">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-primary">{card.used}</span>
                        <span className="text-outline">{card.limit}</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full", parseInt(card.used.replace(/,/g, '')) / parseInt(card.limit.replace(/,/g, '')) > 0.8 ? 'bg-error' : 'bg-primary')}
                          style={{ width: `${Math.min(100, (parseInt(card.used.replace(/,/g, '')) / parseInt(card.limit.replace(/,/g, '')) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      card.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    )}>
                      {card.status === 'Active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetail(card)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-outline font-medium">Không tìm thấy thẻ phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Card Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Phát hành thẻ mới">
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Chọn tài khoản liên kết</label>
            <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>1902 4456 789 012 - Nguyễn Văn Lợi</option>
              <option>1902 1198 223 008 - Trần Thu Hà</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Loại thẻ</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>Debit Card (Ghi nợ)</option>
                <option>Credit Card (Tín dụng)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Hạng thẻ</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>Standard</option>
                <option>Gold</option>
                <option>Platinum</option>
                <option>Signature</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Xác nhận phát hành</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Thông tin thẻ chi tiết">
        {selectedCard && (
          <div className="p-6 space-y-6">
            <div className="flex justify-center p-8 bg-surface-container-low rounded-3xl border border-outline-variant relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              <div className={cn("w-72 h-44 rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl relative z-10 transition-transform hover:scale-[1.02]", selectedCard.color)}>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-8 bg-yellow-400/80 rounded shadow-inner"></div>
                  <span className="font-display font-bold italic text-white/50">{selectedCard.brand}</span>
                </div>
                <div>
                  <p className="font-numeric-data text-xl tracking-[0.2em] shadow-sm mb-2">{selectedCard.id}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] uppercase opacity-60 mb-0.5 tracking-widest">Card Holder</p>
                      <p className="text-xs font-bold uppercase truncate">{selectedCard.holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase opacity-60 mb-0.5 tracking-widest">Expires</p>
                      <p className="text-xs font-bold">{selectedCard.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-outline" />
                  <span className="text-sm font-bold">Khóa thẻ tạm thời</span>
                </div>
                <div className="w-10 h-5 bg-outline-variant rounded-full p-0.5">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-outline" />
                  <span className="text-sm font-bold">Thanh toán trực tuyến (e-commerce)</span>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full p-0.5 flex justify-end">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Xem lịch sử giao dịch <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

