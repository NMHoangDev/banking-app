import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  Info,
  Printer,
  ReceiptText,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';

type AccountStatus = 'ACTIVE' | 'LOCKED' | 'INACTIVE' | 'CLOSED';

type SourceAccount = {
  accountId: string;
  accountNumber: string;
  ownerName: string;
  type: string;
  balance: number;
  status: AccountStatus;
  perTransactionLimit: number;
  dailyTransferLimit: number;
  dailyTransferred: number;
};

type ReceiverAccount = {
  accountNumber: string;
  ownerName: string;
  bankName: string;
  status: AccountStatus;
};

type TransferResult = {
  transactionId: string;
  fromAccount: string;
  toAccount: string;
  receiverName: string;
  amount: number;
  fee: number;
  totalDebit: number;
  note: string;
  status: 'COMPLETED' | 'FAILED';
  createdAt: string;
  message: string;
};

const sourceAccounts: SourceAccount[] = [
  {
    accountId: 'ACC-0001',
    accountNumber: '1000000001',
    ownerName: 'Nguyễn Văn Hoàng',
    type: 'Saving',
    balance: 245000000,
    status: 'ACTIVE',
    perTransactionLimit: 50000000,
    dailyTransferLimit: 200000000,
    dailyTransferred: 25000000,
  },
  {
    accountId: 'ACC-0002',
    accountNumber: '1000000002',
    ownerName: 'Nguyễn Văn Hoàng',
    type: 'Payment',
    balance: 38500000,
    status: 'ACTIVE',
    perTransactionLimit: 30000000,
    dailyTransferLimit: 100000000,
    dailyTransferred: 8000000,
  },
  {
    accountId: 'ACC-0004',
    accountNumber: '1000000021',
    ownerName: 'Phạm Anh Tuấn',
    type: 'Business',
    balance: 0,
    status: 'LOCKED',
    perTransactionLimit: 100000000,
    dailyTransferLimit: 500000000,
    dailyTransferred: 0,
  },
];

const receiverAccounts: ReceiverAccount[] = [
  {
    accountNumber: '1000000002',
    ownerName: 'Nguyễn Văn Hoàng',
    bankName: 'Enterprise Bank',
    status: 'ACTIVE',
  },
  {
    accountNumber: '1000000010',
    ownerName: 'Trần Thị Lan',
    bankName: 'Enterprise Bank',
    status: 'ACTIVE',
  },
  {
    accountNumber: '1000000034',
    ownerName: 'Lê Minh',
    bankName: 'Enterprise Bank',
    status: 'ACTIVE',
  },
  {
    accountNumber: '1000000099',
    ownerName: 'Tài khoản bị khóa',
    bankName: 'Enterprise Bank',
    status: 'LOCKED',
  },
];

const beneficiaries = [
  {
    name: 'Trần Thị Lan',
    accountNumber: '1000000010',
    bankName: 'Enterprise Bank',
  },
  {
    name: 'Lê Minh',
    accountNumber: '1000000034',
    bankName: 'Enterprise Bank',
  },
];

const INTERNAL_TRANSFER_FEE = 2000;

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('vi-VN').format(value)} VND`;
}

function generateTransactionId() {
  return `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
}

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { number: 1, label: 'Thông tin chuyển tiền' },
    { number: 2, label: 'Xác nhận giao dịch' },
    { number: 3, label: 'Kết quả & biên lai' },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.number}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-4',
              step === item.number
                ? 'border-[#002147] bg-blue-50 text-[#002147]'
                : step > item.number
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
            )}
          >
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold',
                step === item.number
                  ? 'bg-[#002147] text-white'
                  : step > item.number
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-500'
              )}
            >
              {step > item.number ? <CheckCircle2 className="h-5 w-5" /> : item.number}
            </div>
            <p className="text-sm font-bold">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn('rounded-2xl border p-4', highlight ? 'border-[#002147] bg-blue-50' : 'border-slate-200 bg-white')}>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className={cn('mt-2 text-sm font-bold', highlight ? 'text-[#002147]' : 'text-slate-950')}>
        {value}
      </p>
    </div>
  );
}

