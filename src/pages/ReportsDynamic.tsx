import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronRight, Download, Eye, Plus, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';
import { getReportsSummary, type ReportItem, type ReportsBar, type ReportsPortfolioItem } from '../services/reports.service';

type UiReport = {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  creator: string;
  status: string;
};

function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value) + ' VND';
}

function formatCompactVnd(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${(value / 1e12).toFixed(1)}T VND`;
  if (abs >= 1e9) return `${(value / 1e9).toFixed(1)}B VND`;
  if (abs >= 1e6) return `${(value / 1e6).toFixed(1)}M VND`;
  return formatVnd(value);
}

function monthLabel(yyyyMm: string): string {
  const [y, m] = yyyyMm.split('-').map(Number);
  if (!y || !m) return yyyyMm;
  return `Tháng ${m}`;
}

function toUiReports(items: ReportItem[]): UiReport[] {
  return items.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    date: new Date(r.date).toLocaleDateString('vi-VN'),
    size: `${r.size_mb.toFixed(1)} MB`,
    creator: r.creator,
    status: r.status,
  }));
}

export default function ReportsDynamic() {
  const [reports, setReports] = useState<UiReport[]>([]);
  const [bars, setBars] = useState<ReportsBar[]>([]);
  const [portfolio, setPortfolio] = useState<ReportsPortfolioItem[]>([]);
  const [overview, setOverview] = useState<{
    total_assets: number;
    total_assets_active: number;
    customer_count: number;
    account_count: number;
    active_account_count: number;
    transaction_volume: number;
    transaction_count: number;
  } | null>(null);

  const [reportTypeFilter, setReportTypeFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<UiReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Financial');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newRange, setNewRange] = useState('Tháng này');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setLoadError('');
        const data = await getReportsSummary(6);
        if (cancelled) return;

        setOverview(data.overview);
        setBars(data.bars);
        setPortfolio(data.portfolio);
        setReports(toUiReports(data.reports));
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load reports data');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReports = useMemo(() => {
    if (reportTypeFilter === 'ALL') return reports;
    return reports.filter((r) => r.type === reportTypeFilter);
  }, [reportTypeFilter, reports]);

  const barMax = useMemo(() => {
    const maxVal = bars.reduce((m, b) => Math.max(m, b.capital, b.spending), 0);
    return maxVal > 0 ? maxVal : 1;
  }, [bars]);

  const portfolioWithColors = useMemo(() => {
    const colors = ['bg-[#002147]', 'bg-emerald-600', 'bg-amber-500', 'bg-slate-400'];
    return portfolio.slice(0, 4).map((p, idx) => ({
      ...p,
      color: colors[idx] ?? 'bg-slate-400',
      val: formatCompactVnd(p.value),
    }));
  }, [portfolio]);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `REP-${new Date().toISOString().slice(0, 10)}`;
    const newRep: UiReport = {
      id: newId,
      name: newName || `Báo cáo ${newType} - ${newRange}`,
      type: newType,
      date: new Date().toLocaleDateString('vi-VN'),
      size: '—',
      creator: 'User',
      status: 'Pending',
    };
    setReports((prev) => [newRep, ...prev]);
    setIsCreateModalOpen(false);
    setNewName('');
  };

  const handleExport = (rep: UiReport) => {
    alert(`Đang khởi tạo tải xuống file ${rep.name}.${newFormat.toLowerCase()}...`);
  };

  const statCards = useMemo(() => {
    if (!overview) return [];
    return [
      { label: 'Tổng tài sản (ACTIVE)', value: formatVnd(overview.total_assets_active || overview.total_assets) },
      { label: 'Tổng giá trị giao dịch', value: formatVnd(overview.transaction_volume) },
      { label: 'Khách hàng', value: new Intl.NumberFormat('vi-VN').format(overview.customer_count) },
      { label: 'Tài khoản', value: `${overview.active_account_count}/${overview.account_count}` },
    ];
  }, [overview]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Báo cáo</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">Reports</h2>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#002147] hover:bg-[#001936] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Yêu cầu tạo báo cáo
        </button>
      </div>

      {loadError && (
        <div className="bg-error-container border-l-4 border-error p-4 rounded-lg flex items-start gap-2">
          <span className="material-symbols-outlined text-error mt-0.5">error</span>
          <div>
            <h3 className="font-semibold text-sm text-on-error-container">Lỗi tải dữ liệu</h3>
            <p className="text-body-sm text-on-error-container mt-1">{loadError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(isLoading
          ? Array.from({ length: 4 }).map((_, i) => ({ label: '...', value: '...', key: `l-${i}` }))
          : statCards.map((s, i) => ({ ...s, key: `s-${i}` }))
        ).map((s) => (
          <div key={s.key} className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between">
              <p className="label-uppercase text-on-surface-variant text-[10px] mb-1">{s.label}</p>
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-outline" />}
            </div>
            <p className="font-display font-bold text-lg text-primary leading-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h4 className="font-display font-bold text-base text-primary mb-1">Giao dịch theo tháng</h4>
          <p className="text-xs text-on-surface-variant mb-6">Dữ liệu từ core_schema.transactions</p>

          <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-outline-variant/30">
            {bars.map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center gap-1 items-end h-48">
                  <div
                    className="w-3 sm:w-4 bg-orange-400 rounded-t-md"
                    style={{ height: `${(bar.spending / barMax) * 100}%` }}
                    title={`Chi tiêu: ${formatCompactVnd(bar.spending)}`}
                  />
                  <div
                    className="w-3 sm:w-4 bg-[#002147] rounded-t-md"
                    style={{ height: `${(bar.capital / barMax) * 100}%` }}
                    title={`Nguồn vốn: ${formatCompactVnd(bar.capital)}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{monthLabel(bar.month)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-outline-variant rounded-3xl p-6 shadow-sm">
          <h4 className="font-display font-bold text-base text-primary mb-1">Cơ cấu số dư</h4>
          <p className="text-xs text-on-surface-variant mb-6">Dữ liệu từ core_schema.accounts + account_types</p>

          <div className="space-y-4">
            {portfolioWithColors.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-variant flex items-center gap-2">
                    <span className={cn('w-2.5 h-2.5 rounded-full', item.color)} />
                    {item.name}
                  </span>
                  <span className="text-primary">
                    {item.percent.toFixed(1)}% ({item.val})
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', item.color)} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-low/30">
          <h4 className="font-display font-bold text-base text-primary">Kho báo cáo</h4>
          <select
            value={reportTypeFilter}
            onChange={(e) => setReportTypeFilter(e.target.value)}
            className="bg-surface border border-outline-variant rounded-lg px-3 py-1.5 text-xs font-bold text-on-surface-variant focus:outline-none"
          >
            <option value="ALL">Tất cả</option>
            <option value="Financial">Financial</option>
            <option value="Revenue">Revenue</option>
            <option value="Risk">Risk</option>
            <option value="Audit">Audit</option>
          </select>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
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
                    <span className="font-numeric-data text-primary font-bold">{rep.id}</span>
                  </td>
                  <td>
                    <span className="font-bold text-sm text-[#002147]">{rep.name}</span>
                  </td>
                  <td className="text-center">
                    <span className="text-xs font-bold text-on-surface-variant uppercase">{rep.type}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      {rep.date}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-mono font-bold">{rep.size}</span>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-on-surface-variant">{rep.creator}</span>
                  </td>
                  <td className="text-center">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase',
                        rep.status === 'Completed'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-surface-container-highest text-on-surface-variant animate-pulse',
                      )}
                    >
                      {rep.status === 'Completed' ? 'Hoàn tất' : 'Đang xử lý'}
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
              {!isLoading && filteredReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-xs text-on-surface-variant py-6">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Yêu cầu tạo báo cáo mới">
        <form onSubmit={handleCreateReport} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Tên báo cáo</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ví dụ: Báo cáo giao dịch tháng này"
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Loại báo cáo</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="Financial">Financial</option>
                <option value="Revenue">Revenue</option>
                <option value="Risk">Risk</option>
                <option value="Audit">Audit</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">Định dạng xuất</label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="JSON">JSON</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">Khoảng thời gian</label>
            <select
              value={newRange}
              onChange={(e) => setNewRange(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tháng này">Tháng này</option>
              <option value="6 tháng">6 tháng</option>
              <option value="1 năm">1 năm</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all active:scale-95"
            >
              Tạo yêu cầu
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Xem báo cáo">
        {selectedReport && (
          <div className="p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Mã</span>
                <span className="font-bold">{selectedReport.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tên</span>
                <span className="font-bold">{selectedReport.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Ngày</span>
                <span className="font-bold">{selectedReport.date}</span>
              </div>
            </div>

            <button
              onClick={() => handleExport(selectedReport)}
              className="w-full py-3 bg-[#002147] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#001936] transition-all shadow-md"
            >
              Tải file <Download className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

