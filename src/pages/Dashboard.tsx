import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  History,
  ShieldCheck,
  Settings,
  Users,
  Wallet,
  Repeat2,
  Landmark,
  ReceiptText,
  AlertTriangle,
  FileText,
  UserPlus,
  Send,
  BadgeCheck,
  Clock3,
  XCircle,
  Eye,
  Download,
  Lock,
  Unlock,
  CalendarDays,
  BarChart3,
  CircleDollarSign,
  Building2,
  Search,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { cn } from '../lib/utils';
import { getCustomers, type Customer } from '../services/customers.service';
import { getAccounts, type Account } from '../services/accounts.service';
import {
  getTransactions,
  type Transaction,
} from '../services/transactions.service';

type TrendType = 'up' | 'down' | 'neutral' | 'warning';

type TransactionStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED'
  | 'CANCELLED';

type BillStatus = 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

type LoanStatus = 'ACTIVE' | 'CLOSED' | 'OVERDUE';

type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'CLOSED';

type TransactionChartPoint = {
  name: string;
  volume: number;
  amount: number;
};

type SegmentPoint = {
  name: string;
  value: number;
};

type RecentTransactionRow = {
  id: string;
  customer: string;
  fromAccount: string;
  toAccount: string;
  type: string;
  amount: string;
  fee: string;
  status: TransactionStatus;
  time: string;
  initial: string;
};

type AccountHealthRow = {
  accountNumber: string;
  owner: string;
  type: string;
  balance: string;
  status: AccountStatus;
};

type AlertRow = {
  title: string;
  desc: string;
  time: string;
  level: 'high' | 'medium';
};

type SystemLogRow = {
  title: string;
  desc: string;
  time: string;
};

type BillRow = {
  id: string;
  customer: string;
  type: string;
  amount: string;
  dueDate: string;
  status: BillStatus;
};

type LoanRow = {
  id: string;
  customer: string;
  amount: string;
  interestRate: string;
  endDate: string;
  status: LoanStatus;
};

const unpaidBills: BillRow[] = [];

const activeLoans: LoanRow[] = [];

const quickActions = [
  {
    title: 'Chuyển tiền',
    desc: 'Thực hiện chuyển tiền nội bộ',
    icon: Send,
    href: '/transfers/new',
    color: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  {
    title: 'Mở tài khoản',
    desc: 'Tạo tài khoản cho khách hàng',
    icon: Wallet,
    href: '/accounts/open',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  {
    title: 'Thêm khách hàng',
    desc: 'Tạo hồ sơ khách hàng mới',
    icon: UserPlus,
    href: '/customers/new',
    color: 'bg-purple-50 text-purple-700 border-purple-100',
  },
  {
    title: 'Thanh toán hóa đơn',
    desc: 'Xử lý hóa đơn chưa thanh toán',
    icon: ReceiptText,
    href: '/bills/pay',
    color: 'bg-amber-50 text-amber-700 border-amber-100',
  },
];

function safeNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatVnd(value: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
}

function formatDateTime(value: unknown): string {
  if (!value) return '-';

  const d = new Date(String(value));

  if (Number.isNaN(d.getTime())) return '-';

  const time = d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const date = d.toLocaleDateString('vi-VN');

  return `${time} - ${date}`;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  return (
    parts
      .slice(-2)
      .map((word) => (word[0] ? word[0].toUpperCase() : ''))
      .join('') || '--'
  );
}

function normalizeTransactionStatus(status: unknown): TransactionStatus {
  const s = String(status || '').toUpperCase();

  if (
    s === 'PENDING' ||
    s === 'COMPLETED' ||
    s === 'FAILED' ||
    s === 'REVERSED' ||
    s === 'CANCELLED'
  ) {
    return s;
  }

  return 'PENDING';
}

function normalizeAccountStatus(status: unknown): AccountStatus {
  const s = String(status || '').toUpperCase();

  if (s === 'ACTIVE' || s === 'INACTIVE' || s === 'LOCKED' || s === 'CLOSED') {
    return s;
  }

  return 'INACTIVE';
}

function statusBadge(
  status: TransactionStatus | BillStatus | LoanStatus | AccountStatus
) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
    INACTIVE: 'bg-slate-50 text-slate-600 border-slate-200',
    LOCKED: 'bg-red-50 text-red-700 border-red-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',

    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    REVERSED: 'bg-purple-50 text-purple-700 border-purple-200',
    CANCELLED: 'bg-slate-50 text-slate-600 border-slate-200',

    UNPAID: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    OVERDUE: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold',
        styles[status] || 'bg-slate-50 text-slate-600 border-slate-200'
      )}
    >
      {status}
    </span>
  );
}

