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
  ArrowRight,
  Settings,
  Grid,
  ClipboardList
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

// Initial state data
const initialAppUsers = [
  { id: 'USR-001', name: 'Lê Văn Thành', role: 'Administrator', dept: 'IT Security', status: 'Active', email: 'thanh.lv@bank.vn', phone: '0901234567', lastAccess: '12/10/2023 14:22' },
  { id: 'USR-002', name: 'Nguyễn Thu Phương', role: 'Support Specialist', dept: 'Customer Care', status: 'Active', email: 'phuong.nt@bank.vn', phone: '0901234568', lastAccess: '12/10/2023 13:45' },
  { id: 'USR-003', name: 'Trần Minh Hoàng', role: 'Risk Auditor', dept: 'Audit & Compliance', status: 'Inactive', email: 'hoang.tm@bank.vn', phone: '0901234569', lastAccess: '10/10/2023 09:12' },
  { id: 'USR-004', name: 'Vũ Anh Duy', role: 'Branch Manager', dept: 'Hanoi Branch', status: 'Active', email: 'duy.va@bank.vn', phone: '0901234570', lastAccess: '12/10/2023 15:50' },
  { id: 'USR-005', name: 'Phạm Minh Tuấn', role: 'Developer', dept: 'Digital Banking', status: 'Suspended', email: 'tuan.pm@bank.vn', phone: '0901234571', lastAccess: '01/10/2023 17:30' },
];

const initialRoles = [
  { name: 'Administrator', desc: 'Toàn quyền quản trị hệ thống, phê duyệt cấu hình bảo mật', userCount: 3 },
  { name: 'Support Specialist', desc: 'Hỗ trợ khách hàng, tra cứu thông tin cơ bản', userCount: 12 },
  { name: 'Risk Auditor', desc: 'Kiểm toán hệ thống, theo dõi và lập báo cáo rủi ro', userCount: 5 },
  { name: 'Branch Manager', desc: 'Quản lý chi nhánh, phê duyệt khoản vay hạn mức vừa', userCount: 8 },
  { name: 'Developer', desc: 'Phát triển, bảo trì và tích hợp hệ thống số', userCount: 15 },
];

const initialPermissions = [
  { code: 'VIEW_TXN', name: 'Xem giao dịch', desc: 'Quyền xem danh sách và chi tiết các giao dịch' },
  { code: 'CREATE_TXN', name: 'Tạo giao dịch', desc: 'Quyền thực hiện giao dịch chuyển tiền/thanh toán' },
  { code: 'APPROVE_LOAN', name: 'Phê duyệt khoản vay', desc: 'Quyền xét duyệt hồ sơ tín dụng' },
  { code: 'ISSUE_CARD', name: 'Phát hành thẻ', desc: 'Quyền duyệt cấp mới và khóa thẻ' },
  { code: 'MANAGE_USERS', name: 'Quản lý người dùng', desc: 'Quyền thêm/sửa/xóa tài khoản nội bộ' },
  { code: 'MANAGE_ROLES', name: 'Quản lý vai trò', desc: 'Quyền gán phân quyền cho các nhóm' },
];

const initialRolePermissions: Record<string, string[]> = {
  'Administrator': ['VIEW_TXN', 'CREATE_TXN', 'APPROVE_LOAN', 'ISSUE_CARD', 'MANAGE_USERS', 'MANAGE_ROLES'],
  'Support Specialist': ['VIEW_TXN', 'ISSUE_CARD'],
  'Risk Auditor': ['VIEW_TXN'],
  'Branch Manager': ['VIEW_TXN', 'APPROVE_LOAN', 'ISSUE_CARD'],
  'Developer': ['VIEW_TXN', 'CREATE_TXN'],
};

