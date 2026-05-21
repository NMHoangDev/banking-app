import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Building2,
  DollarSign,
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';
import {
  getReportsSummary,
  type ReportItem as ApiReportItem,
  type ReportsBar,
  type ReportsOverview,
  type ReportsPortfolioItem,
} from '../services/reports.service';

type UiReport = {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  creator: string;
  status: string;
};

type OverviewCard = {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconClassName: string;
  trend: string;
  trendClassName: string;
};

type PortfolioUiItem = ReportsPortfolioItem & {
  color: string;
  formattedValue: string;
};

const REPORT_TYPE_OPTIONS = [
  { value: 'ALL', label: 'Tất cả thể loại' },
  { value: 'Financial', label: 'Tài chính (Financial)' },
  { value: 'Revenue', label: 'Doanh thu (Revenue)' },
  { value: 'Risk', label: 'Rủi ro (Risk)' },
  { value: 'Audit', label: 'Kiểm toán (Audit)' },
];

function safeNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value)} VND`;
}

function formatCompactVnd(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(1)}T VND`;
  }

  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B VND`;
  }

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M VND`;
  }

  return formatVnd(value);
}

function monthLabel(yyyyMm: string): string {
  const [year, month] = String(yyyyMm).split('-').map(Number);

  if (!year || !month) return String(yyyyMm);

  return `Tháng ${month}`;
}

function reportStatusLabel(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized === 'completed') return 'Hoàn tất';
  if (normalized === 'pending') return 'Đang xử lý';
  if (normalized === 'failed') return 'Thất bại';

  return status;
}

function reportStatusClassName(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized === 'completed') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }

  if (normalized === 'failed') {
    return 'bg-red-50 text-red-700 border border-red-200';
  }

  return 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse';
}

function toUiReports(items: ApiReportItem[]): UiReport[] {
  return items.map((report) => {
    const date = new Date(report.date);

    return {
      id: report.id,
      name: report.name,
      type: report.type,
      date: Number.isNaN(date.getTime())
        ? String(report.date)
        : date.toLocaleDateString('vi-VN'),
      size: `${safeNumber(report.size_mb).toFixed(1)} MB`,
      creator: report.creator,
      status: report.status,
    };
  });
}