function trendIcon(trend: TrendType) {
  if (trend === 'up') {
    return <TrendingUp className="h-3.5 w-3.5" />;
  }

  if (trend === 'down') {
    return <TrendingDown className="h-3.5 w-3.5" />;
  }

  if (trend === 'warning') {
    return <AlertTriangle className="h-3.5 w-3.5" />;
  }

  return <Clock3 className="h-3.5 w-3.5" />;
}

function transactionStatusIcon(status: TransactionStatus) {
  if (status === 'COMPLETED') {
    return <BadgeCheck className="h-4 w-4 text-emerald-600" />;
  }

  if (status === 'PENDING') {
    return <Clock3 className="h-4 w-4 text-yellow-600" />;
  }

  if (status === 'FAILED') {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }

  if (status === 'REVERSED') {
    return <Repeat2 className="h-4 w-4 text-purple-600" />;
  }

  return <XCircle className="h-4 w-4 text-slate-500" />;
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  change: string;
  trend: TrendType;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="rounded-xl bg-slate-50 p-3 text-[#002147]">
          <Icon className="h-5 w-5" />
        </div>

        <div
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold',
            trend === 'up' && 'bg-emerald-50 text-emerald-700',
            trend === 'down' && 'bg-red-50 text-red-700',
            trend === 'warning' && 'bg-amber-50 text-amber-700',
            trend === 'neutral' && 'bg-slate-50 text-slate-600'
          )}
        >
          {trendIcon(trend)}
          {change}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="mt-2 truncate text-3xl font-bold tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  actionText,
}: {
  title: string;
  description?: string;
  actionText?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-bold text-slate-950">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {actionText && (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#002147] hover:underline"
        >
          {actionText}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const [customerData, accountData, transactionData] =
          await Promise.all([getCustomers(), getAccounts(), getTransactions()]);

        setCustomers(customerData);
        setAccounts(accountData);
        setTransactions(transactionData);
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';

        setError(
          msg ||
          'Không thể tải dữ liệu từ hệ thống. Vui lòng kiểm tra backend.'
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const accountsById = useMemo(() => {
    const map = new Map<number, Account>();

    accounts.forEach((account) => {
      map.set(account.account_id, account);
    });

    return map;
  }, [accounts]);

  const dashboardStats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalAccounts = accounts.length;

    const activeAccounts = accounts.filter(
      (account) => String(account.status).toUpperCase() === 'ACTIVE'
    ).length;

    const totalBalance = accounts.reduce(
      (sum, account) => sum + safeNumber(account.balance),
      0
    );

    const totalTransactions = transactions.length;

    const todayKey = new Date().toISOString().slice(0, 10);

    const transactionsToday = transactions.filter(
      (transaction) => String(transaction.created_at).slice(0, 10) === todayKey
    );

    const transactionsTodayCount = transactionsToday.length;

    const transactionsTodayAmount = transactionsToday.reduce(
      (sum, transaction) => sum + safeNumber(transaction.amount),
      0
    );

    return {
      totalCustomers,
      totalAccounts,
      activeAccounts,
      totalBalance,
      totalTransactions,
      transactionsTodayCount,
      transactionsTodayAmount,
    };
  }, [customers, accounts, transactions]);

  const statsText = useMemo(() => {
    const nf = new Intl.NumberFormat('vi-VN');

    const totalCustomers = nf.format(dashboardStats.totalCustomers);
    const activeAccounts = nf.format(dashboardStats.activeAccounts);
    const transactionsToday = nf.format(
      dashboardStats.transactionsTodayCount
    );
    const totalBalance = formatVnd(dashboardStats.totalBalance);

    const amountB = dashboardStats.transactionsTodayAmount / 1_000_000_000;

    const transactionValueToday =
      amountB >= 1
        ? `${amountB.toFixed(1)}B VND`
        : formatVnd(dashboardStats.transactionsTodayAmount);

    return {
      totalCustomers,
      activeAccounts,
      transactionsToday,
      transactionValueToday,
      totalBalance,
    };
  }, [dashboardStats]);

  const transactionChartData = useMemo<TransactionChartPoint[]>(() => {
    const now = new Date();

    const days: TransactionChartPoint[] = [];

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now);

      d.setDate(now.getDate() - i);

      const label = d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      });

      days.push({
        name: label,
        volume: 0,
        amount: 0,
      });
    }

    const indexByName = new Map(days.map((point, index) => [point.name, index]));

    transactions.forEach((transaction) => {
      const d = new Date(String(transaction.created_at));

      if (Number.isNaN(d.getTime())) return;

      const label = d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
      });

      const index = indexByName.get(label);

      if (index === undefined) return;

      days[index] = {
        ...days[index],
        volume: days[index].volume + 1,
        amount: days[index].amount + safeNumber(transaction.amount),
      };
    });

    return days.map((point) => ({
      ...point,
      amount: Math.round(point.amount / 1_000_000),
    }));
  }, [transactions]);

  const customerSegmentData = useMemo<SegmentPoint[]>(() => {
    const groups = new Map<string, number>();

    customers.forEach((customer) => {
      const gender = String(customer.gender ?? 'UNKNOWN').toUpperCase();

      groups.set(gender, (groups.get(gender) ?? 0) + 1);
    });

    const labelMap: Record<string, string> = {
      MALE: 'Nam',
      FEMALE: 'Nữ',
      OTHER: 'Khác',
      UNKNOWN: 'Chưa rõ',
    };

    const ordered = ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'];

    return ordered
      .filter((key) => (groups.get(key) ?? 0) > 0)
      .map((key) => ({
        name: labelMap[key] ?? key,
        value: groups.get(key) ?? 0,
      }));
  }, [customers]);

  const recentTransactions = useMemo<RecentTransactionRow[]>(() => {
    return transactions.slice(0, 8).map((transaction) => {
      const fromAccount = accountsById.get(transaction.from_account_id);
      const customerName = fromAccount?.full_name ?? 'Chưa xác định';

      return {
        id: `#TXN-${transaction.transaction_id}`,
        customer: customerName,
        fromAccount:
          transaction.from_account_number ??
          String(transaction.from_account_id ?? '-'),
        toAccount:
          transaction.to_account_number ??
          String(transaction.to_account_id ?? '-'),
        type: String(transaction.transaction_type ?? '-'),
        amount: formatVnd(safeNumber(transaction.amount)),
        fee: '0 VND',
        status: normalizeTransactionStatus(transaction.status),
        time: formatDateTime(transaction.created_at),
        initial: getInitials(customerName),
      };
    });
  }, [transactions, accountsById]);

  const accountHealth = useMemo<AccountHealthRow[]>(() => {
    const sorted = [...accounts].sort(
      (a, b) => safeNumber(b.balance) - safeNumber(a.balance)
    );

    return sorted.slice(0, 6).map((account) => ({
      accountNumber: account.account_number,
      owner: account.full_name,
      type: account.type_name,
      balance: formatVnd(safeNumber(account.balance)),
      status: normalizeAccountStatus(account.status),
    }));
  }, [accounts]);

  const securityAlerts = useMemo<AlertRow[]>(() => {
    const alerts: AlertRow[] = [];

    const inactiveAccounts = accounts.filter(
      (account) => String(account.status).toUpperCase() !== 'ACTIVE'
    );

    inactiveAccounts.slice(0, 2).forEach((account) => {
      alerts.push({
        title: 'Tài khoản không hoạt động',
        desc: `Tài khoản: ${account.account_number} • Trạng thái: ${account.status}`,
        time: 'Vừa cập nhật',
        level: 'medium',
      });
    });

    const failedTransactions = transactions.filter(
      (transaction) => String(transaction.status).toUpperCase() === 'FAILED'
    );

    failedTransactions.slice(0, 2).forEach((transaction) => {
      alerts.push({
        title: 'Giao dịch thất bại',
        desc: `TXN-${transaction.transaction_id} • ${formatVnd(
          safeNumber(transaction.amount)
        )}`,
        time: formatDateTime(transaction.created_at),
        level: 'high',
      });
    });

    return alerts.slice(0, 4);
  }, [accounts, transactions]);

  const systemLogs = useMemo<SystemLogRow[]>(() => {
    const time = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return [
      {
        title: 'Đồng bộ dữ liệu',
        desc: `Customers: ${customers.length} • Accounts: ${accounts.length} • Transactions: ${transactions.length}`,
        time,
      },
    ];
  }, [customers.length, accounts.length, transactions.length]);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      {loading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          Đang tải dữ liệu dashboard...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Enterprise Banking Management System
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Dashboard tổng quan hệ thống
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Theo dõi tình trạng khách hàng, tài khoản, giao dịch, hóa
              đơn, khoản vay, thẻ và các cảnh báo vận hành quan trọng
              trong ngày.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <CalendarDays className="h-4 w-4" />
              Hôm nay
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001936]"
            >
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Tổng khách hàng"
          value={statsText.totalCustomers}
          change="Theo CSDL"
          trend="up"
          icon={Users}
          description="Khách hàng cá nhân và doanh nghiệp"
        />

        <StatCard
          title="Tài khoản hoạt động"
          value={statsText.activeAccounts}
          change="Theo CSDL"
          trend="up"
          icon={Wallet}
          description="ACTIVE trên toàn hệ thống"
        />

        <StatCard
          title="Giao dịch hôm nay"
          value={statsText.transactionsToday}
          change="Theo CSDL"
          trend="neutral"
          icon={Repeat2}
          description="Bao gồm chuyển tiền và thanh toán"
        />

        <StatCard
          title="Giá trị giao dịch"
          value={statsText.transactionValueToday}
          change="Theo CSDL"
          trend="up"
          icon={CircleDollarSign}
          description="Tổng giá trị giao dịch trong ngày"
        />

        <StatCard
          title="Khoản vay hoạt động"
          value={String(activeLoans.length)}
          change="Chưa tích hợp"
          trend="down"
          icon={Landmark}
          description="ACTIVE và OVERDUE cần theo dõi"
        />

        <StatCard
          title="Hóa đơn chưa thanh toán"
          value={String(unpaidBills.length)}
          change="Chưa tích hợp"
          trend="warning"
          icon={ReceiptText}
          description="UNPAID và OVERDUE"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          title="Tác vụ nhanh"
          description="Các thao tác thường dùng trong luồng nghiệp vụ ngân hàng"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                className={cn(
                  'group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md',
                  item.color
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-xl bg-white/70 p-3">
                    <Icon className="h-5 w-5" />
                  </div>

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>

                <p className="text-base font-bold">{item.title}</p>
                <p className="mt-1 text-sm opacity-80">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Khối lượng giao dịch theo ngày
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Theo dõi số lượng giao dịch và giá trị giao dịch trong 7
                ngày gần nhất
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
              7 NGÀY
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionChartData}>
                <defs>
                  <linearGradient
                    id="transactionVolume"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#002147" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#002147" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b' }}
                />

                <YAxis
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b' }}
                />

                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'Giá trị giao dịch') {
                      return [`${value} triệu VND`, name];
                    }

                    return [value, name];
                  }}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="volume"
                  name="Số giao dịch"
                  stroke="#002147"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#transactionVolume)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Phân nhóm khách hàng
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Thống kê khách hàng theo dữ liệu hiện có trong cơ sở dữ liệu
              </p>
            </div>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegmentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  dataKey="name"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b' }}
                />

                <YAxis
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b' }}
                  allowDecimals={false}
                />

                <Tooltip
                  cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                  }}
                />

                <Bar
                  dataKey="value"
                  name="Số lượng"
                  fill="#002147"
                  radius={[8, 8, 0, 0]}
                  barSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm 2xl:col-span-3">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Giao dịch gần đây
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Danh sách giao dịch mới nhất gồm chuyển tiền, thanh toán
                  hóa đơn và trả khoản vay
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#002147] sm:w-64"
                    placeholder="Tìm mã GD, tài khoản..."
                  />
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Mã giao dịch
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Tài khoản nguồn
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Tài khoản nhận
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Phí
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-8 text-center text-sm font-semibold text-slate-500"
                    >
                      Chưa có giao dịch. Hãy kiểm tra API{' '}
                      <span className="font-mono">/api/transactions</span>.
                    </td>
                  </tr>
                )}

                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-[#002147]">
                      {transaction.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002147] text-xs font-bold text-white">
                          {transaction.initial}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {transaction.customer}
                          </p>
                          <p className="text-xs text-slate-500">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-sm text-slate-700">
                      {transaction.fromAccount}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm text-slate-700">
                      {transaction.toAccount}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-950">
                      {transaction.amount}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transaction.fee}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transactionStatusIcon(transaction.status)}
                        {statusBadge(transaction.status)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {transaction.time}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Cảnh báo
              </h3>

              <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700">
                {securityAlerts.length} mới
              </span>
            </div>

            <div className="space-y-3">
              {securityAlerts.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                  Chưa có cảnh báo từ dữ liệu hiện tại.
                </div>
              )}

              {securityAlerts.map((alert) => (
                <div
                  key={`${alert.title}-${alert.desc}`}
                  className={cn(
                    'rounded-2xl border p-4',
                    alert.level === 'high'
                      ? 'border-red-200 bg-red-50'
                      : 'border-amber-200 bg-amber-50'
                  )}
                >
                  <p
                    className={cn(
                      'text-sm font-bold',
                      alert.level === 'high'
                        ? 'text-red-800'
                        : 'text-amber-800'
                    )}
                  >
                    {alert.title}
                  </p>

                  <p
                    className={cn(
                      'mt-1 text-xs',
                      alert.level === 'high'
                        ? 'text-red-700'
                        : 'text-amber-700'
                    )}
                  >
                    {alert.desc}
                  </p>

                  <p className="mt-2 text-[11px] font-semibold text-slate-500">
                    {alert.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950">
              <ShieldCheck className="h-5 w-5 text-[#002147]" />
              Trạng thái bảo mật
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <Unlock className="h-5 w-5 text-emerald-700" />

                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      RLS hoạt động
                    </p>
                    <p className="text-xs text-emerald-700">
                      Customer chỉ xem dữ liệu của mình
                    </p>
                  </div>
                </div>

                <BadgeCheck className="h-5 w-5 text-emerald-700" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-700" />

                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      RBAC đã bật
                    </p>
                    <p className="text-xs text-blue-700">
                      User được giới hạn theo role
                    </p>
                  </div>
                </div>

                <BadgeCheck className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Hóa đơn chưa thanh toán"
            description="UNPAID và OVERDUE cần xử lý"
            actionText="Xem hóa đơn"
          />

          <div className="space-y-3">
            {unpaidBills.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                Chưa có dữ liệu hóa đơn. Chức năng này chưa tích hợp API.
              </div>
            )}

            {unpaidBills.map((bill) => (
              <div
                key={bill.id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#002147]">
                      {bill.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {bill.customer}
                    </p>
                  </div>

                  {statusBadge(bill.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Loại hóa đơn</p>
                    <p className="font-semibold text-slate-800">{bill.type}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Số tiền</p>
                    <p className="font-bold text-slate-950">{bill.amount}</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Hạn thanh toán</p>
                    <p className="font-semibold text-slate-800">
                      {bill.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Khoản vay cần theo dõi"
            description="ACTIVE, OVERDUE và khoản vay gần hạn"
            actionText="Xem khoản vay"
          />

          <div className="space-y-3">
            {activeLoans.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                Chưa có dữ liệu khoản vay. Chức năng này chưa tích hợp API.
              </div>
            )}

            {activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#002147]">
                      {loan.id}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {loan.customer}
                    </p>
                  </div>

                  {statusBadge(loan.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Số tiền vay</p>
                    <p className="font-bold text-slate-950">{loan.amount}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Lãi suất</p>
                    <p className="font-semibold text-slate-800">
                      {loan.interestRate}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Ngày kết thúc</p>
                    <p className="font-semibold text-slate-800">
                      {loan.endDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Tài khoản cần chú ý"
            description="Tài khoản bị khóa, số dư thấp hoặc có biến động"
            actionText="Xem tài khoản"
          />

          <div className="space-y-3">
            {accountHealth.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                Chưa có dữ liệu tài khoản. Hãy kiểm tra API{' '}
                <span className="font-mono">/api/accounts</span>.
              </div>
            )}

            {accountHealth.map((account) => (
              <div
                key={account.accountNumber}
                className="rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-[#002147]">
                      {account.accountNumber}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {account.owner}
                    </p>
                  </div>

                  {statusBadge(account.status)}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Loại tài khoản</p>
                    <p className="font-semibold text-slate-800">
                      {account.type}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Số dư</p>
                    <p className="font-bold text-slate-950">
                      {account.balance}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <SectionHeader
            title="Nhật ký hệ thống gần đây"
            description="Theo dõi các hành động quan trọng từ user, procedure, trigger và audit"
            actionText="Xem log"
          />

          <div className="space-y-4">
            {systemLogs.map((log, index) => (
              <div
                key={log.title}
                className="flex gap-4 rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#002147]">
                    <History className="h-4 w-4" />
                  </div>

                  {index !== systemLogs.length - 1 && (
                    <div className="mt-2 h-full w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <p className="text-sm font-bold text-slate-950">
                      {log.title}
                    </p>

                    <p className="font-mono text-xs text-slate-400">
                      {log.time}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">{log.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-[#002147] p-6 text-white shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold">Tình trạng vận hành</h3>

              <p className="mt-1 text-sm text-white/70">
                Tổng quan nhanh về hệ thống hôm nay
              </p>
            </div>

            <BarChart3 className="h-6 w-6 text-white/80" />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/70">
                  Giao dịch thành công
                </p>

                <p className="text-sm font-bold">98.6%</p>
              </div>

              <div className="h-2 rounded-full bg-white/15">
                <div className="h-2 w-[98%] rounded-full bg-emerald-400" />
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/70">Tài khoản ACTIVE</p>

                <p className="text-sm font-bold">91.2%</p>
              </div>

              <div className="h-2 rounded-full bg-white/15">
                <div className="h-2 w-[91%] rounded-full bg-blue-300" />
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-white/70">Hóa đơn quá hạn</p>

                <p className="text-sm font-bold">3.4%</p>
              </div>

              <div className="h-2 rounded-full bg-white/15">
                <div className="h-2 w-[34%] rounded-full bg-amber-300" />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#002147] transition hover:bg-blue-50"
          >
            <Building2 className="h-4 w-4" />
            Xem báo cáo vận hành
          </button>
        </div>
      </div>

      <button
        type="button"
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#002147] text-white shadow-xl transition hover:scale-110 hover:bg-[#001936]"
      >
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}