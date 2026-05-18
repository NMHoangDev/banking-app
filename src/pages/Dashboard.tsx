import React from 'react';
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
  CreditCard,
  Banknote,
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

const transactionChartData = [
  { name: '01/10', volume: 4200, amount: 42 },
  { name: '05/10', volume: 5100, amount: 58 },
  { name: '10/10', volume: 3800, amount: 36 },
  { name: '15/10', volume: 6200, amount: 72 },
  { name: '20/10', volume: 5400, amount: 63 },
  { name: '25/10', volume: 7100, amount: 81 },
  { name: '30/10', volume: 8490, amount: 96 },
];

const customerSegmentData = [
  { name: 'CÁ NHÂN', value: 80 },
  { name: 'DOANH NGHIỆP', value: 45 },
  { name: 'ƯU TIÊN', value: 65 },
  { name: 'TỔ CHỨC', value: 30 },
];

const recentTransactions = [
  {
    id: '#TXN-49021',
    customer: 'Nguyễn Văn Thành',
    fromAccount: '1000000001',
    toAccount: '1000000002',
    type: 'INTERNAL_TRANSFER',
    amount: '25,000,000 VND',
    fee: '2,000 VND',
    status: 'COMPLETED' as TransactionStatus,
    time: '14:20 - 24/10/2023',
    initial: 'NT',
  },
  {
    id: '#TXN-49022',
    customer: 'Lê Minh Hoàng',
    fromAccount: '1000000003',
    toAccount: '1000000010',
    type: 'BILL_PAYMENT',
    amount: '1,450,000 VND',
    fee: '0 VND',
    status: 'PENDING' as TransactionStatus,
    time: '14:15 - 24/10/2023',
    initial: 'LH',
  },
  {
    id: '#TXN-49023',
    customer: 'Trần Thị Phương',
    fromAccount: '1000000021',
    toAccount: '1000000034',
    type: 'INTERNAL_TRANSFER',
    amount: '2,300,000 VND',
    fee: '2,000 VND',
    status: 'FAILED' as TransactionStatus,
    time: '13:58 - 24/10/2023',
    initial: 'TP',
  },
  {
    id: '#TXN-49024',
    customer: 'Công ty Minh Long',
    fromAccount: '1000000045',
    toAccount: '1000000062',
    type: 'LOAN_PAYMENT',
    amount: '85,000,000 VND',
    fee: '0 VND',
    status: 'COMPLETED' as TransactionStatus,
    time: '13:45 - 24/10/2023',
    initial: 'ML',
  },
  {
    id: '#TXN-49025',
    customer: 'Phạm Gia Hân',
    fromAccount: '1000000091',
    toAccount: '1000000095',
    type: 'REVERSAL',
    amount: '5,000,000 VND',
    fee: '0 VND',
    status: 'REVERSED' as TransactionStatus,
    time: '13:22 - 24/10/2023',
    initial: 'GH',
  },
];

const unpaidBills = [
  {
    id: '#BILL-1021',
    customer: 'Nguyễn Văn Thành',
    type: 'Điện',
    amount: '850,000 VND',
    dueDate: '26/10/2023',
    status: 'UNPAID' as BillStatus,
  },
  {
    id: '#BILL-1022',
    customer: 'Lê Minh Hoàng',
    type: 'Internet',
    amount: '320,000 VND',
    dueDate: '24/10/2023',
    status: 'OVERDUE' as BillStatus,
  },
  {
    id: '#BILL-1023',
    customer: 'Trần Thị Phương',
    type: 'Nước',
    amount: '190,000 VND',
    dueDate: '28/10/2023',
    status: 'UNPAID' as BillStatus,
  },
];

