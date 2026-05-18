import React, { useMemo, useState } from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  Download,
  Filter,
  Eye,
  Lock,
  Unlock,
  Send,
  Wallet,
  Users,
  Landmark,
  CreditCard,
  ReceiptText,
  History,
  FileText,
  Save,
  X,
  AlertTriangle,
  BadgeCheck,
  Calendar,
  ArrowRightLeft,
  CircleDollarSign,
  User,
  Settings,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'CLOSED';
type AccountType = 'Payment' | 'Saving' | 'Business' | 'Loan';
type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED' | 'CANCELLED';

type Account = {
  accountId: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  accountType: AccountType;
  balance: number;
  currency: 'VND' | 'USD' | 'EUR';
  status: AccountStatus;
  createdAt: string;
  perTransactionLimit: number;
  dailyTransferLimit: number;
  interestRate: number;
  transactions: Transaction[];
  balanceHistory: BalanceHistory[];
  fees: TransactionFee[];
  linkedCards: LinkedCard[];
};

type Transaction = {
  transactionId: string;
  fromAccount: string;
  toAccount: string;
  type: string;
  amount: number;
  fee: number;
  status: TransactionStatus;
  createdAt: string;
};

type BalanceHistory = {
  historyId: string;
  oldBalance: number;
  newBalance: number;
  changeReason: string;
  validFrom: string;
  validTo: string;
};

type TransactionFee = {
  feeId: string;
  transactionId: string;
  feeAmount: number;
  feeType: string;
  createdAt: string;
};

type LinkedCard = {
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  status: string;
};

const customers = [
  { customerId: 'CUS-0001', fullName: 'Nguyễn Văn Hoàng', phone: '0912345678' },
  { customerId: 'CUS-0002', fullName: 'Trần Thị Lan', phone: '0988776554' },
  { customerId: 'CUS-0003', fullName: 'Phạm Anh Tuấn', phone: '0903445566' },
  { customerId: 'CUS-0004', fullName: 'Lê Minh', phone: '0332111222' },
];

