import React, { useMemo, useState } from 'react';
import {
  ArrowRightLeft,
  BadgeCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Printer,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  X,
  XCircle,
  Clock3,
} from 'lucide-react';
import { cn } from '../lib/utils';

type TransactionStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED'
  | 'CANCELLED';

type TransactionType =
  | 'INTERNAL_TRANSFER'
  | 'BILL_PAYMENT'
  | 'LOAN_PAYMENT'
  | 'INTEREST'
  | 'REVERSAL';

type Transaction = {
  transactionId: string;
  fromAccount: string;
  toAccount: string;
  senderName: string;
  receiverName: string;
  type: TransactionType;
  amount: number;
  fee: number;
  status: TransactionStatus;
  createdAt: string;
  performedBy: string;
  note: string;
  logs: {
    action: string;
    performedBy: string;
    createdAt: string;
  }[];
};

const initialTransactions: Transaction[] = [
  {
    transactionId: 'TXN-49021',
    fromAccount: '1000000001',
    toAccount: '1000000002',
    senderName: 'Nguyễn Văn Hoàng',
    receiverName: 'Trần Thị Lan',
    type: 'INTERNAL_TRANSFER',
    amount: 25000000,
    fee: 2000,
    status: 'COMPLETED',
    createdAt: '2023-10-24 14:20',
    performedBy: 'CUSTOMER: CUS-0001',
    note: 'Chuyển tiền nội bộ',
    logs: [
      {
        action: 'TRANSFER_CREATED',
        performedBy: 'CUS-0001',
        createdAt: '2023-10-24 14:20',
      },
      {
        action: 'BALANCE_UPDATED',
        performedBy: 'SYSTEM',
        createdAt: '2023-10-24 14:20',
      },
      {
        action: 'TRANSACTION_COMPLETED',
        performedBy: 'SYSTEM',
        createdAt: '2023-10-24 14:20',
      },
    ],
  },
  {
    transactionId: 'TXN-49022',
    fromAccount: '1000000010',
    toAccount: 'EVN-BILL-1022',
    senderName: 'Trần Thị Lan',
    receiverName: 'EVN',
    type: 'BILL_PAYMENT',
    amount: 320000,
    fee: 0,
    status: 'PENDING',
    createdAt: '2023-10-24 14:15',
    performedBy: 'CUSTOMER: CUS-0002',
    note: 'Thanh toán hóa đơn điện',
    logs: [
      {
        action: 'PAYMENT_CREATED',
        performedBy: 'CUS-0002',
        createdAt: '2023-10-24 14:15',
      },
    ],
  },
  {
    transactionId: 'TXN-49023',
    fromAccount: '1000000021',
    toAccount: '1000000034',
    senderName: 'Phạm Anh Tuấn',
    receiverName: 'Lê Minh',
    type: 'INTERNAL_TRANSFER',
    amount: 2300000,
    fee: 2000,
    status: 'FAILED',
    createdAt: '2023-10-24 13:58',
    performedBy: 'CUSTOMER: CUS-0003',
    note: 'Không đủ số dư khả dụng',
    logs: [
      {
        action: 'TRANSFER_CREATED',
        performedBy: 'CUS-0003',
        createdAt: '2023-10-24 13:58',
      },
      {
        action: 'VALIDATION_FAILED_INSUFFICIENT_BALANCE',
        performedBy: 'SYSTEM',
        createdAt: '2023-10-24 13:58',
      },
    ],
  },
  {
    transactionId: 'TXN-49024',
    fromAccount: '1000000045',
    toAccount: 'LOAN-3001',
    senderName: 'Công ty Minh Long',
    receiverName: 'Enterprise Bank',
    type: 'LOAN_PAYMENT',
    amount: 85000000,
    fee: 0,
    status: 'COMPLETED',
    createdAt: '2023-10-24 13:45',
    performedBy: 'EMPLOYEE: EMP-0009',
    note: 'Thanh toán khoản vay',
    logs: [
      {
        action: 'LOAN_PAYMENT_CREATED',
        performedBy: 'EMP-0009',
        createdAt: '2023-10-24 13:45',
      },
      {
        action: 'TRANSACTION_COMPLETED',
        performedBy: 'SYSTEM',
        createdAt: '2023-10-24 13:45',
      },
    ],
  },
  {
    transactionId: 'TXN-49025',
    fromAccount: '1000000091',
    toAccount: '1000000095',
    senderName: 'Phạm Gia Hân',
    receiverName: 'Nguyễn Nhật Nam',
    type: 'REVERSAL',
    amount: 5000000,
    fee: 0,
    status: 'REVERSED',
    createdAt: '2023-10-24 13:22',
    performedBy: 'ADMIN: ADM-0001',
    note: 'Hoàn tiền giao dịch nhầm',
    logs: [
      {
        action: 'REVERSAL_REQUESTED',
        performedBy: 'ADM-0001',
        createdAt: '2023-10-24 13:20',
      },
      {
        action: 'TRANSACTION_REVERSED',
        performedBy: 'SYSTEM',
        createdAt: '2023-10-24 13:22',
      },
    ],
  },
];

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
}