const activeLoans = [
  {
    id: '#LOAN-3001',
    customer: 'Công ty Minh Long',
    amount: '1,200,000,000 VND',
    interestRate: '8.5%',
    endDate: '30/10/2023',
    status: 'ACTIVE' as LoanStatus,
  },
  {
    id: '#LOAN-3002',
    customer: 'Nguyễn Văn Thành',
    amount: '350,000,000 VND',
    interestRate: '9.2%',
    endDate: '25/10/2023',
    status: 'OVERDUE' as LoanStatus,
  },
  {
    id: '#LOAN-3003',
    customer: 'Trần Thị Phương',
    amount: '180,000,000 VND',
    interestRate: '7.8%',
    endDate: '15/11/2023',
    status: 'ACTIVE' as LoanStatus,
  },
];

const accountHealth = [
  {
    accountNumber: '1000000001',
    owner: 'Nguyễn Văn Thành',
    type: 'Saving',
    balance: '245,000,000 VND',
    status: 'ACTIVE' as AccountStatus,
  },
  {
    accountNumber: '1000000003',
    owner: 'Lê Minh Hoàng',
    type: 'Payment',
    balance: '18,500,000 VND',
    status: 'ACTIVE' as AccountStatus,
  },
  {
    accountNumber: '1000000021',
    owner: 'Trần Thị Phương',
    type: 'Payment',
    balance: '0 VND',
    status: 'LOCKED' as AccountStatus,
  },
];

const securityAlerts = [
  {
    title: 'Đăng nhập bất thường',
    desc: 'IP: 192.168.1.105 • 10 phút trước',
    level: 'high',
  },
  {
    title: 'Thay đổi hạn mức giao dịch',
    desc: 'Account: 1000000003 • 1 giờ trước',
    level: 'medium',
  },
];

const systemLogs = [
  {
    title: 'Tạo tài khoản mới',
    desc: 'Employee [ID: 29] đã mở tài khoản Saving',
    time: '14:05:22',
  },
  {
    title: 'Thực hiện chuyển tiền',
    desc: 'Procedure transfer_money_by_account_number được gọi',
    time: '13:52:10',
  },
  {
    title: 'Ghi audit log tài khoản',
    desc: 'accounts_audit_trigger đã ghi nhận thay đổi số dư',
    time: '13:40:00',
  },
  {
    title: 'Cập nhật trạng thái hóa đơn',
    desc: 'Bill #BILL-1020 đã chuyển sang PAID',
    time: '13:12:44',
  },
];

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

