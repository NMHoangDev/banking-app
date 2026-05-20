import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Search,
  ChevronRight,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  Building2,
  Cpu,
  CheckCircle2,
  ChevronDown,
  Globe,
  Map as MapIcon,
  Plus,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  getBranches,
  createBranch,
  updateBranch,
} from "../services/branches.service";

const initialBranches = [
  {
    id: "1",
    name: "Trụ sở chính - Enterprise Tower",
    type: "Chi nhánh/PGD",
    address: "Số 1 Đào Duy Anh, Đống Đa, Hà Nội",
    phone: "024 3998 1122",
    hours: "08:00 - 17:00",
    status: "Open",
    region: "Miền Bắc",
  },
  {
    id: "2",
    name: "Chi nhánh Sài Gòn",
    type: "Chi nhánh/PGD",
    address: "99 Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh",
    phone: "028 3882 0099",
    hours: "08:00 - 18:00",
    status: "Open",
    region: "Miền Nam",
  },
  {
    id: "3",
    name: "Phòng giao dịch Đà Nẵng",
    type: "Phòng giao dịch",
    address: "12 Nguyễn Văn Linh, Quận Hải Châu, Đà Nẵng",
    phone: "0236 3881 2233",
    hours: "08:00 - 17:00",
    status: "Closed",
    region: "Miền Trung",
  },
  {
    id: "4",
    name: "ATM 24/7 - Vincom Bà Triệu",
    type: "Cây ATM",
    address: "Tầng 1, 191 Bà Triệu, Hai Bà Trưng, Hà Nội",
    phone: "1900 1122",
    hours: "24/7",
    status: "Open",
    region: "Miền Bắc",
  },
  {
    id: "5",
    name: "Chi nhánh Cần Thơ",
    type: "Chi nhánh/PGD",
    address: "45 Hòa Bình, Quận Ninh Kiều, Cần Thơ",
    phone: "0292 3776 1122",
    hours: "08:00 - 17:30",
    status: "Open",
    region: "Miền Nam",
  },
];