export default function Transfer() {
  const [step, setStep] = useState(1);
  const [fromAccountNumber, setFromAccountNumber] = useState('1000000001');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [receiver, setReceiver] = useState<ReceiverAccount | null>(null);
  const [receiverChecked, setReceiverChecked] = useState(false);
  const [acceptedConfirm, setAcceptedConfirm] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TransferResult | null>(null);

  const selectedSourceAccount = useMemo(() => {
    return sourceAccounts.find((account) => account.accountNumber === fromAccountNumber) || null;
  }, [fromAccountNumber]);

  const amountNumber = Number(amount || 0);
  const fee = INTERNAL_TRANSFER_FEE;
  const totalDebit = amountNumber + fee;
  const dailyRemaining = selectedSourceAccount
    ? selectedSourceAccount.dailyTransferLimit - selectedSourceAccount.dailyTransferred
    : 0;

  const checkReceiver = () => {
    setError('');
    setReceiver(null);
    setReceiverChecked(true);

    if (!toAccountNumber.trim()) {
      setError('Vui lòng nhập số tài khoản nhận.');
      return;
    }

    const found = receiverAccounts.find(
      (item) => item.accountNumber === toAccountNumber.trim()
    );

    if (!found) {
      setError('Không tìm thấy tài khoản nhận.');
      return;
    }

    setReceiver(found);
  };

  const validateStep1 = () => {
    setError('');

    if (!selectedSourceAccount) {
      setError('Tài khoản nguồn không tồn tại.');
      return false;
    }

    if (selectedSourceAccount.status !== 'ACTIVE') {
      setError('Tài khoản nguồn không ở trạng thái ACTIVE.');
      return false;
    }

    if (!receiver || !receiverChecked) {
      setError('Vui lòng kiểm tra tài khoản nhận trước khi tiếp tục.');
      return false;
    }

    if (receiver.status !== 'ACTIVE') {
      setError('Tài khoản nhận không ở trạng thái ACTIVE.');
      return false;
    }

    if (selectedSourceAccount.accountNumber === receiver.accountNumber) {
      setError('Không được chuyển tiền cho chính tài khoản nguồn.');
      return false;
    }

    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setError('Số tiền chuyển phải lớn hơn 0.');
      return false;
    }

    if (amountNumber > selectedSourceAccount.perTransactionLimit) {
      setError('Số tiền vượt hạn mức mỗi giao dịch.');
      return false;
    }

    if (amountNumber > dailyRemaining) {
      setError('Số tiền vượt hạn mức chuyển tiền còn lại trong ngày.');
      return false;
    }

    if (totalDebit > selectedSourceAccount.balance) {
      setError('Số dư không đủ để thực hiện giao dịch, bao gồm cả phí.');
      return false;
    }

    return true;
  };

  const goToConfirm = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const performTransfer = () => {
    if (!acceptedConfirm) {
      setError('Bạn cần xác nhận thông tin giao dịch là chính xác.');
      return;
    }

    if (!selectedSourceAccount || !receiver) {
      setError('Thiếu thông tin giao dịch.');
      return;
    }

    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

    const transferResult: TransferResult = {
      transactionId: generateTransactionId(),
      fromAccount: selectedSourceAccount.accountNumber,
      toAccount: receiver.accountNumber,
      receiverName: receiver.ownerName,
      amount: amountNumber,
      fee,
      totalDebit,
      note,
      status: 'COMPLETED',
      createdAt: now,
      message: 'Giao dịch chuyển tiền nội bộ đã được thực hiện thành công.',
    };

    setResult(transferResult);
    setStep(3);
    setError('');
  };

  const resetTransfer = () => {
    setStep(1);
    setFromAccountNumber('1000000001');
    setToAccountNumber('');
    setAmount('');
    setNote('');
    setReceiver(null);
    setReceiverChecked(false);
    setAcceptedConfirm(false);
    setError('');
    setResult(null);
  };

  const selectBeneficiary = (accountNumber: string) => {
    setToAccountNumber(accountNumber);
    setReceiver(null);
    setReceiverChecked(false);
    setError('');
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Transfers</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#002147]">Chuyển tiền nội bộ</span>
            </nav>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Chuyển tiền nội bộ
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Luồng chuyển tiền gồm 3 bước: nhập thông tin, xác nhận phí và tổng tiền trừ, sau đó hiển thị kết quả giao dịch và biên lai.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-bold">Bảo vệ giao dịch</p>
                <p>Kiểm tra số dư, hạn mức/lần, hạn mức/ngày và trạng thái tài khoản trước khi chuyển.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StepIndicator step={step} />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-950">
                <ArrowRightLeft className="h-5 w-5 text-[#002147]" />
                Thông tin chuyển tiền
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                    Tài khoản nguồn
                  </label>
                  <select
                    value={fromAccountNumber}
                    onChange={(event) => {
                      setFromAccountNumber(event.target.value);
                      setError('');
                    }}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-[#002147]"
                  >
                    {sourceAccounts.map((account) => (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        {account.accountNumber} - {account.type} - {formatMoney(account.balance)} - {account.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                    Tài khoản nhận
                  </label>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={toAccountNumber}
                        onChange={(event) => {
                          setToAccountNumber(event.target.value);
                          setReceiver(null);
                          setReceiverChecked(false);
                        }}
                        placeholder="Nhập số tài khoản nhận"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#002147]"
                      />
                    </div>

                    <button
                      onClick={checkReceiver}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Search className="h-4 w-4" />
                      Kiểm tra người nhận
                    </button>
                  </div>

                  {receiver && (
                    <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                      <div className="flex items-center gap-3">
                        <BadgeCheck className="h-5 w-5 text-emerald-700" />
                        <div>
                          <p className="font-bold text-emerald-900">{receiver.ownerName}</p>
                          <p className="text-sm text-emerald-700">
                            {receiver.bankName} • {receiver.accountNumber} • {receiver.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                    Số tiền chuyển
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Nhập số tiền VND"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#002147]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                    Nội dung chuyển tiền
                  </label>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ví dụ: Chuyển tiền nội bộ"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#002147]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={goToConfirm}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#001936]"
                >
                  Tiếp tục xác nhận
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950">
                <Wallet className="h-5 w-5 text-[#002147]" />
                Thông tin hạn mức
              </h3>

              {selectedSourceAccount && (
                <div className="space-y-3">
                  <Field label="Số dư khả dụng" value={formatMoney(selectedSourceAccount.balance)} highlight />
                  <Field label="Hạn mức mỗi giao dịch" value={formatMoney(selectedSourceAccount.perTransactionLimit)} />
                  <Field label="Hạn mức ngày" value={formatMoney(selectedSourceAccount.dailyTransferLimit)} />
                  <Field label="Đã chuyển trong ngày" value={formatMoney(selectedSourceAccount.dailyTransferred)} />
                  <Field label="Còn lại trong ngày" value={formatMoney(dailyRemaining)} />
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-950">Người thụ hưởng</h3>

              <div className="space-y-3">
                {beneficiaries.map((item) => (
                  <button
                    key={item.accountNumber}
                    onClick={() => selectBeneficiary(item.accountNumber)}
                    className="w-full rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50"
                  >
                    <p className="font-bold text-slate-950">{item.name}</p>
                    <p className="mt-1 font-mono text-sm text-[#002147]">{item.accountNumber}</p>
                    <p className="text-xs text-slate-500">{item.bankName}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && selectedSourceAccount && receiver && (
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-950">
              <ReceiptText className="h-5 w-5 text-[#002147]" />
              Xác nhận giao dịch
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Tài khoản nguồn" value={`${selectedSourceAccount.accountNumber} - ${selectedSourceAccount.ownerName}`} />
              <Field label="Tài khoản nhận" value={`${receiver.accountNumber} - ${receiver.ownerName}`} />
              <Field label="Ngân hàng nhận" value={receiver.bankName} />
              <Field label="Trạng thái người nhận" value={receiver.status} />
              <Field label="Số tiền chuyển" value={formatMoney(amountNumber)} highlight />
              <Field label="Phí giao dịch" value={formatMoney(fee)} />
              <Field label="Tổng tiền trừ" value={formatMoney(totalDebit)} highlight />
              <Field label="Số dư sau giao dịch" value={formatMoney(selectedSourceAccount.balance - totalDebit)} />
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0" />
                <p>
                  Vui lòng kiểm tra kỹ số tài khoản nhận, tên người nhận, số tiền và phí. Giao dịch tiền sau khi hoàn tất chỉ có thể xử lý bằng nghiệp vụ hoàn tiền/đảo giao dịch.
                </p>
              </div>
            </div>

            <label className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={acceptedConfirm}
                onChange={(event) => setAcceptedConfirm(event.target.checked)}
                className="mt-1"
              />
              Tôi xác nhận thông tin chuyển tiền là chính xác và đồng ý thực hiện giao dịch.
            </label>

            <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </button>

              <button
                onClick={performTransfer}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#001936]"
              >
                <Send className="h-4 w-4" />
                Xác nhận chuyển tiền
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="mx-auto max-w-5xl space-y-6">
          <div
            className={cn(
              'rounded-3xl border bg-white p-8 text-center shadow-sm',
              result.status === 'COMPLETED' ? 'border-emerald-200' : 'border-red-200'
            )}
          >
            {result.status === 'COMPLETED' ? (
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
            ) : (
              <XCircle className="mx-auto h-16 w-16 text-red-600" />
            )}

            <h3 className="mt-4 text-2xl font-bold text-slate-950">
              {result.status === 'COMPLETED' ? 'Giao dịch thành công' : 'Giao dịch thất bại'}
            </h3>

            <p className="mt-2 text-sm text-slate-500">{result.message}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-base font-bold text-slate-950">Biên lai giao dịch</h3>
                <p className="mt-1 font-mono text-sm font-bold text-[#002147]">
                  {result.transactionId}
                </p>
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Mã giao dịch" value={result.transactionId} />
              <Field label="Thời gian" value={result.createdAt} />
              <Field label="Tài khoản nguồn" value={result.fromAccount} />
              <Field label="Tài khoản nhận" value={`${result.toAccount} - ${result.receiverName}`} />
              <Field label="Số tiền" value={formatMoney(result.amount)} highlight />
              <Field label="Phí" value={formatMoney(result.fee)} />
              <Field label="Tổng tiền trừ" value={formatMoney(result.totalDebit)} highlight />
              <Field label="Trạng thái" value={result.status} />
              <div className="md:col-span-2">
                <Field label="Nội dung" value={result.note || 'Không có nội dung'} />
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
              <button
                onClick={resetTransfer}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Giao dịch mới
              </button>

              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#001936]">
                <Eye className="h-4 w-4" />
                Xem lịch sử giao dịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}