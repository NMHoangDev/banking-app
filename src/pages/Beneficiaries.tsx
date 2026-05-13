import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ChevronRight, 
  UserPlus, 
  Edit2, 
  Trash2,
  Filter,
  ExternalLink,
  CreditCard,
  Building,
  Phone,
  Mail,
  ArrowRight,
  MoreVertical,
  Banknote
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialBeneficiaries = [
  { id: '1', name: 'Nguyễn Văn Thành', account: '1902 4432 110 998', bank: 'Techcombank', initial: 'NT', color: 'bg-primary-fixed', category: 'Cá nhân', phone: '0901234567', email: 'thanh.nv@gmail.com' },
  { id: '2', name: 'Công ty LogiTrans', account: '0071 0023 445 112', bank: 'Vietcombank', initial: 'CL', color: 'bg-secondary-container', category: 'Đối tác', phone: '0243889122', email: 'billing@logitrans.vn' },
  { id: '3', name: 'Trần Thị Phương', account: '102 9982 771 990', bank: 'BIDV', initial: 'TP', color: 'bg-tertiary-fixed', category: 'Gia đình', phone: '0988771122', email: 'phuong.tt@yahoo.com' },
  { id: '4', name: 'Trường Đại học BK', account: '0000 1121 882 770', bank: 'Enterprise Bank', initial: 'BK', color: 'bg-primary-container text-white', category: 'Dịch vụ', phone: '0243110229', email: 'hocphi@hust.edu.vn' },
  { id: '5', name: 'Lê Minh Tuấn', account: '1192 8871 665 001', bank: 'Agribank', initial: 'LT', color: 'bg-secondary-container', category: 'Bạn bè', phone: '0912334455', email: 'tuan.lm@hotmail.com' },
];

export default function Beneficiaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return initialBeneficiaries.filter(person => {
      const matchSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          person.account.includes(searchTerm) ||
                          person.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = activeCategory === 'Tất cả' || person.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleOpenDetail = (person: any) => {
    setSelectedPerson(person);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Quản lý</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Người thụ hưởng</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Danh sách người thụ hưởng</h2>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Thêm người thụ hưởng
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, số tài khoản, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-outline-variant rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {['Tất cả', 'Cá nhân', 'Đối tác', 'Gia đình', 'Dịch vụ'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveCategory(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap",
                tab === activeCategory ? "bg-primary text-white border-primary shadow-sm" : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((person) => (
          <div key={person.id} className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                  onClick={() => handleOpenDetail(person)}
                  className="p-1.5 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-all">
                 <MoreVertical className="w-4 h-4 text-outline" />
               </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm", person.color)}>
                {person.initial}
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-primary leading-tight">{person.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-outline px-2 py-0.5 rounded-full bg-surface-container-low inline-block mt-1 ring-1 ring-outline-variant/30">
                  {person.category}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                <div className="p-1.5 bg-surface-container-low rounded-lg">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-numeric-data font-bold tracking-tighter">{person.account}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-on-surface-variant opacity-80">
                <Building className="w-3.5 h-3.5" />
                <span className="font-medium">{person.bank}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2.5 bg-surface border border-outline-variant text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-low transition-all">
                Chỉnh sửa
              </button>
              <button className="flex-1 py-2.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                Chuyển tiền <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-surface-container-low/30 transition-all text-outline hover:text-primary group min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
            <Plus className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-sm">Thêm người thụ hưởng</p>
            <p className="text-[10px] opacity-70">Kết nối danh bạ thanh toán mới</p>
          </div>
        </button>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Thêm người thụ hưởng mới">
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tên gợi nhớ</label>
            <input type="text" placeholder="Ví dụ: Anh Thành chuyển khoản..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Số tài khoản / Thẻ</label>
              <input type="text" placeholder="Nhập số..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Ngân hàng</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>Enterprise Bank</option>
                <option>Vietcombank</option>
                <option>Techcombank</option>
                <option>MB Bank</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Lưu thông tin</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Thông tin người thụ hưởng">
        {selectedPerson && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-white", selectedPerson.color)}>
                {selectedPerson.initial}
              </div>
              <h4 className="font-display font-bold text-xl text-primary">{selectedPerson.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline bg-surface-container-low px-3 py-1 rounded-full mt-2 border border-outline-variant/30">
                {selectedPerson.category}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Số tài khoản', value: selectedPerson.account, icon: <CreditCard className="w-4 h-4" /> },
                { label: 'Ngân hàng', value: selectedPerson.bank, icon: <Building className="w-4 h-4" /> },
                { label: 'Số điện thoại', value: selectedPerson.phone, icon: <Phone className="w-4 h-4" /> },
                { label: 'Email', value: selectedPerson.email, icon: <Mail className="w-4 h-4" /> },
              ].map((info, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant/50">
                   <div className="p-2 bg-white rounded-xl shadow-sm text-primary border border-outline-variant/30">
                     {info.icon}
                   </div>
                   <div>
                     <p className="text-[10px] font-bold uppercase text-outline leading-none mb-1">{info.label}</p>
                     <p className="text-sm font-bold text-on-surface tracking-tight">{info.value}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button className="flex-1 py-3 bg-surface-container-low text-on-surface-variant rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all">
                <Trash2 className="w-4 h-4 text-error" /> Xóa
              </button>
              <button className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md transition-all active:scale-95">
                <Banknote className="w-4 h-4" /> Chuyển tiền
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