export default function Branches() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>(initialBranches);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  const filteredBranches = useMemo(() => {
    return branches.filter((branch) => {
      const matchSearch =
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType =
        activeType === "Tất cả" ||
        (activeType === "Chi nhánh" && branch.type.includes("Chi nhánh")) ||
        (activeType === "ATM" && branch.type.includes("ATM"));
      return matchSearch && matchType;
    });
  }, [searchTerm, activeType]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingBranches(true);
      setBranchesError(null);
      try {
        const rows = await getBranches();
        if (!mounted) return;
        const mapped = rows.map((r: any) => ({
          apiId: r.branch_id,
          id: `B-${r.branch_id}`,
          name: r.name,
          type: r.type || "Chi nhánh/PGD",
          address: r.address || "-",
          phone: r.phone || "-",
          hours: r.hours || "08:00 - 17:00",
          status: r.is_open ? "Open" : "Closed",
          region: r.region || "Không xác định",
        }));
        setBranches(mapped);
      } catch (err) {
        console.error("Failed to load branches", err);
        setBranchesError(
          "Không thể tải danh sách chi nhánh, hiển thị dữ liệu mẫu.",
        );
        setBranches(initialBranches);
      } finally {
        setLoadingBranches(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddBranch = () => {
    const name = prompt("Tên chi nhánh / ATM");
    if (!name) return;
    const payload = {
      name,
      address: prompt("Địa chỉ") || "-",
      phone: prompt("Số điện thoại") || "-",
      type: "Chi nhánh/PGD",
      region: "Miền Bắc",
      is_open: true,
    };
    createBranch(payload)
      .then((created: any) => {
        const mapped = {
          apiId: created.branch_id,
          id: `B-${created.branch_id}`,
          name: created.name || payload.name,
          type: created.type || payload.type,
          address: created.address || payload.address,
          phone: created.phone || payload.phone,
          hours: created.hours || "08:00 - 17:00",
          status: created.is_open ? "Open" : "Closed",
          region: created.region || payload.region,
        };
        setBranches((prev) => [mapped, ...prev]);
      })
      .catch((err) => {
        console.error("Failed to create branch", err);
        alert("Không thể tạo chi nhánh, thử lại sau.");
      });
  };

  const toggleBranchStatus = (branch: any) => {
    const prev = branches;
    const updated = branches.map((b) =>
      b.id === branch.id
        ? { ...b, status: b.status === "Open" ? "Closed" : "Open" }
        : b,
    );
    setBranches(updated);
    if (!branch.apiId) return;
    const newIsOpen =
      updated.find((b) => b.id === branch.id)?.status === "Open";
    updateBranch(branch.apiId, { is_open: newIsOpen }).catch((err) => {
      console.error("Failed to update branch status", err);
      alert("Không thể cập nhật trạng thái, khôi phục.");
      setBranches(prev);
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
          <span>Thông tin</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary">Mạng lưới Chi nhánh & ATM</span>
        </nav>
        <h2 className="font-display font-bold text-24 text-primary tracking-tight">
          Tìm kiếm Chi nhánh / ATM
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-outline-variant rounded-2xl p-4 shadow-sm">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
              <input
                type="text"
                placeholder="Nhập tên đường, quận, huyện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              {["Tất cả", "Chi nhánh", "ATM"].map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                    activeType === type
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low/30">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest">
                KẾT QUẢ TÌM KIẾM ({filteredBranches.length})
              </p>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-outline-variant no-scrollbar">
              {filteredBranches.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={cn(
                    "p-5 hover:bg-surface-container-low/50 transition-all cursor-pointer group relative",
                    selectedBranch?.id === branch.id &&
                      "bg-primary/5 border-l-4 border-primary",
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors leading-tight">
                      {branch.name}
                    </p>
                    <span
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ring-1 ring-inset",
                        branch.status === "Open"
                          ? "bg-secondary/5 text-secondary ring-secondary/20"
                          : "bg-error/5 text-error ring-error/20",
                      )}
                    >
                      {branch.status === "Open" ? "Mở cửa" : "Đóng"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-outline mb-4">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        branch.type.includes("Chi nhánh")
                          ? "bg-primary"
                          : "bg-tertiary-fixed",
                      )}
                    ></div>
                    {branch.type} • {branch.region}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] text-on-surface-variant flex items-start gap-2.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" />
                      {branch.address}
                    </p>
                    <p className="text-[11px] text-on-surface-variant flex items-center gap-2.5">
                      <Phone className="w-3.5 h-3.5 opacity-50" />
                      {branch.phone}
                    </p>
                  </div>
                </div>
              ))}
              {filteredBranches.length === 0 && (
                <div className="p-10 text-center text-outline text-xs italic">
                  Không tìm thấy địa điểm phù hợp
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-3xl h-[500px] flex items-center justify-center relative overflow-hidden shadow-inner group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#002147_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

            {selectedBranch ? (
              <div className="z-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="relative mb-6">
                  <div className="absolute -inset-4 bg-primary/10 rounded-full animate-ping"></div>
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-primary relative z-10 border border-outline-variant/50">
                    <MapIcon className="w-10 h-10" />
                  </div>
                </div>
                <div className="text-center px-6">
                  <h3 className="font-display font-bold text-2xl text-primary mb-2">
                    {selectedBranch.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant max-w-[400px] mx-auto mb-6">
                    {selectedBranch.address}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button className="bg-primary text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95">
                      <Navigation className="w-4 h-4" /> Chỉ đường
                    </button>
                    <button className="bg-white border border-outline-variant text-primary px-8 py-3 rounded-xl text-sm font-bold hover:bg-surface-container-low transition-all">
                      <Globe className="w-4 h-4" /> Xem 360°
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="z-10 flex flex-col items-center gap-6 text-center px-6">
                <div className="p-6 bg-white rounded-3xl shadow-xl border border-outline-variant/30 text-primary/20">
                  <MapPin className="w-16 h-16" />
                </div>
                <div>
                  <p className="font-display font-bold text-xl text-primary">
                    Mạng lưới giao dịch toàn quốc
                  </p>
                  <p className="text-sm text-on-surface-variant max-w-[320px] mt-2 italic">
                    Vui lòng chọn một điểm giao dịch từ danh sách bên trái để
                    xem thông tin chi tiết.
                  </p>
                </div>
              </div>
            )}

            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="p-3 bg-white border border-outline-variant rounded-xl shadow-lg hover:bg-surface-container-low transition-all">
                <Plus className="w-5 h-5 text-primary" />
              </button>
              <button className="p-3 bg-white border border-outline-variant rounded-xl shadow-lg hover:bg-surface-container-low transition-all">
                <div className="w-5 h-0.5 bg-primary rounded-full"></div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu className="w-20 h-20" />
              </div>
              <h3 className="font-display font-bold text-sm text-primary mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Công nghệ CRM Thẩm định
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                ATM thế hệ mới được trang bị máy nộp tiền tự động CRM, hỗ trợ
                nộp tiền mặt trực tiếp vào tài khoản 24/7 mà không cần qua quầy.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Nộp tiền", "Rút QR", "Sinh trắc"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold bg-surface-container text-primary px-2.5 py-1 rounded-full uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-primary-container text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-fixed" /> Ưu
                  tiên giao dịch (Priority)
                </h3>
                <p className="text-xs text-primary-fixed-dim leading-relaxed mb-6">
                  Tận hưởng không gian giao dịch đẳng cấp và riêng tư tại các
                  quầy chuyên biệt dành cho hội viên Priority.
                </p>
                <button className="mt-auto text-xs font-bold text-secondary-fixed flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Tìm chi nhánh Priority gần nhất{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
