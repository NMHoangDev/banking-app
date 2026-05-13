import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  ChevronRight, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  Database, 
  Key, 
  Monitor,
  User,
  HelpCircle,
  ChevronDown,
  ToggleLeft as Toggle,
  Save,
  CheckCircle2,
  Trash2,
  Lock,
  Smartphone,
  Mail,
  Zap,
  Layout,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: Globe, desc: 'Thông tin cơ bản của hệ thống' },
    { id: 'security', label: 'Bảo mật & Truy cập', icon: Shield, desc: 'Kiểm soát đăng nhập và phiên' },
    { id: 'notifications', label: 'Thông báo', icon: Bell, desc: 'Cấu hình kênh truyền thông' },
    { id: 'appearance', label: 'Giao diện', icon: Layout, desc: 'Chủ đề và cách hiển thị' },
    { id: 'api', label: 'API & Tích hợp', icon: Database, desc: 'Kết nối bên thứ ba' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Thiết lập</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Cấu hình hệ thống</h2>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 text-sm",
            isSaving ? "bg-secondary text-white" : "bg-primary text-white hover:bg-primary/90"
          )}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white border border-outline-variant rounded-2xl p-2 shadow-sm space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-md active:scale-[0.98]" 
                    : "bg-surface text-on-surface-variant hover:bg-surface-container-low"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "" : "text-outline")} />
                <div>
                  <p className="leading-none mb-1">{tab.label}</p>
                  <p className={cn("text-[10px] font-medium opacity-60", activeTab === tab.id ? "text-white" : "text-outline")}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-5 bg-tertiary-container rounded-2xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-2 tracking-widest uppercase">
                <HelpCircle className="w-4 h-4" /> Hỗ trợ Core
              </h4>
              <p className="text-[11px] text-primary-fixed-dim leading-relaxed mb-4">Mọi thay đổi quan trọng sẽ được lưu lại trong nhật ký sự kiện.</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold transition-all border border-white/20 uppercase tracking-widest">
                Gửi yêu cầu IT
              </button>
            </div>
            <Zap className="w-16 h-16 absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-500" />
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-outline-variant">
              <div className="p-3 bg-primary/5 rounded-2xl text-primary border border-primary/10">
                {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-primary leading-none mb-1">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-xs text-on-surface-variant italic">Cập nhật lần cuối: Hôm nay, 10:45 AM</p>
              </div>
            </div>

            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Tên tổ chức</label>
                    <input type="text" defaultValue="Enterprise Bank Global" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold text-primary shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Mã định danh SWIFT</label>
                    <input type="text" defaultValue="ENTRVNVX" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold text-primary shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Ngôn ngữ hiển thị</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-primary shadow-sm cursor-pointer">
                        <option>Tiếng Việt (Vietnam)</option>
                        <option>English (United States)</option>
                        <option>日本語 (Japan)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Hệ thống thời gian</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-primary shadow-sm cursor-pointer">
                        <option>(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                        <option>(GMT+00:00) London, Lisbon</option>
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-outline-variant">
                   <h4 className="text-sm font-bold text-primary mb-6 flex items-center gap-2">
                     <div className="w-1 h-3 bg-primary rounded-full"></div> Thông tin mạng lưới kỹ thuật
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Địa chỉ máy chủ Core</label>
                      <input type="text" defaultValue="internal.bank.core.enterprise" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium opacity-70" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Dải IP xác thực</label>
                      <input type="text" defaultValue="10.224.x.x / 172.16.x.x" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium opacity-70" readOnly />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  {[
                    { title: 'Xác thực 2 yếu tố (2FA)', desc: 'Bắt buộc đối với tất cả tài khoản quản trị viên và giao dịch trên 500tr.', active: true },
                    { title: 'Tự động đăng xuất', desc: 'Phiên làm việc sẽ kết thúc sau 15 phút không có hoạt động.', active: true },
                    { title: 'Giới hạn đăng nhập IP', desc: 'Chỉ cho phép truy cập từ dải mạng nội bộ hoặc VPN công ty.', active: false },
                    { title: 'Mã hóa nhật ký truy cập', desc: 'Tất cả hành động người dùng sẽ được mã hóa chuẩn AES-256.', active: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-surface border border-outline-variant rounded-2xl hover:border-primary/30 transition-all group">
                      <div className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-xl mt-1 shadow-sm", item.active ? "bg-primary text-white" : "bg-surface-container-high text-outline")}>
                          {item.active ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-primary">{item.title}</h4>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed pr-8">{item.desc}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0",
                        item.active ? "bg-primary shadow-inner" : "bg-outline-variant/30"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md",
                          item.active ? "right-1" : "left-1"
                        )}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-dashed border-outline-variant">
                  <h4 className="text-sm font-bold text-primary mb-6 flex items-center gap-2">
                     <div className="w-1 h-3 bg-primary rounded-full"></div> Kiểm soát mật khẩu
                   </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Độ dài tối thiểu</label>
                      <input type="number" defaultValue="12" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-primary shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Thời hạn thay đổi (Ngày)</label>
                      <input type="number" defaultValue="90" className="w-full bg-surface border border-outline-variant rounded-xl px-4 py-3 text-sm focus:outline-none font-bold text-primary shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-center py-10">
                <div className="w-20 h-20 bg-surface-container-low rounded-3xl flex items-center justify-center text-outline mx-auto mb-6">
                  <Bell className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-display font-bold text-2xl text-primary mb-2">Cấu hình thông báo</h3>
                <p className="text-sm text-on-surface-variant max-w-[400px] mx-auto italic">Tính năng quan trọng dành cho liên lạc và báo động hệ thống.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 text-left">
                  {['Email thông báo (Admin)', 'Tin nhắn SMS (OTP)', 'Thông báo nội bộ (Push)', 'Webhook đối tác'].map((n) => (
                    <div key={n} className="p-4 bg-white border border-outline-variant rounded-2xl flex items-center gap-4 hover:shadow-md transition-all">
                      <div className="p-2 border border-outline-variant rounded-lg text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-on-surface">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'api' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-6 bg-surface border-2 border-dashed border-primary/20 rounded-3xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                         <Key className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-primary">Khóa API Production</h4>
                         <p className="text-[10px] font-bold text-outline flex items-center gap-1 uppercase tracking-widest">
                           <Shield className="w-3 h-3" /> Cấp độ bảo mật: Cao nhất
                         </p>
                       </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1 bg-white border border-outline-variant rounded-xl px-4 py-3 text-xs font-mono flex items-center text-primary/40 tracking-widest overflow-hidden shadow-inner">
                        ENT-KEY-********************************-SECURE
                      </div>
                      <button className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2">
                        Sao chép khoá
                      </button>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-4 italic font-medium leading-relaxed">Sử dụng khóa này để xác thực trong các yêu cầu API từ dịch vụ đối tác. Không chia sẻ khoá này qua các kênh trò chuyện công khai.</p>
                  </div>
                  <ShieldCheck className="w-24 h-24 absolute -right-4 -bottom-4 text-primary/5 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Nhật ký API gần đây</h4>
                    <button className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors">
                      Xem tất cả <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden divide-y divide-outline-variant/30">
                    {[
                      { method: 'GET', endpoint: '/v1/customers/stats', time: 'Vừa xong', status: '200 OK', color: 'text-secondary' },
                      { method: 'POST', endpoint: '/v1/transfers/internal', time: '12p trước', status: '201 CREATED', color: 'text-secondary' },
                      { method: 'GET', endpoint: '/v1/accounts/6612...', time: '1h trước', status: '404 NOT FOUND', color: 'text-error' },
                      { method: 'PATCH', endpoint: '/v1/loans/repayment', time: '3h trước', status: '200 OK', color: 'text-secondary' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors">
                        <div className="flex items-center gap-4">
                          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider", log.method === 'GET' ? 'bg-primary/10 text-primary' : 'bg-tertiary-container/10 text-tertiary')}>
                            {log.method}
                          </span>
                          <span className="text-xs font-mono font-medium text-primary/70">{log.endpoint}</span>
                        </div>
                        <div className="text-right">
                           <p className={cn("text-[10px] font-bold mb-1", log.color)}>{log.status}</p>
                           <p className="text-[9px] font-medium text-outline">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-outline-variant">
              <button className="px-8 py-3 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">Cài đặt mặc định</button>
              <button onClick={handleSave} className="px-10 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:translate-y-0">Cập nhật cấu hình</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

