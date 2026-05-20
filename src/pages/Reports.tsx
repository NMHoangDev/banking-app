import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Calendar,
  Download,
  Plus,
  FileText,
  Eye,
  BarChart3,
  PieChart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Building2,
  DollarSign,
} from "lucide-react";
import { cn } from "../lib/utils";
import Modal from "../components/ui/Modal";
import { getReports, generateReport } from "../services/reports.service";

const initialReports = [
  {
    id: "REP-2023-001",
    name: "Báo cáo Tài chính Q3/2023",
    type: "Financial",
    date: "30/09/2023",
    size: "2.4 MB",
    creator: "Nguyễn Văn Thành",
    status: "Completed",
  },
  {
    id: "REP-2023-002",
    name: "Báo cáo Doanh thu Thu hộ & Dịch vụ Tháng 10",
    type: "Revenue",
    date: "31/10/2023",
    size: "1.8 MB",
    creator: "Lê Minh Hoàng",
    status: "Completed",
  },
  {
    id: "REP-2023-003",
    name: "Phân tích Rủi ro & Tín dụng Quá hạn",
    type: "Risk",
    date: "12/11/2023",
    size: "4.2 MB",
    creator: "Trần Minh Hoàng",
    status: "Pending",
  },
  {
    id: "REP-2023-004",
    name: "Nhật ký Kiểm toán & Bảo mật định kỳ",
    type: "Audit",
    date: "15/11/2023",
    size: "3.1 MB",
    creator: "Lê Văn Thành",
    status: "Completed",
  },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [reportTypeFilter, setReportTypeFilter] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Financial");
  const [newFormat, setNewFormat] = useState("PDF");
  const [newRange, setNewRange] = useState("Tháng này");

  // Chart interactivity states
  const [selectedChartSegment, setSelectedChartSegment] = useState<
    string | null
  >(null);

  const filteredReports = useMemo(() => {
    if (reportTypeFilter === "ALL") return reports;
    return reports.filter((r) => r.type === reportTypeFilter);
  }, [reportTypeFilter, reports]);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `REP-2023-${String(reports.length + 1).padStart(3, "0")}`;
    const newRep = {
      id: newId,
      name: newName || `Báo cáo ${newType} - ${newRange}`,
      type: newType,
      date: new Date().toLocaleDateString("vi-VN"),
      size: `-`,
      creator: "Quản trị viên",
      status: "Pending",
    };

    // optimistic add
    setReports((prev) => [newRep, ...prev]);
    setIsCreateModalOpen(false);
    setNewName("");

    // request generation
    generateReport({ type: newType, from: undefined, to: undefined })
      .then((resp) => {
        // update the report entry to Completed and set download url/size
        setReports((prev) =>
          prev.map((r) =>
            r.id === newId
              ? {
                  ...r,
                  status: "Completed",
                  size: resp.url ? "—" : r.size,
                  downloadUrl: resp.url,
                }
              : r,
          ),
        );
      })
      .catch((err) => {
        console.error("Failed to generate report", err);
        alert("Không thể tạo báo cáo ngay bây giờ. Vui lòng thử lại sau.");
        // revert optimistic addition
        setReports((prev) => prev.filter((r) => r.id !== newId));
      });
  };

  const handleExport = (rep: any) => {
    if (rep.downloadUrl) {
      window.open(rep.downloadUrl, "_blank");
      return;
    }
    // fallback: trigger generate with same params
    generateReport({ type: rep.type })
      .then((resp) => {
        if (resp.url) window.open(resp.url, "_blank");
        else alert("Tệp báo cáo đã sẵn sàng, nhưng không có URL tải xuống.");
      })
      .catch((err) => {
        console.error("Export failed", err);
        alert("Không thể xuất file báo cáo.");
      });
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingReports(true);
      setReportsError(null);
      try {
        const rows = await getReports();
        if (!mounted) return;
        if (rows && rows.length) {
          const mapped = rows.map((r: any, idx: number) => ({
            id: r.report_id ? `REP-${r.report_id}` : `REP-${Date.now()}-${idx}`,
            name: r.name || `Báo cáo ${r.type}`,
            type: r.type || "Financial",
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString("vi-VN")
              : new Date().toLocaleDateString("vi-VN"),
            size: r.size || "-",
            creator: r.creator || "Hệ thống",
            status: r.status === "COMPLETED" ? "Completed" : "Pending",
            downloadUrl: r.url || undefined,
          }));
          setReports(mapped);
        }
      } catch (err) {
        console.error("Failed to load reports", err);
        setReportsError("Không thể tải báo cáo; hiển thị dữ liệu mẫu.");
        setReports(initialReports);
      } finally {
        setLoadingReports(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Báo cáo & Phân tích</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">
            Thống kê dữ liệu & Báo cáo tài chính
          </h2>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#002147] hover:bg-[#001936] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Yêu cầu tạo báo cáo mới
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "TỔNG TÀI SẢN HỆ THỐNG",
            value: "45,280,000,000,000 VND",
            icon: <TrendingUp className="w-5 h-5" />,
            color: "primary",
            trend: "+12.4% so với năm ngoái",
          },
          {
            label: "DOANH THU THUẦN Q3",
            value: "184,500,000,000 VND",
            icon: <DollarSign className="w-5 h-5" />,
            color: "secondary",
            trend: "+8.2% so với Q2",
          },
          {
            label: "CHI PHÍ VẬN HÀNH",
            value: "42,100,000,000 VND",
            icon: <TrendingDown className="w-5 h-5" />,
            color: "error",
            trend: "-2.5% tối ưu chi phí",
          },
          {
            label: "HẠN MỨC TÍN DỤNG CẤP",
            value: "18,500,000,000,000 VND",
            icon: <BarChart3 className="w-5 h-5" />,
            color: "tertiary",
            trend: "Tỷ lệ nợ xấu 0.45%",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between"
          >
            <div>
              <div
                className={cn(
                  "p-2.5 rounded-xl w-fit mb-4",
                  `bg-${stat.color}-container text-on-${stat.color}-container`,
                )}
              >
                {stat.icon}
              </div>
              <p className="label-uppercase text-on-surface-variant text-[10px] mb-1">
                {stat.label}
              </p>
              <p className="font-display font-bold text-lg text-primary leading-tight">
                {stat.value}
              </p>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-4">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* CSS-based Custom Interactive Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Statistics Chart */}
        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-display font-bold text-base text-primary">
                  Biểu đồ phân tích chi tiêu & nguồn vốn
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Phân bổ nguồn tiền và hạn mức thanh khoản trong 6 tháng qua
                </p>
              </div>
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/30 text-[10px] font-bold">
                <button className="px-2.5 py-1 bg-white rounded-lg shadow-sm text-primary">
                  Nguồn Vốn
                </button>
                <button className="px-2.5 py-1 hover:bg-white/50 rounded-lg text-outline">
                  Chi Tiêu
                </button>
              </div>
            </div>

            {/* Custom SVG/HTML Premium Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-outline-variant/30">
              {[
                { month: "Tháng 6", capital: 85, spending: 45 },
                { month: "Tháng 7", capital: 92, spending: 50 },
                { month: "Tháng 8", capital: 78, spending: 38 },
                { month: "Tháng 9", capital: 110, spending: 65 },
                { month: "Tháng 10", capital: 125, spending: 70 },
                { month: "Tháng 11", capital: 140, spending: 82 },
              ].map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  onMouseEnter={() =>
                    setSelectedChartSegment(
                      `${bar.month}: Nguồn vốn ${bar.capital}B, Chi tiêu ${bar.spending}B`,
                    )
                  }
                  onMouseLeave={() => setSelectedChartSegment(null)}
                >
                  <div className="w-full flex justify-center gap-1 items-end h-48">
                    {/* Spending Bar */}
                    <div
                      className="w-3 sm:w-4 bg-orange-400 rounded-t-md hover:bg-orange-500 transition-all duration-300"
                      style={{ height: `${(bar.spending / 160) * 100}%` }}
                      title={`Chi tiêu: ${bar.spending} Tỷ`}
                    ></div>
                    {/* Capital Bar */}
                    <div
                      className="w-3 sm:w-4 bg-[#002147] rounded-t-md hover:bg-[#001936] transition-all duration-300"
                      style={{ height: `${(bar.capital / 160) * 100}%` }}
                      title={`Nguồn vốn: ${bar.capital} Tỷ`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant">
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Tooltip Output */}
          <div className="mt-4 p-3 bg-surface-container rounded-2xl border border-outline-variant/30 flex justify-between items-center min-h-[48px]">
            <span className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#002147]"></span>{" "}
              Nguồn vốn hệ thống
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 ml-2"></span>{" "}
              Chi tiêu vận hành
            </span>
            <span className="text-xs font-bold text-primary">
              {selectedChartSegment || "Di chuột vào các cột để xem chi tiết"}
            </span>
          </div>
        </div>

        {/* Dynamic Pie Distribution */}
        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-base text-primary mb-1">
              Cơ cấu danh mục đầu tư
            </h4>
            <p className="text-xs text-on-surface-variant mb-6">
              Tỷ trọng tài sản phát sinh thu nhập
            </p>

            <div className="space-y-4">
              {[
                {
                  name: "Tín dụng doanh nghiệp",
                  percent: 45,
                  val: "20.3T VND",
                  color: "bg-[#002147]",
                },
                {
                  name: "Tín dụng tiêu dùng cá nhân",
                  percent: 30,
                  val: "13.5T VND",
                  color: "bg-emerald-600",
                },
                {
                  name: "Thanh khoản ngân hàng",
                  percent: 15,
                  val: "6.7T VND",
                  color: "bg-amber-500",
                },
                {
                  name: "Khác",
                  percent: 10,
                  val: "4.5T VND",
                  color: "bg-slate-400",
                },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant flex items-center gap-2">
                      <span
                        className={cn("w-2.5 h-2.5 rounded-full", item.color)}
                      ></span>
                      {item.name}
                    </span>
                    <span className="text-primary">
                      {item.percent}% ({item.val})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", item.color)}
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mt-6 flex gap-2 items-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-emerald-800 leading-normal">
              Hạn mức thanh khoản của toàn hệ thống được duy trì ở mức cực kỳ an
              toàn <strong>(15%)</strong> theo tiêu chuẩn Basel III.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Archive */}
      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-low/30">
          <h4 className="font-display font-bold text-base text-primary">
            Kho lưu trữ báo cáo định kỳ
          </h4>
          <div className="flex gap-2">
            <select
              value={reportTypeFilter}
              onChange={(e) => setReportTypeFilter(e.target.value)}
              className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface-variant focus:outline-none"
            >
              <option value="ALL">Tất cả thể loại</option>
              <option value="Financial">Tài chính (Financial)</option>
              <option value="Revenue">Doanh thu (Revenue)</option>
              <option value="Risk">Rủi ro (Risk)</option>
              <option value="Audit">Kiểm toán (Audit)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã báo cáo</th>
                <th>Tên báo cáo</th>
                <th className="text-center">Loại</th>
                <th>Ngày tạo</th>
                <th>Dung lượng</th>
                <th>Người tạo</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((rep) => (
                <tr key={rep.id}>
                  <td>
                    <span className="font-numeric-data text-primary font-bold">
                      {rep.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-sm text-[#002147]">
                      {rep.name}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">
                      {rep.type}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      {rep.date}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-mono font-bold">
                      {rep.size}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-on-surface-variant">
                      {rep.creator}
                    </span>
                  </td>
                  <td className="text-center">
                    <span
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        rep.status === "Completed"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-highest text-on-surface-variant animate-pulse",
                      )}
                    >
                      {rep.status === "Completed" ? "Hoàn tất" : "Đang xử lý"}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedReport(rep);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-primary"
                        title="Xem báo cáo"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExport(rep)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-emerald-600"
                        title="Xuất file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Report Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Yêu cầu tạo báo cáo mới"
      >
        <form onSubmit={handleCreateReport} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">
              Tên báo cáo
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ví dụ: Báo cáo dòng tiền tháng 11..."
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                Loại báo cáo
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="Financial">Tài chính (Financial)</option>
                <option value="Revenue">Doanh thu (Revenue)</option>
                <option value="Risk">Rủi ro (Risk)</option>
                <option value="Audit">Kiểm toán (Audit)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                Định dạng xuất
              </label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="PDF">PDF Document</option>
                <option value="Excel">Microsoft Excel (.xlsx)</option>
                <option value="JSON">Raw JSON Payload</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">
              Khoảng thời gian phân tích
            </label>
            <select
              value={newRange}
              onChange={(e) => setNewRange(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="Hôm nay">Hôm nay (Realtime)</option>
              <option value="Tháng này">Tháng này (Tháng 11/2023)</option>
              <option value="Q3/2023">Quý 3 năm 2023</option>
              <option value="Cả năm 2023">Cả năm tài chính 2023</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all active:scale-95"
            >
              Tạo báo cáo
            </button>
          </div>
        </form>
      </Modal>

      {/* View Detail Report Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Bản xem trước báo cáo điện tử"
      >
        {selectedReport && (
          <div className="p-6 space-y-6">
            <div className="p-6 bg-surface-container rounded-3xl border border-outline-variant flex flex-col items-center text-center">
              <div className="p-3 bg-white rounded-2xl shadow-sm mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-display font-bold text-base text-primary">
                {selectedReport.name}
              </h4>
              <p className="text-[9px] font-bold uppercase tracking-widest text-outline">
                {selectedReport.id}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">
                  Phân loại báo cáo
                </span>
                <span className="font-bold text-primary uppercase">
                  {selectedReport.type}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">Ngày phát hành</span>
                <span className="font-bold">{selectedReport.date}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">
                  Chịu trách nhiệm lập
                </span>
                <span className="font-bold">{selectedReport.creator}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/30">
                <span className="text-on-surface-variant">
                  Định dạng mặc định
                </span>
                <span className="font-bold font-mono">PDF Document</span>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant space-y-3">
              <p className="text-[10px] font-bold uppercase text-outline">
                Nội dung tóm tắt & Kế hoạch
              </p>
              <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/30 leading-relaxed text-xs text-on-surface-variant">
                Báo cáo ghi nhận hiệu suất tăng trưởng tài sản lõi của tổ chức
                tăng 12.4% so với cùng kỳ năm trước. Dòng tiền gửi (deposits)
                của khách hàng tiếp tục là động lực thanh khoản chính. Tỷ lệ nợ
                xấu ở mức cực thấp 0.45%.
              </div>
            </div>

            <button
              onClick={() => handleExport(selectedReport)}
              className="w-full py-3 bg-[#002147] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#001936] transition-all shadow-md"
            >
              Tải file báo cáo hoàn chỉnh <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
