import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  UserCheck, 
  UserX, 
  Shield, 
  History, 
  Edit3,
  MoreVertical,
  Filter,
  Lock,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Eye,
  Key,
  ShieldCheck,
  Building,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

const initialAppUsers = [
  { id: 'USR-001', name: 'Lê Văn Thành', role: 'Administrator', dept: 'IT Security', status: 'Active', email: 'thanh.lv@bank.vn', phone: '0901234567', lastAccess: '12/10/2023 14:22' },
  { id: 'USR-002', name: 'Nguyễn Thu Phương', role: 'Support Specialist', dept: 'Customer Care', status: 'Active', email: 'phuong.nt@bank.vn', phone: '0901234568', lastAccess: '12/10/2023 13:45' },
  { id: 'USR-003', name: 'Trần Minh Hoàng', role: 'Risk Auditor', dept: 'Audit & Compliance', status: 'Inactive', email: 'hoang.tm@bank.vn', phone: '0901234569', lastAccess: '10/10/2023 09:12' },
  { id: 'USR-004', name: 'Vũ Anh Duy', role: 'Branch Manager', dept: 'Hanoi Branch', status: 'Active', email: 'duy.va@bank.vn', phone: '0901234570', lastAccess: '12/10/2023 15:50' },
  { id: 'USR-005', name: 'Phạm Minh Tuấn', role: 'Developer', dept: 'Digital Banking', status: 'Suspended', email: 'tuan.pm@bank.vn', phone: '0901234571', lastAccess: '01/10/2023 17:30' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return initialAppUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleOpenDetail = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Kiểm soát truy cập</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Quản lý tài khoản nội bộ</h2>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo tài khoản mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'TỔNG NHÂN VIÊN', value: '452', icon: <Users className="w-5 h-5" />, color: 'primary' },
          { label: 'ĐANG TRỰC TUYẾN', value: '124', icon: <CheckCircle2 className="w-5 h-5" />, color: 'secondary' },
          { label: 'TÀI KHOẢN BỊ KHÓA', value: '3', icon: <Lock className="w-5 h-5" />, color: 'error' },
          { label: 'PHIÊN TRUY CẬP', value: '1,540', icon: <ShieldCheck className="w-5 h-5" />, color: 'tertiary' },
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
              placeholder="Tìm kiếm tên, mã nhân viên, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-surface border border-outline-variant p-2 rounded-lg hover:bg-surface-container-low transition-all">
              <Shield className="w-4 h-4 text-outline" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th className="text-center">Vai trò / Phòng ban</th>
                <th className="text-center">Liên hệ</th>
                <th className="text-center">Trạng thái</th>
                <th>Truy cập cuối</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs shadow-sm border border-outline-variant/30">
                        {user.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary leading-tight">{user.name}</p>
                        <p className="text-[10px] text-outline font-bold uppercase tracking-tighter">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <p className="text-xs font-bold text-on-surface">{user.role}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium opacity-70">{user.dept}</p>
                  </td>
                  <td className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
                        <Mail className="w-3 h-3 opacity-50" /> {user.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
                        <Smartphone className="w-3 h-3 opacity-50" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      user.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 
                      user.status === 'Suspended' ? 'bg-error-container text-on-error-container' : 
                      'bg-surface-container-highest text-on-surface-variant'
                    )}>
                      {user.status === 'Active' ? 'Đang hoạt động' : user.status === 'Suspended' ? 'Bị đình chỉ' : 'Sửa đổi'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant opacity-70">
                      <History className="w-3.5 h-3.5" />
                      {user.lastAccess}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleOpenDetail(user)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
                        <Lock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-outline font-medium">Không tìm thấy tài khoản nhân viên phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tạo tài khoản nhân viên mới">
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Họ & Tên nhân viên</label>
            <input type="text" placeholder="Nhập đầy đủ họ tên..." className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Phòng ban</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>Digital Banking</option>
                <option>IT Security</option>
                <option>Risk Management</option>
                <option>Customer Care</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Vai trò (Role)</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none">
                <option>Staff / Clerk</option>
                <option>Supervisor</option>
                <option>Manager</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Email công vụ</label>
            <input type="email" placeholder="example@bank.vn" className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button className="px-6 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Kích hoạt tài khoản</button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Thông tin chi tiết nhân viên">
        {selectedUser && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-3xl mb-4 shadow-lg ring-4 ring-white">
                {selectedUser.name.split(' ').pop()?.charAt(0)}
              </div>
              <h4 className="font-display font-bold text-xl text-primary">{selectedUser.name}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline">{selectedUser.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-2xl border border-outline-variant/30 text-center">
                 <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
                 <p className="text-[9px] font-bold uppercase text-outline mb-1">Vai trò</p>
                 <p className="text-xs font-bold leading-tight">{selectedUser.role}</p>
              </div>
              <div className="p-4 bg-surface rounded-2xl border border-outline-variant/30 text-center">
                 <Building className="w-5 h-5 text-primary mx-auto mb-2" />
                 <p className="text-[9px] font-bold uppercase text-outline mb-1">Phòng ban</p>
                 <p className="text-xs font-bold leading-tight">{selectedUser.dept}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-surface-container-low rounded-xl">
                 <Mail className="w-4 h-4 text-outline" />
                 <span className="text-xs font-bold">{selectedUser.email}</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-surface-container-low rounded-xl">
                 <Smartphone className="w-4 h-4 text-outline" />
                 <span className="text-xs font-bold">{selectedUser.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <p className="text-[10px] font-bold uppercase text-outline mb-3">Tác vụ quản trị</p>
              <div className="flex flex-col gap-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all">
                  <span className="flex items-center gap-2 text-xs font-bold"><Key className="w-4 h-4" /> Đặt lại mật khẩu</span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all">
                  <span className="flex items-center gap-2 text-xs font-bold text-error"><UserX className="w-4 h-4" /> Khóa tài khoản</span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
              </div>
            </div>

            <button className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
              Xem nhật ký hoạt động <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