function statusBadge(status: TransactionStatus) {
  const styles: Record<TransactionStatus, string> = {
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
        styles[status]
      )}
    >
      {status}
    </span>
  );
}

function statusIcon(status: TransactionStatus) {
  if (status === 'COMPLETED') return <BadgeCheck className="h-4 w-4 text-emerald-600" />;
  if (status === 'PENDING') return <Clock3 className="h-4 w-4 text-yellow-600" />;
  if (status === 'FAILED') return <XCircle className="h-4 w-4 text-red-600" />;
  if (status === 'REVERSED') return <RotateCcw className="h-4 w-4 text-purple-600" />;
  return <XCircle className="h-4 w-4 text-slate-500" />;
}

function Modal({
  open,
  title,
  children,
  onClose,
  maxWidth = 'max-w-5xl',
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className={cn('max-h-[90vh] w-full overflow-hidden rounded-3xl bg-white shadow-2xl', maxWidth)}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-73px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TransactionStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [reverseOpen, setReverseOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const keyword = searchTerm.trim().toLowerCase();

      const matchSearch =
        item.transactionId.toLowerCase().includes(keyword) ||
        item.fromAccount.includes(keyword) ||
        item.toAccount.includes(keyword) ||
        item.senderName.toLowerCase().includes(keyword) ||
        item.receiverName.toLowerCase().includes(keyword);

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchType = typeFilter === 'ALL' || item.type === typeFilter;
      const matchMin = !minAmount || item.amount >= Number(minAmount);
      const matchMax = !maxAmount || item.amount <= Number(maxAmount);
      const dateOnly = item.createdAt.slice(0, 10);
      const matchFromDate = !fromDate || dateOnly >= fromDate;
      const matchToDate = !toDate || dateOnly <= toDate;

      return (
        matchSearch &&
        matchStatus &&
        matchType &&
        matchMin &&
        matchMax &&
        matchFromDate &&
        matchToDate
      );
    });
  }, [transactions, searchTerm, statusFilter, typeFilter, fromDate, toDate, minAmount, maxAmount]);

  const summary = useMemo(() => {
    return {
      total: transactions.length,
      completed: transactions.filter((item) => item.status === 'COMPLETED').length,
      pending: transactions.filter((item) => item.status === 'PENDING').length,
      failed: transactions.filter((item) => item.status === 'FAILED').length,
      totalAmount: transactions
        .filter((item) => item.status === 'COMPLETED')
        .reduce((sum, item) => sum + item.amount, 0),
    };
  }, [transactions]);

  const openDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailOpen(true);
  };

  const openReverse = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReverseOpen(true);
  };

  const reverseTransaction = () => {
    if (!selectedTransaction) return;

    setTransactions((prev) =>
      prev.map((item) =>
        item.transactionId === selectedTransaction.transactionId
          ? {
            ...item,
            status: 'REVERSED',
            logs: [
              ...item.logs,
              {
                action: 'REVERSAL_REQUESTED',
                performedBy: 'ADMIN: ADM-0001',
                createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              },
              {
                action: 'TRANSACTION_REVERSED',
                performedBy: 'SYSTEM',
                createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
              },
            ],
          }
          : item
      )
    );

    setReverseOpen(false);
    setDetailOpen(false);
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Transfers</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#002147]">Transaction History</span>
            </nav>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Lịch sử giao dịch
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Tra cứu giao dịch, xem chi tiết, biên lai, trạng thái xử lý, log nghiệp vụ và lọc các giao dịch FAILED / CANCELLED / REVERSED để đối soát.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001936]">
              <Download className="h-4 w-4" />
              Xuất CSV/PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ReceiptText className="mb-4 h-6 w-6 text-[#002147]" />
          <p className="text-xs font-bold uppercase text-slate-500">Tổng giao dịch</p>
          <p className="mt-2 text-3xl font-bold">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <BadgeCheck className="mb-4 h-6 w-6 text-emerald-600" />
          <p className="text-xs font-bold uppercase text-slate-500">Hoàn tất</p>
          <p className="mt-2 text-3xl font-bold">{summary.completed}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Clock3 className="mb-4 h-6 w-6 text-yellow-600" />
          <p className="text-xs font-bold uppercase text-slate-500">Đang chờ</p>
          <p className="mt-2 text-3xl font-bold">{summary.pending}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <XCircle className="mb-4 h-6 w-6 text-red-600" />
          <p className="text-xs font-bold uppercase text-slate-500">Thất bại</p>
          <p className="mt-2 text-3xl font-bold">{summary.failed}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <ArrowRightLeft className="mb-4 h-6 w-6 text-purple-600" />
          <p className="text-xs font-bold uppercase text-slate-500">Tổng tiền COMPLETED</p>
          <p className="mt-2 text-2xl font-bold">{formatMoney(summary.totalAmount)}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 p-4">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
            <div className="relative xl:col-span-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm mã giao dịch, số tài khoản, tên người gửi/nhận..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as 'ALL' | TransactionType)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#002147] xl:col-span-2"
            >
              <option value="ALL">Tất cả loại GD</option>
              <option value="INTERNAL_TRANSFER">INTERNAL_TRANSFER</option>
              <option value="BILL_PAYMENT">BILL_PAYMENT</option>
              <option value="LOAN_PAYMENT">LOAN_PAYMENT</option>
              <option value="INTEREST">INTEREST</option>
              <option value="REVERSAL">REVERSAL</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'ALL' | TransactionStatus)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#002147] xl:col-span-2"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
              <option value="REVERSED">REVERSED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#002147] xl:col-span-2"
            />

            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#002147] xl:col-span-2"
            />

            <input
              type="number"
              value={minAmount}
              onChange={(event) => setMinAmount(event.target.value)}
              placeholder="Số tiền từ"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#002147] xl:col-span-2"
            />

            <input
              type="number"
              value={maxAmount}
              onChange={(event) => setMaxAmount(event.target.value)}
              placeholder="Số tiền đến"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-[#002147] xl:col-span-2"
            />

            <button
              onClick={() => setStatusFilter('FAILED')}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-700 hover:bg-red-100 xl:col-span-2"
            >
              <ShieldAlert className="h-4 w-4" />
              Giao dịch lỗi
            </button>

            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 xl:col-span-2">
              <Filter className="h-4 w-4" />
              Lọc nâng cao
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Mã GD</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Người gửi</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Người nhận</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Loại</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Số tiền</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Phí</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Thời gian</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((item) => (
                <tr key={item.transactionId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-[#002147]">
                    {item.transactionId}
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-950">{item.senderName}</p>
                    <p className="font-mono text-xs text-slate-500">{item.fromAccount}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-950">{item.receiverName}</p>
                    <p className="font-mono text-xs text-slate-500">{item.toAccount}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {item.type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-950">
                    {formatMoney(item.amount)}
                  </td>

                  <td className="px-6 py-4 text-right text-sm text-slate-600">
                    {formatMoney(item.fee)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      {statusBadge(item.status)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">{item.createdAt}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openDetail(item)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => openDetail(item)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                        title="Biên lai"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      {item.status === 'COMPLETED' && (
                        <button
                          onClick={() => openReverse(item)}
                          className="rounded-lg border border-purple-200 p-2 text-purple-700 hover:bg-purple-50"
                          title="Hoàn tiền"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm font-semibold text-slate-500">
                    Không tìm thấy giao dịch phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 md:flex-row md:items-center">
          <p className="text-xs font-semibold text-slate-500">
            Hiển thị {filteredTransactions.length} / {transactions.length} giao dịch
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="rounded-lg bg-[#002147] px-3 py-1.5 text-xs font-bold text-white">1</span>
            <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Chi tiết giao dịch & Biên lai"
      >
        {selectedTransaction && (
          <div className="space-y-6 bg-slate-50 p-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    {statusIcon(selectedTransaction.status)}
                    {statusBadge(selectedTransaction.status)}
                  </div>

                  <h3 className="font-mono text-2xl font-bold text-[#002147]">
                    {selectedTransaction.transactionId}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">{selectedTransaction.note}</p>
                </div>

                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    <Printer className="h-4 w-4" />
                    In
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#001936]">
                    <Download className="h-4 w-4" />
                    Tải PDF
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#002147] p-5 text-white">
                  <p className="text-xs font-bold uppercase text-white/60">Số tiền</p>
                  <p className="mt-2 text-2xl font-bold">
                    {formatMoney(selectedTransaction.amount)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">Phí</p>
                  <p className="mt-2 text-xl font-bold">{formatMoney(selectedTransaction.fee)}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">Tổng trừ</p>
                  <p className="mt-2 text-xl font-bold">
                    {formatMoney(selectedTransaction.amount + selectedTransaction.fee)}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">Tài khoản nguồn</p>
                  <p className="mt-2 text-sm font-bold">{selectedTransaction.senderName}</p>
                  <p className="font-mono text-sm text-[#002147]">{selectedTransaction.fromAccount}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">Tài khoản nhận</p>
                  <p className="mt-2 text-sm font-bold">{selectedTransaction.receiverName}</p>
                  <p className="font-mono text-sm text-[#002147]">{selectedTransaction.toAccount}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">Loại giao dịch</p>
                  <p className="mt-2 text-sm font-bold">{selectedTransaction.type}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase text-slate-500">Thời gian</p>
                  <p className="mt-2 text-sm font-bold">{selectedTransaction.createdAt}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950">
                <History className="h-5 w-5 text-[#002147]" />
                Nhật ký xử lý nghiệp vụ
              </h4>

              <div className="space-y-3">
                {selectedTransaction.logs.map((log, index) => (
                  <div key={`${log.action}-${index}`} className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-sm font-bold text-slate-950">{log.action}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {log.performedBy} • {log.createdAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={reverseOpen}
        onClose={() => setReverseOpen(false)}
        title="Xác nhận hoàn tiền / đảo giao dịch"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-700" />
              <div>
                <p className="font-bold text-amber-900">Thao tác nhạy cảm</p>
                <p className="mt-1 text-sm text-amber-800">
                  Chỉ giao dịch COMPLETED mới được hoàn tiền. Sau khi hoàn tiền, trạng thái sẽ chuyển sang REVERSED.
                </p>
              </div>
            </div>
          </div>

          {selectedTransaction && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono text-sm font-bold text-[#002147]">
                {selectedTransaction.transactionId}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {selectedTransaction.senderName} → {selectedTransaction.receiverName}
              </p>
              <p className="mt-1 text-xl font-bold">{formatMoney(selectedTransaction.amount)}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setReverseOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              onClick={reverseTransaction}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-purple-800"
            >
              <RotateCcw className="h-4 w-4" />
              Xác nhận hoàn tiền
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}