const initialAccounts: Account[] = [
  {
    accountId: 'ACC-0001',
    accountNumber: '1000000001',
    customerId: 'CUS-0001',
    customerName: 'Nguyễn Văn Hoàng',
    customerPhone: '0912345678',
    accountType: 'Saving',
    balance: 245000000,
    currency: 'VND',
    status: 'ACTIVE',
    createdAt: '2021-01-16',
    perTransactionLimit: 50000000,
    dailyTransferLimit: 200000000,
    interestRate: 5.2,
    transactions: [
      {
        transactionId: 'TXN-49021',
        fromAccount: '1000000001',
        toAccount: '1000000002',
        type: 'INTERNAL_TRANSFER',
        amount: 25000000,
        fee: 2000,
        status: 'COMPLETED',
        createdAt: '2023-10-24 14:20',
      },
      {
        transactionId: 'TXN-49018',
        fromAccount: 'SYSTEM',
        toAccount: '1000000001',
        type: 'INTEREST',
        amount: 120000,
        fee: 0,
        status: 'COMPLETED',
        createdAt: '2023-10-23 00:01',
      },
    ],
    balanceHistory: [
      {
        historyId: 'HIS-001',
        oldBalance: 220000000,
        newBalance: 245000000,
        changeReason: 'TRANSFER_IN',
        validFrom: '2023-10-24 14:20',
        validTo: 'CURRENT',
      },
      {
        historyId: 'HIS-002',
        oldBalance: 219880000,
        newBalance: 220000000,
        changeReason: 'DAILY_INTEREST',
        validFrom: '2023-10-23 00:01',
        validTo: '2023-10-24 14:20',
      },
    ],
    fees: [
      {
        feeId: 'FEE-001',
        transactionId: 'TXN-49021',
        feeAmount: 2000,
        feeType: 'INTERNAL_TRANSFER_FEE',
        createdAt: '2023-10-24 14:20',
      },
    ],
    linkedCards: [
      {
        cardNumber: '**** **** **** 1234',
        cardType: 'DEBIT',
        expiryDate: '12/2028',
        status: 'ACTIVE',
      },
    ],
  },
  {
    accountId: 'ACC-0002',
    accountNumber: '1000000002',
    customerId: 'CUS-0001',
    customerName: 'Nguyễn Văn Hoàng',
    customerPhone: '0912345678',
    accountType: 'Payment',
    balance: 38500000,
    currency: 'VND',
    status: 'ACTIVE',
    createdAt: '2021-02-20',
    perTransactionLimit: 30000000,
    dailyTransferLimit: 100000000,
    interestRate: 0,
    transactions: [
      {
        transactionId: 'TXN-49021',
        fromAccount: '1000000001',
        toAccount: '1000000002',
        type: 'INTERNAL_TRANSFER',
        amount: 25000000,
        fee: 0,
        status: 'COMPLETED',
        createdAt: '2023-10-24 14:20',
      },
    ],
    balanceHistory: [
      {
        historyId: 'HIS-003',
        oldBalance: 13500000,
        newBalance: 38500000,
        changeReason: 'TRANSFER_IN',
        validFrom: '2023-10-24 14:20',
        validTo: 'CURRENT',
      },
    ],
    fees: [],
    linkedCards: [
      {
        cardNumber: '**** **** **** 5522',
        cardType: 'ATM',
        expiryDate: '08/2027',
        status: 'ACTIVE',
      },
    ],
  },
  {
    accountId: 'ACC-0003',
    accountNumber: '1000000010',
    customerId: 'CUS-0002',
    customerName: 'Trần Thị Lan',
    customerPhone: '0988776554',
    accountType: 'Payment',
    balance: 72300000,
    currency: 'VND',
    status: 'ACTIVE',
    createdAt: '2023-03-03',
    perTransactionLimit: 40000000,
    dailyTransferLimit: 120000000,
    interestRate: 0,
    transactions: [
      {
        transactionId: 'TXN-49022',
        fromAccount: '1000000010',
        toAccount: 'EVN',
        type: 'BILL_PAYMENT',
        amount: 320000,
        fee: 0,
        status: 'PENDING',
        createdAt: '2023-10-24 14:15',
      },
    ],
    balanceHistory: [
      {
        historyId: 'HIS-004',
        oldBalance: 72620000,
        newBalance: 72300000,
        changeReason: 'BILL_PAYMENT_PENDING',
        validFrom: '2023-10-24 14:15',
        validTo: 'CURRENT',
      },
    ],
    fees: [],
    linkedCards: [
      {
        cardNumber: '**** **** **** 7788',
        cardType: 'ATM',
        expiryDate: '08/2027',
        status: 'ACTIVE',
      },
    ],
  },
  {
    accountId: 'ACC-0004',
    accountNumber: '1000000021',
    customerId: 'CUS-0003',
    customerName: 'Phạm Anh Tuấn',
    customerPhone: '0903445566',
    accountType: 'Business',
    balance: 0,
    currency: 'VND',
    status: 'LOCKED',
    createdAt: '2019-11-20',
    perTransactionLimit: 100000000,
    dailyTransferLimit: 500000000,
    interestRate: 0,
    transactions: [
      {
        transactionId: 'TXN-49023',
        fromAccount: '1000000021',
        toAccount: '1000000034',
        type: 'INTERNAL_TRANSFER',
        amount: 2300000,
        fee: 2000,
        status: 'FAILED',
        createdAt: '2023-10-24 13:58',
      },
    ],
    balanceHistory: [
      {
        historyId: 'HIS-005',
        oldBalance: 2300000,
        newBalance: 0,
        changeReason: 'ACCOUNT_LOCKED',
        validFrom: '2023-10-24 13:58',
        validTo: 'CURRENT',
      },
    ],
    fees: [
      {
        feeId: 'FEE-002',
        transactionId: 'TXN-49023',
        feeAmount: 2000,
        feeType: 'INTERNAL_TRANSFER_FEE',
        createdAt: '2023-10-24 13:58',
      },
    ],
    linkedCards: [],
  },
];