export default function Reports() {
  const [reports, setReports] = useState<UiReport[]>([]);
  const [overview, setOverview] = useState<ReportsOverview | null>(null);
  const [bars, setBars] = useState<ReportsBar[]>([]);
  const [portfolio, setPortfolio] = useState<ReportsPortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<UiReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Financial');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newRange, setNewRange] = useState('Tháng này');

  const [selectedChartSegment, setSelectedChartSegment] = useState<string | null>(
    null
  );

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError('');

      const data = await getReportsSummary(6);

      setOverview(data.overview);
      setBars(data.bars);
      setPortfolio(data.portfolio);
      setReports(toUiReports(data.reports));
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Không thể tải dữ liệu báo cáo từ hệ thống.';

      setLoadError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    if (reportTypeFilter === 'ALL') return reports;

    return reports.filter((report) => report.type === reportTypeFilter);
  }, [reportTypeFilter, reports]);

  const overviewCards = useMemo<OverviewCard[]>(() => {
    if (!overview) return [];

    return [
      {
        label: 'Tổng tài sản hệ thống',
        value: formatVnd(
          safeNumber(overview.total_assets_active || overview.total_assets)
        ),
        icon: <TrendingUp className="h-5 w-5" />,
        iconClassName: 'bg-blue-50 text-blue-700',
        trend: `Tài khoản hoạt động: ${overview.active_account_count}/${overview.account_count}`,
        trendClassName: 'text-emerald-600',
      },
      {
        label: 'Tổng giá trị giao dịch',
        value: formatVnd(safeNumber(overview.transaction_volume)),
        icon: <DollarSign className="h-5 w-5" />,
        iconClassName: 'bg-emerald-50 text-emerald-700',
        trend: `${overview.transaction_count} giao dịch trong 6 tháng`,
        trendClassName: 'text-emerald-600',
      },
      {
        label: 'Số lượng khách hàng',
        value: new Intl.NumberFormat('vi-VN').format(
          safeNumber(overview.customer_count)
        ),
        icon: <Building2 className="h-5 w-5" />,
        iconClassName: 'bg-amber-50 text-amber-700',
        trend: 'Dữ liệu từ core_schema.customers',
        trendClassName: 'text-slate-500',
      },
      {
        label: 'Số lượng tài khoản',
        value: new Intl.NumberFormat('vi-VN').format(
          safeNumber(overview.account_count)
        ),
        icon: <BarChart3 className="h-5 w-5" />,
        iconClassName: 'bg-purple-50 text-purple-700',
        trend: 'Dữ liệu từ core_schema.accounts',
        trendClassName: 'text-slate-500',
      },
    ];
  }, [overview]);

  const fallbackOverviewCards = useMemo<OverviewCard[]>(
    () => [
      {
        label: 'Tổng tài sản hệ thống',
        value: '0 VND',
        icon: <TrendingUp className="h-5 w-5" />,
        iconClassName: 'bg-blue-50 text-blue-700',
        trend: 'Chưa có dữ liệu',
        trendClassName: 'text-slate-500',
      },
      {
        label: 'Tổng giá trị giao dịch',
        value: '0 VND',
        icon: <DollarSign className="h-5 w-5" />,
        iconClassName: 'bg-emerald-50 text-emerald-700',
        trend: 'Chưa có dữ liệu',
        trendClassName: 'text-slate-500',
      },
      {
        label: 'Số lượng khách hàng',
        value: '0',
        icon: <Building2 className="h-5 w-5" />,
        iconClassName: 'bg-amber-50 text-amber-700',
        trend: 'Chưa có dữ liệu',
        trendClassName: 'text-slate-500',
      },
      {
        label: 'Số lượng tài khoản',
        value: '0',
        icon: <BarChart3 className="h-5 w-5" />,
        iconClassName: 'bg-purple-50 text-purple-700',
        trend: 'Chưa có dữ liệu',
        trendClassName: 'text-slate-500',
      },
    ],
    []
  );

  const cardsToRender = overviewCards.length > 0 ? overviewCards : fallbackOverviewCards;

  const barMax = useMemo(() => {
    const maxValue = bars.reduce(
      (max, item) =>
        Math.max(max, safeNumber(item.capital), safeNumber(item.spending)),
      0
    );

    return maxValue > 0 ? maxValue : 1;
  }, [bars]);

  const portfolioWithColors = useMemo<PortfolioUiItem[]>(() => {
    const colors = [
      'bg-[#002147]',
      'bg-emerald-600',
      'bg-amber-500',
      'bg-slate-400',
    ];

    return portfolio.slice(0, 4).map((item, index) => ({
      ...item,
      color: colors[index] ?? 'bg-slate-400',
      formattedValue: formatCompactVnd(safeNumber(item.value)),
    }));
  }, [portfolio]);

  const handleCreateReport = (event: React.FormEvent) => {
    event.preventDefault();

    const newReport: UiReport = {
      id: `REP-${new Date().getFullYear()}-${String(reports.length + 1).padStart(
        3,
        '0'
      )}`,
      name: newName.trim() || `Báo cáo ${newType} - ${newRange}`,
      type: newType,
      date: new Date().toLocaleDateString('vi-VN'),
      size: `${(1 + Math.random() * 4).toFixed(1)} MB`,
      creator: 'Quản trị viên',
      status: 'Completed',
    };

    setReports((prev) => [newReport, ...prev]);
    setIsCreateModalOpen(false);
    setNewName('');
    setNewType('Financial');
    setNewFormat('PDF');
    setNewRange('Tháng này');
  };

  const handleExport = (report: UiReport) => {
    window.alert(
      `Đang khởi tạo tải xuống file ${report.name}.${newFormat.toLowerCase()}...`
    );
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
      
      try {
        const summary = await getReportSummary();
        if (!mounted) return;
        setSummaryData(summary);
      } catch (err) {
        console.error("Failed to load summary", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
            <span>Hệ thống</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">Báo cáo & Phân tích</span>
          </nav>

          <h2 className="font-display text-24 font-bold tracking-tight text-primary">
            Thống kê dữ liệu & Báo cáo tài chính
          </h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void loadReports()}
            className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-white px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-surface-container-low active:scale-95"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#001936] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Yêu cầu tạo báo cáo mới
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-700">
          Đang tải dữ liệu báo cáo...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cardsToRender.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-white p-5 shadow-sm"
          >
            <div>
              <div className={cn('mb-4 w-fit rounded-xl p-2.5', stat.iconClassName)}>
                {stat.icon}
              </div>

              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-on-surface-variant">
                {stat.label}
              </p>

              <p className="font-display text-lg font-bold leading-tight text-primary">
                {stat.value}
              </p>
            </div>

            <p className={cn('mt-4 text-[10px] font-bold', stat.trendClassName)}>
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-3xl border border-outline-variant bg-white p-6 shadow-sm lg:col-span-2">
          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h4 className="font-display text-base font-bold text-primary">
                  Biểu đồ phân tích chi tiêu & nguồn vốn
                </h4>

                <p className="text-xs text-on-surface-variant">
                  Phân bổ nguồn tiền và hạn mức thanh khoản trong 6 tháng gần nhất
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface-container p-1 text-[10px] font-bold">
                <button
                  type="button"
                  className="rounded-lg bg-white px-2.5 py-1 text-primary shadow-sm"
                >
                  Nguồn vốn
                </button>

                <button
                  type="button"
                  className="rounded-lg px-2.5 py-1 text-outline hover:bg-white/50"
                >
                  Chi tiêu
                </button>
              </div>
            </div>

            <div className="flex h-64 items-end justify-between gap-4 border-b border-outline-variant/30 pt-4">
              {bars.length === 0 && (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-surface-container-low text-sm font-semibold text-on-surface-variant">
                  Chưa có dữ liệu biểu đồ.
                </div>
              )}

              {bars.map((bar) => {
                const capital = safeNumber(bar.capital);
                const spending = safeNumber(bar.spending);

                return (
                  <div
                    key={bar.month}
                    className="group flex flex-1 cursor-pointer flex-col items-center gap-2"
                    onMouseEnter={() =>
                      setSelectedChartSegment(
                        `${monthLabel(bar.month)}: Nguồn vốn ${formatCompactVnd(
                          capital
                        )}, chi tiêu ${formatCompactVnd(spending)}`
                      )
                    }
                    onMouseLeave={() => setSelectedChartSegment(null)}
                  >
                    <div className="flex h-48 w-full items-end justify-center gap-1">
                      <div
                        className="w-3 rounded-t-md bg-orange-400 transition-all duration-300 hover:bg-orange-500 sm:w-4"
                        style={{
                          height: `${Math.max((spending / barMax) * 100, 4)}%`,
                        }}
                        title={`Chi tiêu: ${formatCompactVnd(spending)}`}
                      />

                      <div
                        className="w-3 rounded-t-md bg-[#002147] transition-all duration-300 hover:bg-[#001936] sm:w-4"
                        style={{
                          height: `${Math.max((capital / barMax) * 100, 4)}%`,
                        }}
                        title={`Nguồn vốn: ${formatCompactVnd(capital)}`}
                      />
                    </div>

                    <span className="text-center text-[10px] font-bold text-on-surface-variant">
                      {monthLabel(bar.month)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex min-h-[48px] flex-col justify-between gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container p-3 sm:flex-row sm:items-center">
            <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-on-surface-variant">
              <span className="h-2.5 w-2.5 rounded-full bg-[#002147]" />
              Nguồn vốn hệ thống
              <span className="ml-2 h-2.5 w-2.5 rounded-full bg-orange-400" />
              Chi tiêu vận hành
            </span>

            <span className="text-xs font-bold text-primary">
              {selectedChartSegment || "Di chuột vào các cột để xem chi tiết"}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-outline-variant bg-white p-6 shadow-sm">
          <div>
            <h4 className="mb-1 font-display text-base font-bold text-primary">
              Cơ cấu danh mục đầu tư
            </h4>

            <p className="mb-6 text-xs text-on-surface-variant">
              Tỷ trọng tài sản phát sinh thu nhập
            </p>

            <div className="space-y-4">
              {portfolioWithColors.length === 0 && (
                <div className="rounded-2xl bg-surface-container-low p-4 text-sm font-semibold text-on-surface-variant">
                  Chưa có dữ liệu danh mục đầu tư.
                </div>
              )}

              {portfolioWithColors.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between gap-3 text-xs font-bold">
                    <span className="flex items-center gap-2 text-on-surface-variant">
                      <span className={cn('h-2.5 w-2.5 rounded-full', item.color)} />
                      {item.name}
                    </span>

                    <span className="text-primary">
                      {safeNumber(item.percent)}% ({item.formattedValue})
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={cn('h-full rounded-full', item.color)}
                      style={{ width: `${Math.min(safeNumber(item.percent), 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

            <p className="text-[10px] leading-normal text-emerald-800">
              Hạn mức thanh khoản của hệ thống được theo dõi dựa trên dữ liệu tài
              khoản, giao dịch và danh mục đầu tư hiện có.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-low/30 p-4">
          <h4 className="font-display text-base font-bold text-primary">
            Kho lưu trữ báo cáo định kỳ
          </h4>

          <div className="flex gap-2">
            <select
              value={reportTypeFilter}
              onChange={(event) => setReportTypeFilter(event.target.value)}
              className="rounded-lg border border-outline-variant bg-surface px-3 py-1.5 text-xs font-bold text-on-surface-variant focus:outline-none"
            >
              {REPORT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-sm font-semibold text-on-surface-variant"
                  >
                    Không có báo cáo phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}

              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="font-numeric-data font-bold text-primary">
                      {report.id}
                    </span>
                  </td>

                  <td>
                    <span className="text-sm font-bold text-[#002147]">
                      {report.name}
                    </span>
                  </td>

                  <td className="text-center">
                    <span className="text-xs font-bold uppercase text-on-surface-variant">
                      {report.type}
                    </span>
                  </td>

                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Calendar className="h-3.5 w-3.5 opacity-50" />
                      {report.date}
                    </div>
                  </td>

                  <td>
                    <span className="font-mono text-xs font-bold">
                      {report.size}
                    </span>
                  </td>

                  <td>
                    <span className="text-xs font-bold text-on-surface-variant">
                      {report.creator}
                    </span>
                  </td>

                  <td className="text-center">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase',
                        reportStatusClassName(report.status)
                      )}
                    >
                      {reportStatusLabel(report.status)}
                    </span>
                  </td>

                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReport(report);
                          setIsDetailModalOpen(true);
                        }}
                        className="rounded p-1.5 text-primary transition-colors hover:bg-surface-container-high"
                        title="Xem báo cáo"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExport(report)}
                        className="rounded p-1.5 text-emerald-600 transition-colors hover:bg-surface-container-high"
                        title="Xuất file"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Yêu cầu tạo báo cáo mới"
      >
        <form onSubmit={handleCreateReport} className="space-y-4 p-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">
              Tên báo cáo
            </label>

            <input
              type="text"
              required
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Ví dụ: Báo cáo dòng tiền tháng 11..."
              className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                Loại báo cáo
              </label>

              <select
                value={newType}
                onChange={(event) => setNewType(event.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-sm focus:outline-none"
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
                onChange={(event) => setNewFormat(event.target.value)}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-sm focus:outline-none"
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
              onChange={(event) => setNewRange(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tháng này">Tháng này</option>
              <option value="Quý này">Quý này</option>
              <option value="Cả năm">Cả năm tài chính</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-outline-variant pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-lg px-6 py-2 text-sm font-bold text-on-surface-variant transition-all hover:bg-surface-container-low"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#002147] px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:shadow-lg active:scale-95"
            >
              Tạo báo cáo
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Bản xem trước báo cáo điện tử"
      >
        {selectedReport && (
          <div className="space-y-6 p-6">
            <div className="flex flex-col items-center rounded-3xl border border-outline-variant bg-surface-container p-6 text-center">
              <div className="mb-4 rounded-2xl bg-white p-3 shadow-sm">
                <FileText className="h-8 w-8 text-primary" />
              </div>

              <h4 className="font-display text-base font-bold text-primary">
                {selectedReport.name}
              </h4>

              <p className="text-[9px] font-bold uppercase tracking-widest text-outline">
                {selectedReport.id}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-outline-variant/30 py-2">
                <span className="text-on-surface-variant">Phân loại báo cáo</span>
                <span className="font-bold uppercase text-primary">
                  {selectedReport.type}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-outline-variant/30 py-2">
                <span className="text-on-surface-variant">Ngày phát hành</span>
                <span className="font-bold">{selectedReport.date}</span>
              </div>

              <div className="flex items-center justify-between border-b border-outline-variant/30 py-2">
                <span className="text-on-surface-variant">
                  Chịu trách nhiệm lập
                </span>
                <span className="font-bold">{selectedReport.creator}</span>
              </div>

              <div className="flex items-center justify-between border-b border-outline-variant/30 py-2">
                <span className="text-on-surface-variant">Định dạng mặc định</span>
                <span className="font-mono font-bold">PDF Document</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-outline-variant pt-4">
              <p className="text-[10px] font-bold uppercase text-outline">
                Nội dung tóm tắt & kế hoạch
              </p>

              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container p-4 text-xs leading-relaxed text-on-surface-variant">
                Báo cáo ghi nhận hiệu suất tài sản, dòng tiền gửi, giao dịch và
                trạng thái vận hành dựa trên dữ liệu hiện có trong cơ sở dữ liệu.
                Các chỉ số nên được kiểm tra cùng dữ liệu gốc trước khi sử dụng
                cho báo cáo chính thức.
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleExport(selectedReport)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002147] py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#001936]"
            >
              Tải file báo cáo hoàn chỉnh
              <Download className="h-4 w-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}