const initialAuditLogs = [
  { id: 'LOG-001', time: '14:22:10', operator: 'thanh.lv@bank.vn', action: 'Reset password for USR-005', status: 'SUCCESS', target: 'Users Management' },
  { id: 'LOG-002', time: '13:58:45', operator: 'hoang.tm@bank.vn', action: 'Exported Risk Assessment Report', status: 'SUCCESS', target: 'Risk Auditor' },
  { id: 'LOG-003', time: '13:15:22', operator: 'phuong.nt@bank.vn', action: 'Issued Card to 1000000003', status: 'SUCCESS', target: 'Cards' },
  { id: 'LOG-004', time: '11:42:00', operator: 'duy.va@bank.vn', action: 'Approved Loan L-998271', status: 'SUCCESS', target: 'Loans' },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'USERS' | 'ROLES' | 'PERMISSIONS' | 'MATRIX' | 'AUDIT'>('USERS');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States
  const [users, setUsers] = useState(initialAppUsers);
  const [roles, setRoles] = useState(initialRoles);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form states
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('0901234500');
  const [newUserRole, setNewUserRole] = useState('Support Specialist');
  const [newUserDept, setNewUserDept] = useState('Customer Care');

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const handleOpenDetail = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        
        // Add audit log
        const log = {
          id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
          time: new Date().toTimeString().split(' ')[0],
          operator: 'thanh.lv@bank.vn',
          action: `${nextStatus === 'Active' ? 'Activated' : 'Suspended'} user ${userId}`,
          status: 'SUCCESS',
          target: 'Users Management'
        };
        setAuditLogs(prevLogs => [log, ...prevLogs]);

        return { ...u, status: nextStatus };
      }
      return u;
    }));

    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser((prev: any) => ({
        ...prev,
        status: prev.status === 'Active' ? 'Suspended' : 'Active'
      }));
    }
  };

  const handleResetPassword = (user: any) => {
    // Add audit log
    const log = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toTimeString().split(' ')[0],
      operator: 'thanh.lv@bank.vn',
      action: `Reset password for ${user.id}`,
      status: 'SUCCESS',
      target: 'Users Management'
    };
    setAuditLogs(prevLogs => [log, ...prevLogs]);
    alert(`Đã reset mật khẩu tài khoản ${user.name} thành công. Mật khẩu mới được gửi về email ${user.email}`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    const newUser = {
      id: newId,
      name: newUserName,
      role: newUserRole,
      dept: newUserDept,
      status: 'Active',
      email: newUserEmail,
      phone: newUserPhone,
      lastAccess: '-'
    };

    setUsers(prev => [...prev, newUser]);
    setIsAddUserOpen(false);

    // Add audit log
    const log = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toTimeString().split(' ')[0],
      operator: 'thanh.lv@bank.vn',
      action: `Created new user ${newId} (${newUserName})`,
      status: 'SUCCESS',
      target: 'Users Management'
    };
    setAuditLogs(prevLogs => [log, ...prevLogs]);

    // Reset Form
    setNewUserName('');
    setNewUserEmail('');
  };

  // Toggle mapping in Matrix
  const handleTogglePermissionInMatrix = (role: string, permCode: string) => {
    setRolePermissions(prev => {
      const currentList = prev[role] || [];
      const newList = currentList.includes(permCode)
        ? currentList.filter(c => c !== permCode)
        : [...currentList, permCode];
      
      // Audit log
      const log = {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        time: new Date().toTimeString().split(' ')[0],
        operator: 'thanh.lv@bank.vn',
        action: `Updated permissions for Role: ${role} (Permission: ${permCode})`,
        status: 'SUCCESS',
        target: 'RBAC Policy'
      };
      setAuditLogs(prevLogs => [log, ...prevLogs]);

      return {
        ...prev,
        [role]: newList
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Kiểm soát truy cập & Administration</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Hệ thống phân quyền & Bảo mật</h2>
        </div>
        {activeTab === 'USERS' && (
          <button 
            onClick={() => setIsAddUserOpen(true)}
            className="bg-[#002147] hover:bg-[#001936] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo tài khoản nhân viên mới
          </button>
        )}
      </div>

      {/* Tabs Menu Navigation */}
      <div className="flex gap-2 border-b border-outline-variant bg-white p-2 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        {[
          { key: 'USERS', label: 'Tài khoản nhân viên', icon: <Users className="w-4 h-4" /> },
          { key: 'ROLES', label: 'Nhóm vai trò (Roles)', icon: <Shield className="w-4 h-4" /> },
          { key: 'PERMISSIONS', label: 'Danh mục Quyền', icon: <Settings className="w-4 h-4" /> },
          { key: 'MATRIX', label: 'Ma trận Phân quyền', icon: <Grid className="w-4 h-4" /> },
          { key: 'AUDIT', label: 'Audit Logs hệ thống', icon: <ClipboardList className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap",
              activeTab === tab.key 
                ? "bg-[#002147] text-white shadow-sm" 
                : "text-on-surface-variant hover:bg-surface-container-low"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USERS TAB */}
      {activeTab === 'USERS' && (
        <div className="space-y-6">
          <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 flex flex-wrap items-center gap-4 border-b border-outline-variant bg-surface-container-low/30">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tên, email, ID..." 
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
                    <th>Nhân viên</th>
                    <th className="text-center">Phòng ban</th>
                    <th className="text-center">Nhóm Vai trò (Role)</th>
                    <th className="text-center">Liên hệ</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary font-bold flex items-center justify-center text-xs shadow-sm border border-outline-variant/30">
                            {user.name.split(' ').pop()?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary leading-tight">{user.name}</p>
                            <p className="text-[9px] text-outline font-bold uppercase tracking-tighter">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="text-xs font-bold text-on-surface-variant uppercase">{user.dept}</span>
                      </td>
                      <td className="text-center">
                        <span className="text-xs font-bold text-[#002147] bg-primary-fixed/20 px-2.5 py-1 rounded-md">{user.role}</span>
                      </td>
                      <td className="text-center">
                        <p className="text-[10px] font-mono font-bold text-on-surface-variant">{user.email}</p>
                        <p className="text-[9px] text-outline font-bold">{user.phone}</p>
                      </td>
                      <td className="text-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                          user.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                        )}>
                          {user.status === 'Active' ? 'Hoạt động' : 'Bị khóa'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleOpenDetail(user)}
                            className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-primary"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={cn(
                              "p-1.5 rounded transition-colors",
                              user.status === 'Active' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-emerald-50 text-emerald-600'
                            )}
                            title={user.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES TAB */}
      {activeTab === 'ROLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.name} className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="p-2.5 bg-primary/5 text-primary rounded-xl border border-primary/10">
                    <Shield className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-outline uppercase">{role.userCount} nhân viên gán</span>
                </div>
                <h4 className="font-display font-bold text-lg text-primary mb-2">{role.name}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{role.desc}</p>
              </div>

              <div className="pt-4 mt-6 border-t border-outline-variant/30 flex justify-between items-center text-xs">
                <span className="font-bold text-outline">Quyền sở hữu:</span>
                <span className="font-bold text-emerald-600">{(rolePermissions[role.name] || []).length} Quyền hạn</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PERMISSIONS TAB */}
      {activeTab === 'PERMISSIONS' && (
        <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã quyền</th>
                <th>Tên quyền hạn</th>
                <th>Mô tả chức năng</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm) => (
                <tr key={perm.code}>
                  <td className="font-mono text-xs font-bold text-primary">{perm.code}</td>
                  <td><span className="font-bold text-sm text-[#002147]">{perm.name}</span></td>
                  <td><span className="text-xs text-on-surface-variant leading-relaxed">{perm.desc}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: ROLE PERMISSIONS MATRIX */}
      {activeTab === 'MATRIX' && (
        <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-surface-container-low/50 border-b border-outline-variant">
            <h4 className="text-sm font-bold text-primary">Bảng ma trận gán quyền bảo mật dựa trên vai trò (RBAC)</h4>
            <p className="text-xs text-on-surface-variant mt-1">Ấn vào các checkbox bên dưới để gán hoặc hủy quyền trực tiếp cho từng Nhóm Vai Trò trong hệ thống</p>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="data-table border-collapse w-full">
              <thead>
                <tr className="bg-surface-container">
                  <th className="px-6 py-4 text-left">Vai trò / Quyền hạn</th>
                  {permissions.map(p => (
                    <th key={p.code} className="text-center px-4 py-4 max-w-[120px] whitespace-normal" title={p.desc}>
                      <div className="text-[10px] font-bold text-[#002147] leading-tight">{p.name}</div>
                      <div className="text-[8px] font-mono text-outline mt-0.5">{p.code}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-primary">{role.name}</td>
                    {permissions.map(p => {
                      const isAssigned = (rolePermissions[role.name] || []).includes(p.code);
                      return (
                        <td key={p.code} className="text-center px-4 py-4">
                          <input 
                            type="checkbox"
                            checked={isAssigned}
                            onChange={() => handleTogglePermissionInMatrix(role.name, p.code)}
                            className="w-4.5 h-4.5 cursor-pointer accent-[#002147] rounded"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã log</th>
                <th>Thời gian</th>
                <th>Người thực hiện</th>
                <th>Hành động (Action)</th>
                <th>Đối tượng tác động</th>
                <th className="text-center">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono text-xs font-bold text-[#002147]">{log.id}</td>
                  <td className="text-xs text-on-surface-variant font-mono">{log.time}</td>
                  <td><span className="text-xs font-bold">{log.operator}</span></td>
                  <td><span className="text-xs font-medium text-primary">{log.action}</span></td>
                  <td><span className="text-[10px] font-bold uppercase tracking-wider text-outline">{log.target}</span></td>
                  <td className="text-center">
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[8px] font-bold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Tạo tài khoản nhân viên mới">
        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Họ & Tên nhân viên</label>
            <input 
              type="text" 
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Ví dụ: Lê Văn A..."
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Email công vụ</label>
            <input 
              type="email" 
              required
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="example@bank.vn"
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Phòng ban</label>
              <select 
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="Customer Care">Customer Care</option>
                <option value="IT Security">IT Security</option>
                <option value="Digital Banking">Digital Banking</option>
                <option value="Audit & Compliance">Audit & Compliance</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Vai trò (Role)</label>
              <select 
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="Support Specialist">Support Specialist</option>
                <option value="Administrator">Administrator</option>
                <option value="Risk Auditor">Risk Auditor</option>
                <option value="Branch Manager">Branch Manager</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button type="button" onClick={() => setIsAddUserOpen(false)} className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Hủy bỏ</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all active:scale-95">Tạo tài khoản</button>
          </div>
        </form>
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
                <button 
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleResetPassword(selectedUser);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all"
                >
                  <span className="flex items-center gap-2 text-xs font-bold"><Key className="w-4 h-4" /> Đặt lại mật khẩu</span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
                <button 
                  onClick={() => handleToggleUserStatus(selectedUser.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant hover:bg-surface-container-low transition-all"
                >
                  <span className={cn("flex items-center gap-2 text-xs font-bold", selectedUser.status === 'Active' ? 'text-error' : 'text-emerald-600')}>
                    {selectedUser.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    {selectedUser.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