const tabs = [
  { id: 'overview', label: 'Tổng quan', icon: Wallet },
  { id: 'transactions', label: 'Giao dịch', icon: ArrowRightLeft },
  { id: 'history', label: 'Biến động số dư', icon: History },
  { id: 'fees', label: 'Phí', icon: ReceiptText },
  { id: 'cards', label: 'Thẻ liên kết', icon: CreditCard },
];

function formatMoney(value: number, currency = 'VND') {
  return `${new Intl.NumberFormat('vi-VN').format(value)} ${currency}`;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE: 'bg-slate-50 text-slate-600 border-slate-200',
    LOCKED: 'bg-red-50 text-red-700 border-red-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    REVERSED: 'bg-purple-50 text-purple-700 border-purple-200',
    CANCELLED: 'bg-slate-50 text-slate-600 border-slate-200',
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

function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </div>
      <p className="text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-semibold text-slate-500">{text}</p>
    </div>
  );
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | AccountType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountStatus>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'balance'>('createdAt');

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isOpenAccountModalOpen, setIsOpenAccountModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmLockOpen, setIsConfirmLockOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [form, setForm] = useState({
    customerId: '',
    accountType: 'Payment' as AccountType,
    accountNumber: '',
    initialBalance: '',
    currency: 'VND' as 'VND' | 'USD' | 'EUR',
    status: 'ACTIVE' as AccountStatus,
    perTransactionLimit: '50000000',
    dailyTransferLimit: '200000000',
    interestRate: '0',
  });

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((account) => {
        const keyword = searchTerm.trim().toLowerCase();

        const matchSearch =
          account.accountNumber.toLowerCase().includes(keyword) ||
          account.customerName.toLowerCase().includes(keyword) ||
          account.customerPhone.includes(keyword) ||
          account.accountId.toLowerCase().includes(keyword);

        const matchType = typeFilter === 'ALL' || account.accountType === typeFilter;
        const matchStatus = statusFilter === 'ALL' || account.status === statusFilter;

        return matchSearch && matchType && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'balance') {
          return b.balance - a.balance;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [accounts, searchTerm, typeFilter, statusFilter, sortBy]);

  const summary = useMemo(() => {
    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((item) => item.status === 'ACTIVE').length,
      lockedAccounts: accounts.filter((item) => item.status === 'LOCKED').length,
      totalBalance: accounts.reduce((sum, item) => sum + item.balance, 0),
    };
  }, [accounts]);

  const generateAccountNumber = () => {
    const random = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    setForm((prev) => ({ ...prev, accountNumber: random }));
  };

  const openAccountDetail = (account: Account) => {
    setSelectedAccount(account);
    setActiveTab('overview');
    setIsDetailOpen(true);
  };

  const openCreateAccount = () => {
    setForm({
      customerId: '',
      accountType: 'Payment',
      accountNumber: '',
      initialBalance: '',
      currency: 'VND',
      status: 'ACTIVE',
      perTransactionLimit: '50000000',
      dailyTransferLimit: '200000000',
      interestRate: '0',
    });
    setIsOpenAccountModalOpen(true);
  };

  const submitOpenAccount = () => {
    if (!form.customerId || !form.accountType || !form.accountNumber || form.initialBalance === '') {
      alert('Vui lòng nhập đầy đủ khách hàng, loại tài khoản, số tài khoản và số dư ban đầu.');
      return;
    }

    const selectedCustomer = customers.find((customer) => customer.customerId === form.customerId);

    if (!selectedCustomer) {
      alert('Khách hàng không tồn tại.');
      return;
    }

    const isDuplicateAccountNumber = accounts.some(
      (account) => account.accountNumber === form.accountNumber
    );

    if (isDuplicateAccountNumber) {
      alert('Số tài khoản đã tồn tại.');
      return;
    }

    const initialBalance = Number(form.initialBalance);
    const perTransactionLimit = Number(form.perTransactionLimit);
    const dailyTransferLimit = Number(form.dailyTransferLimit);
    const interestRate = Number(form.interestRate);

    if (Number.isNaN(initialBalance) || initialBalance < 0) {
      alert('Số dư ban đầu phải lớn hơn hoặc bằng 0.');
      return;
    }

    if (Number.isNaN(perTransactionLimit) || perTransactionLimit < 0) {
      alert('Hạn mức mỗi giao dịch phải lớn hơn hoặc bằng 0.');
      return;
    }

    if (Number.isNaN(dailyTransferLimit) || dailyTransferLimit < 0) {
      alert('Hạn mức ngày phải lớn hơn hoặc bằng 0.');
      return;
    }

    if (Number.isNaN(interestRate) || interestRate < 0) {
      alert('Lãi suất phải lớn hơn hoặc bằng 0.');
      return;
    }

    const newAccount: Account = {
      accountId: `ACC-${String(accounts.length + 1).padStart(4, '0')}`,
      accountNumber: form.accountNumber,
      customerId: selectedCustomer.customerId,
      customerName: selectedCustomer.fullName,
      customerPhone: selectedCustomer.phone,
      accountType: form.accountType,
      balance: initialBalance,
      currency: form.currency,
      status: form.status,
      createdAt: new Date().toISOString().slice(0, 10),
      perTransactionLimit,
      dailyTransferLimit,
      interestRate,
      transactions: [],
      balanceHistory: [
        {
          historyId: `HIS-${String(Date.now()).slice(-5)}`,
          oldBalance: 0,
          newBalance: initialBalance,
          changeReason: 'ACCOUNT_OPENED',
          validFrom: new Date().toISOString().slice(0, 16).replace('T', ' '),
          validTo: 'CURRENT',
        },
      ],
      fees: [],
      linkedCards: [],
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setIsOpenAccountModalOpen(false);
  };

  const toggleAccountLock = () => {
    if (!selectedAccount) return;

    const nextStatus: AccountStatus =
      selectedAccount.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';

    setAccounts((prev) =>
      prev.map((account) =>
        account.accountId === selectedAccount.accountId
          ? { ...account, status: nextStatus }
          : account
      )
    );

    setSelectedAccount({ ...selectedAccount, status: nextStatus });
    setIsConfirmLockOpen(false);
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Hệ thống</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#002147]">Quản lý tài khoản</span>
            </nav>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Account Management
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Quản lý danh sách tài khoản, mở tài khoản mới, xem chi tiết tài
              khoản, giao dịch, biến động số dư, phí giao dịch và thẻ liên kết.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Xuất danh sách
            </button>

            <button
              onClick={openCreateAccount}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001936]"
            >
              <Plus className="h-4 w-4" />
              Mở tài khoản
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
              TOTAL
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tổng tài khoản
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {summary.totalAccounts}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
              ACTIVE
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Đang hoạt động
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {summary.activeAccounts}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-red-50 p-3 text-red-700">
              <Lock className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-red-50 px-2 py-1 text-[11px] font-bold text-red-700">
              LOCKED
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tài khoản bị khóa
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {summary.lockedAccounts}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-purple-50 px-2 py-1 text-[11px] font-bold text-purple-700">
              BALANCE
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tổng số dư
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {formatMoney(summary.totalBalance)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo số tài khoản, tên khách hàng, SĐT..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#002147]"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as 'ALL' | AccountType)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="ALL">Tất cả loại tài khoản</option>
                <option value="Payment">Payment</option>
                <option value="Saving">Saving</option>
                <option value="Business">Business</option>
                <option value="Loan">Loan</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as 'ALL' | AccountStatus)
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="LOCKED">LOCKED</option>
                <option value="CLOSED">CLOSED</option>
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'createdAt' | 'balance')}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="createdAt">Sắp xếp theo ngày tạo</option>
                <option value="balance">Sắp xếp theo số dư</option>
              </select>

              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                Lọc nâng cao
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Số tài khoản
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Loại tài khoản
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Số dư
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Hạn mức/lần
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((account) => (
                <tr key={account.accountId} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-mono text-sm font-bold text-[#002147]">
                        {account.accountNumber}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {account.accountId}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#002147] text-xs font-bold text-white">
                        {getInitials(account.customerName)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-950">
                          {account.customerName}
                        </p>
                        <p className="text-xs text-slate-500">{account.customerPhone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {account.accountType}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <p
                      className={cn(
                        'text-sm font-bold',
                        account.balance < 0 ? 'text-red-700' : 'text-slate-950'
                      )}
                    >
                      {formatMoney(account.balance, account.currency)}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {formatMoney(account.perTransactionLimit, account.currency)}
                  </td>

                  <td className="px-6 py-4">{statusBadge(account.status)}</td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {account.createdAt}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openAccountDetail(account)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                        title="Chuyển tiền"
                      >
                        <Send className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsConfirmLockOpen(true);
                        }}
                        className={cn(
                          'rounded-lg border p-2 transition',
                          account.status === 'LOCKED'
                            ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            : 'border-red-200 text-red-700 hover:bg-red-50'
                        )}
                        title={account.status === 'LOCKED' ? 'Mở khóa' : 'Khóa'}
                      >
                        {account.status === 'LOCKED' ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12">
                    <EmptyState text="Không tìm thấy tài khoản phù hợp với điều kiện tìm kiếm." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 md:flex-row md:items-center">
          <p className="text-xs font-semibold text-slate-500">
            Hiển thị {filteredAccounts.length} / {accounts.length} tài khoản
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-[#002147] px-3 py-1.5 text-xs font-bold text-white">
              1
            </span>
            <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpenAccountModalOpen}
        onClose={() => setIsOpenAccountModalOpen(false)}
        title="Mở tài khoản ngân hàng"
        maxWidth="2xl"
      >
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-bold">Quy tắc mở tài khoản</p>
            <p className="mt-1">
              Customer, account type, account number và balance là bắt buộc.
              Account number không được trùng. Balance, hạn mức và lãi suất
              phải lớn hơn hoặc bằng 0.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Chọn khách hàng *
              </label>
              <select
                value={form.customerId}
                onChange={(event) => setForm({ ...form, customerId: event.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.customerId} - {customer.fullName} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Loại tài khoản *
              </label>
              <select
                value={form.accountType}
                onChange={(event) =>
                  setForm({ ...form, accountType: event.target.value as AccountType })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="Payment">Payment</option>
                <option value="Saving">Saving</option>
                <option value="Business">Business</option>
                <option value="Loan">Loan</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Tiền tệ
              </label>
              <select
                value={form.currency}
                onChange={(event) =>
                  setForm({ ...form, currency: event.target.value as 'VND' | 'USD' | 'EUR' })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Số tài khoản *
              </label>
              <div className="flex gap-3">
                <input
                  value={form.accountNumber}
                  onChange={(event) =>
                    setForm({ ...form, accountNumber: event.target.value })
                  }
                  className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
                  placeholder="Ví dụ: 1000000001"
                />
                <button
                  type="button"
                  onClick={generateAccountNumber}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Số dư ban đầu *
              </label>
              <input
                type="number"
                min="0"
                value={form.initialBalance}
                onChange={(event) =>
                  setForm({ ...form, initialBalance: event.target.value })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Trạng thái
              </label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as AccountStatus })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="LOCKED">LOCKED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Hạn mức mỗi giao dịch
              </label>
              <input
                type="number"
                min="0"
                value={form.perTransactionLimit}
                onChange={(event) =>
                  setForm({ ...form, perTransactionLimit: event.target.value })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Hạn mức ngày
              </label>
              <input
                type="number"
                min="0"
                value={form.dailyTransferLimit}
                onChange={(event) =>
                  setForm({ ...form, dailyTransferLimit: event.target.value })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Lãi suất %
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.interestRate}
                onChange={(event) =>
                  setForm({ ...form, interestRate: event.target.value })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={() => setIsOpenAccountModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              onClick={submitOpenAccount}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001936]"
            >
              <Save className="h-4 w-4" />
              Tạo tài khoản
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Chi tiết tài khoản"
        maxWidth="2xl"
      >
        {selectedAccount && (
          <div className="bg-slate-50">
            <div className="border-b border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {statusBadge(selectedAccount.status)}
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {selectedAccount.accountType}
                    </span>
                  </div>

                  <h3 className="font-mono text-2xl font-bold text-[#002147]">
                    {selectedAccount.accountNumber}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Chủ tài khoản:{' '}
                    <span className="font-bold text-slate-900">
                      {selectedAccount.customerName}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Send className="h-4 w-4" />
                    Chuyển tiền
                  </button>

                  <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Copy className="h-4 w-4" />
                    Copy STK
                  </button>

                  <button
                    onClick={() => setIsConfirmLockOpen(true)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                      selectedAccount.status === 'LOCKED'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    )}
                  >
                    {selectedAccount.status === 'LOCKED' ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    {selectedAccount.status === 'LOCKED' ? 'Mở khóa' : 'Khóa tài khoản'}
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#002147] p-5 text-white">
                  <p className="text-xs font-bold uppercase text-white/60">
                    Số dư hiện tại
                  </p>
                  <p className="mt-2 text-3xl font-bold">
                    {formatMoney(selectedAccount.balance, selectedAccount.currency)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Hạn mức mỗi giao dịch
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {formatMoney(selectedAccount.perTransactionLimit, selectedAccount.currency)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">
                    Hạn mức ngày
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-950">
                    {formatMoney(selectedAccount.dailyTransferLimit, selectedAccount.currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold transition',
                      activeTab === tab.id
                        ? 'border-[#002147] text-[#002147]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Account ID" value={selectedAccount.accountId} icon={Settings} />
                  <Field label="Số tài khoản" value={selectedAccount.accountNumber} icon={Wallet} />
                  <Field label="Chủ tài khoản" value={selectedAccount.customerName} icon={User} />
                  <Field label="Số điện thoại" value={selectedAccount.customerPhone} icon={Users} />
                  <Field label="Loại tài khoản" value={selectedAccount.accountType} icon={Landmark} />
                  <Field label="Trạng thái" value={selectedAccount.status} icon={BadgeCheck} />
                  <Field label="Ngày tạo" value={selectedAccount.createdAt} icon={Calendar} />
                  <Field label="Lãi suất" value={`${selectedAccount.interestRate}%`} icon={CircleDollarSign} />
                  <Field label="Tiền tệ" value={selectedAccount.currency} />
                </div>
              )}

              {activeTab === 'transactions' && (
                selectedAccount.transactions.length ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full min-w-[850px] text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Mã giao dịch</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Từ TK</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Đến TK</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Loại</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Số tiền</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Phí</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Trạng thái</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedAccount.transactions.map((transaction) => (
                          <tr key={transaction.transactionId}>
                            <td className="px-4 py-3 font-mono text-sm font-bold text-[#002147]">{transaction.transactionId}</td>
                            <td className="px-4 py-3 font-mono text-sm">{transaction.fromAccount}</td>
                            <td className="px-4 py-3 font-mono text-sm">{transaction.toAccount}</td>
                            <td className="px-4 py-3 text-sm">{transaction.type}</td>
                            <td className="px-4 py-3 text-sm font-bold">{formatMoney(transaction.amount)}</td>
                            <td className="px-4 py-3 text-sm">{formatMoney(transaction.fee)}</td>
                            <td className="px-4 py-3">{statusBadge(transaction.status)}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{transaction.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState text="Tài khoản chưa có giao dịch." />
                )
              )}

              {activeTab === 'history' && (
                selectedAccount.balanceHistory.length ? (
                  <div className="space-y-4">
                    {selectedAccount.balanceHistory.map((item, index) => (
                      <div key={item.historyId} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#002147] text-white">
                            <History className="h-4 w-4" />
                          </div>
                          {index !== selectedAccount.balanceHistory.length - 1 && (
                            <div className="mt-2 h-full w-px flex-1 bg-slate-200" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                            <div>
                              <p className="font-bold text-slate-950">{item.changeReason}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {item.validFrom} → {item.validTo}
                              </p>
                            </div>
                            <span className="font-mono text-xs font-bold text-slate-400">
                              {item.historyId}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                            <Field label="Số dư cũ" value={formatMoney(item.oldBalance)} />
                            <Field label="Số dư mới" value={formatMoney(item.newBalance)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Chưa có lịch sử biến động số dư." />
                )
              )}

              {activeTab === 'fees' && (
                selectedAccount.fees.length ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full min-w-[720px] text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Fee ID</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Mã giao dịch</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Loại phí</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Số tiền phí</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedAccount.fees.map((fee) => (
                          <tr key={fee.feeId}>
                            <td className="px-4 py-3 font-mono text-sm font-bold text-[#002147]">{fee.feeId}</td>
                            <td className="px-4 py-3 font-mono text-sm">{fee.transactionId}</td>
                            <td className="px-4 py-3 text-sm">{fee.feeType}</td>
                            <td className="px-4 py-3 text-sm font-bold">{formatMoney(fee.feeAmount)}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{fee.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState text="Tài khoản chưa phát sinh phí giao dịch." />
                )
              )}

              {activeTab === 'cards' && (
                selectedAccount.linkedCards.length ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {selectedAccount.linkedCards.map((card) => (
                      <div key={card.cardNumber} className="rounded-3xl bg-[#002147] p-6 text-white shadow-sm">
                        <div className="mb-8 flex items-center justify-between">
                          <CreditCard className="h-7 w-7" />
                          {statusBadge(card.status)}
                        </div>

                        <p className="font-mono text-xl font-bold tracking-widest">
                          {card.cardNumber}
                        </p>

                        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-white/60">Loại</p>
                            <p className="font-bold">{card.cardType}</p>
                          </div>
                          <div>
                            <p className="text-white/60">Hết hạn</p>
                            <p className="font-bold">{card.expiryDate}</p>
                          </div>
                          <div>
                            <p className="text-white/60">Tài khoản</p>
                            <p className="font-bold">{selectedAccount.accountNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Tài khoản chưa có thẻ liên kết." />
                )
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isConfirmLockOpen}
        onClose={() => setIsConfirmLockOpen(false)}
        title="Xác nhận thay đổi trạng thái tài khoản"
        maxWidth="md"
      >
        <div className="p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
              <div>
                <p className="font-bold text-amber-900">
                  {selectedAccount?.status === 'LOCKED'
                    ? 'Mở khóa tài khoản?'
                    : 'Khóa tài khoản?'}
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  Thao tác này sẽ thay đổi trạng thái tài khoản{' '}
                  <strong>{selectedAccount?.accountNumber}</strong> của khách hàng{' '}
                  <strong>{selectedAccount?.customerName}</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setIsConfirmLockOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Hủy
            </button>

            <button
              onClick={toggleAccountLock}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001936]"
            >
              {selectedAccount?.status === 'LOCKED' ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