function statusBadge(status: TransactionStatus | BillStatus | LoanStatus | AccountStatus) {
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
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>

      {actionText && (
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-[#002147] hover:underline">
          {actionText}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      {/* Header */}
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
              Theo dõi tình trạng khách hàng, tài khoản, giao dịch, hóa đơn,
              khoản vay, thẻ và các cảnh báo vận hành quan trọng trong ngày.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <CalendarDays className="h-4 w-4" />
              Hôm nay
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001936]">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Tổng khách hàng"
          value="12,842"
          change="+2.4%"
          trend="up"
          icon={Users}
          description="Khách hàng cá nhân và doanh nghiệp"
        />
        <StatCard
          title="Tài khoản hoạt động"
          value="45,108"
          change="+1.8%"
          trend="up"
          icon={Wallet}
          description="ACTIVE trên toàn hệ thống"
        />
        <StatCard
          title="Giao dịch hôm nay"
          value="3,492"
          change="Ổn định"
          trend="neutral"
          icon={Repeat2}
          description="Bao gồm chuyển tiền và thanh toán"
        />
        <StatCard
          title="Giá trị giao dịch"
          value="84.2B"
          change="+5.2%"
          trend="up"
          icon={CircleDollarSign}
          description="Tổng giá trị giao dịch trong ngày"
        />
        <StatCard
          title="Khoản vay hoạt động"
          value="1,250"
          change="-0.5%"
          trend="down"
          icon={Landmark}
          description="ACTIVE và OVERDUE cần theo dõi"
        />
        <StatCard
          title="Hóa đơn chưa thanh toán"
          value="412"
          change="Cần xử lý"
          trend="warning"
          icon={ReceiptText}
          description="UNPAID và OVERDUE"
        />
      </div>

      {/* Quick Actions */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Khối lượng giao dịch theo ngày
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Theo dõi số lượng giao dịch và giá trị giao dịch trong tháng
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
              HÀNG THÁNG
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionChartData}>
                <defs>
                  <linearGradient id="transactionVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002147" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#002147" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
                Tỷ trọng theo nhóm cá nhân, doanh nghiệp, ưu tiên và tổ chức
              </p>
            </div>

            <button className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSegmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-4">
        {/* Recent Transactions */}
        <div className="2xl:col-span-3 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h3 className="text-base font-bold text-slate-950">
                  Giao dịch gần đây
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Danh sách giao dịch mới nhất gồm chuyển tiền, thanh toán hóa đơn và trả khoản vay
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

                <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
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
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-[#002147]">
                      {txn.id}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002147] text-xs font-bold text-white">
                          {txn.initial}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {txn.customer}
                          </p>
                          <p className="text-xs text-slate-500">{txn.type}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-sm text-slate-700">
                      {txn.fromAccount}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm text-slate-700">
                      {txn.toAccount}
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-slate-950">
                      {txn.amount}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">{txn.fee}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transactionStatusIcon(txn.status)}
                        {statusBadge(txn.status)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">{txn.time}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50">
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

        {/* Right Alerts */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-slate-950">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Cảnh báo
              </h3>

              <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700">
                2 MỚI
              </span>
            </div>

            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <div
                  key={alert.title}
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
                      alert.level === 'high' ? 'text-red-800' : 'text-amber-800'
                    )}
                  >
                    {alert.title}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-xs',
                      alert.level === 'high' ? 'text-red-700' : 'text-amber-700'
                    )}
                  >
                    {alert.desc}
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
                    <p className="text-sm font-bold text-emerald-900">RLS hoạt động</p>
                    <p className="text-xs text-emerald-700">Customer chỉ xem dữ liệu của mình</p>
                  </div>
                </div>
                <BadgeCheck className="h-5 w-5 text-emerald-700" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-700" />
                  <div>
                    <p className="text-sm font-bold text-blue-900">RBAC đã bật</p>
                    <p className="text-xs text-blue-700">User được giới hạn theo role</p>
                  </div>
                </div>
                <BadgeCheck className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bills, Loans, Accounts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Hóa đơn chưa thanh toán"
            description="UNPAID và OVERDUE cần xử lý"
            actionText="Xem hóa đơn"
          />

          <div className="space-y-3">
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
                    <p className="font-semibold text-slate-800">{bill.dueDate}</p>
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
                    <p className="font-semibold text-slate-800">{loan.interestRate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Ngày kết thúc</p>
                    <p className="font-semibold text-slate-800">{loan.endDate}</p>
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
                    <p className="font-semibold text-slate-800">{account.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Số dư</p>
                    <p className="font-bold text-slate-950">{account.balance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Logs */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            title="Nhật ký hệ thống gần đây"
            description="Theo dõi các hành động quan trọng từ user, procedure, trigger và audit"
            actionText="Xem log"
          />

          <div className="space-y-4">
            {systemLogs.map((log, index) => (
              <div key={log.title} className="flex gap-4 rounded-2xl border border-slate-100 p-4">
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
                    <p className="text-sm font-bold text-slate-950">{log.title}</p>
                    <p className="font-mono text-xs text-slate-400">{log.time}</p>
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
                <p className="text-sm text-white/70">Giao dịch thành công</p>
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

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#002147] transition hover:bg-blue-50">
            <Building2 className="h-4 w-4" />
            Xem báo cáo vận hành
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#002147] text-white shadow-xl transition hover:scale-110 hover:bg-[#001936]">
        <Plus className="h-7 w-7" />
      </button>
    </div>
  );
}