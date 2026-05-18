import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  ChevronLeft,
  Eye,
  FileEdit,
  Plus,
  UserPlus,
  IdCard,
  Wallet,
  CreditCard,
  Landmark,
  ReceiptText,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Unlock,
  Trash2,
  BadgeCheck,
  AlertTriangle,
  X,
  Save,
  ArrowRightLeft,
  User,
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

type CustomerStatus = 'ACTIVE' | 'LOCKED' | 'PENDING';
type Gender = 'Nam' | 'Nữ' | 'Khác';

type Customer = {
  customerId: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  status: CustomerStatus;
  customerType: 'Cá nhân' | 'Doanh nghiệp' | 'VIP';
  identity: {
    identityType: string;
    idNumber: string;
    issueDate: string;
    issuePlace: string;
  };
  accounts: {
    accountNumber: string;
    accountType: string;
    balance: string;
    status: string;
    createdAt: string;
  }[];
  cards: {
    cardNumber: string;
    cardType: string;
    expiryDate: string;
    status: string;
    linkedAccount: string;
  }[];
  loans: {
    loanId: string;
    amount: string;
    interestRate: string;
    startDate: string;
    endDate: string;
    status: string;
  }[];
  bills: {
    billId: string;
    billType: string;
    amount: string;
    dueDate: string;
    status: string;
  }[];
  beneficiaries: {
    name: string;
    accountNumber: string;
    bankName: string;
    createdAt: string;
  }[];
  transactions: {
    transactionId: string;
    type: string;
    amount: string;
    status: string;
    createdAt: string;
  }[];
};

const initialCustomers: Customer[] = [
  {
    customerId: 'CUS-0001',
    fullName: 'Nguyễn Văn Hoàng',
    dateOfBirth: '1988-05-12',
    gender: 'Nam',
    phone: '0912345678',
    email: 'hoang.nv@email.com',
    address: 'Số 15, Phố Duy Tân, Cầu Giấy, Hà Nội',
    createdAt: '2021-01-15',
    status: 'ACTIVE',
    customerType: 'VIP',
    identity: {
      identityType: 'CCCD',
      idNumber: '001088012345',
      issueDate: '2020-03-10',
      issuePlace: 'Cục CSQLHC về TTXH',
    },
    accounts: [
      {
        accountNumber: '1000000001',
        accountType: 'Saving',
        balance: '245,000,000 VND',
        status: 'ACTIVE',
        createdAt: '2021-01-16',
      },
      {
        accountNumber: '1000000002',
        accountType: 'Payment',
        balance: '38,500,000 VND',
        status: 'ACTIVE',
        createdAt: '2021-02-20',
      },
    ],
    cards: [
      {
        cardNumber: '**** **** **** 1234',
        cardType: 'DEBIT',
        expiryDate: '12/2028',
        status: 'ACTIVE',
        linkedAccount: '1000000002',
      },
    ],
    loans: [
      {
        loanId: 'LOAN-3002',
        amount: '350,000,000 VND',
        interestRate: '9.2%',
        startDate: '2022-10-25',
        endDate: '2025-10-25',
        status: 'ACTIVE',
      },
    ],
    bills: [
      {
        billId: 'BILL-1021',
        billType: 'Điện',
        amount: '850,000 VND',
        dueDate: '2023-10-26',
        status: 'UNPAID',
      },
    ],
    beneficiaries: [
      {
        name: 'Trần Thị Lan',
        accountNumber: '1000000010',
        bankName: 'Enterprise Bank',
        createdAt: '2023-02-01',
      },
    ],
    transactions: [
      {
        transactionId: 'TXN-49021',
        type: 'INTERNAL_TRANSFER',
        amount: '25,000,000 VND',
        status: 'COMPLETED',
        createdAt: '2023-10-24 14:20',
      },
    ],
  },
  {
    customerId: 'CUS-0002',
    fullName: 'Trần Thị Lan',
    dateOfBirth: '1995-11-24',
    gender: 'Nữ',
    phone: '0988776554',
    email: 'lan.tran95@email.com',
    address: 'Landmark 81, P22, Bình Thạnh, TP.HCM',
    createdAt: '2023-03-02',
    status: 'ACTIVE',
    customerType: 'Cá nhân',
    identity: {
      identityType: 'CCCD',
      idNumber: '079195098765',
      issueDate: '2021-06-18',
      issuePlace: 'Cục CSQLHC về TTXH',
    },
    accounts: [
      {
        accountNumber: '1000000010',
        accountType: 'Payment',
        balance: '72,300,000 VND',
        status: 'ACTIVE',
        createdAt: '2023-03-03',
      },
    ],
    cards: [
      {
        cardNumber: '**** **** **** 7788',
        cardType: 'ATM',
        expiryDate: '08/2027',
        status: 'ACTIVE',
        linkedAccount: '1000000010',
      },
    ],
    loans: [],
    bills: [
      {
        billId: 'BILL-1022',
        billType: 'Internet',
        amount: '320,000 VND',
        dueDate: '2023-10-24',
        status: 'OVERDUE',
      },
    ],
    beneficiaries: [],
    transactions: [
      {
        transactionId: 'TXN-49022',
        type: 'BILL_PAYMENT',
        amount: '320,000 VND',
        status: 'PENDING',
        createdAt: '2023-10-24 14:15',
      },
    ],
  },
  {
    customerId: 'CUS-0003',
    fullName: 'Phạm Anh Tuấn',
    dateOfBirth: '1982-09-05',
    gender: 'Nam',
    phone: '0903445566',
    email: 'tuan.pa@workmail.vn',
    address: '24 Đường Láng, Đống Đa, Hà Nội',
    createdAt: '2019-11-19',
    status: 'LOCKED',
    customerType: 'Doanh nghiệp',
    identity: {
      identityType: 'CCCD',
      idNumber: '001082334455',
      issueDate: '2019-09-01',
      issuePlace: 'Hà Nội',
    },
    accounts: [
      {
        accountNumber: '1000000021',
        accountType: 'Payment',
        balance: '0 VND',
        status: 'LOCKED',
        createdAt: '2019-11-20',
      },
    ],
    cards: [],
    loans: [],
    bills: [],
    beneficiaries: [],
    transactions: [
      {
        transactionId: 'TXN-49023',
        type: 'INTERNAL_TRANSFER',
        amount: '2,300,000 VND',
        status: 'FAILED',
        createdAt: '2023-10-24 13:58',
      },
    ],
  },
  {
    customerId: 'CUS-0004',
    fullName: 'Lê Minh',
    dateOfBirth: '2000-07-15',
    gender: 'Nam',
    phone: '0332111222',
    email: 'minh.le@outlook.com',
    address: 'Số 102, Trần Hưng Đạo, Hải Phòng',
    createdAt: '2024-01-05',
    status: 'PENDING',
    customerType: 'Cá nhân',
    identity: {
      identityType: 'Chưa cập nhật',
      idNumber: 'Chưa cập nhật',
      issueDate: 'Chưa cập nhật',
      issuePlace: 'Chưa cập nhật',
    },
    accounts: [],
    cards: [],
    loans: [],
    bills: [],
    beneficiaries: [],
    transactions: [],
  },
];

const tabs = [
  { id: 'personal', label: 'Thông tin cá nhân', icon: User },
  { id: 'identity', label: 'Giấy tờ định danh', icon: IdCard },
  { id: 'accounts', label: 'Tài khoản', icon: Wallet },
  { id: 'cards', label: 'Thẻ', icon: CreditCard },
  { id: 'loans', label: 'Khoản vay', icon: Landmark },
  { id: 'bills', label: 'Hóa đơn', icon: ReceiptText },
  { id: 'beneficiaries', label: 'Người thụ hưởng', icon: Users },
  { id: 'transactions', label: 'Giao dịch', icon: ArrowRightLeft },
];

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
    LOCKED: 'bg-red-50 text-red-700 border-red-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    FAILED: 'bg-red-50 text-red-700 border-red-200',
    UNPAID: 'bg-yellow-50 text-yellow-700 border-yellow-200',
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

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmLockOpen, setIsConfirmLockOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam' as Gender,
    phone: '',
    email: '',
    address: '',
    customerType: 'Cá nhân' as Customer['customerType'],
    status: 'ACTIVE' as CustomerStatus,
  });

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const keyword = searchTerm.trim().toLowerCase();

      const matchSearch =
        customer.fullName.toLowerCase().includes(keyword) ||
        customer.customerId.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword) ||
        customer.email.toLowerCase().includes(keyword);

      const matchGender =
        genderFilter === 'ALL' || customer.gender === genderFilter;

      const matchStatus =
        statusFilter === 'ALL' || customer.status === statusFilter;

      const matchDate =
        !dateFilter || customer.createdAt >= dateFilter;

      return matchSearch && matchGender && matchStatus && matchDate;
    });
  }, [customers, searchTerm, genderFilter, statusFilter, dateFilter]);

  const summary = useMemo(() => {
    return {
      total: customers.length,
      active: customers.filter((item) => item.status === 'ACTIVE').length,
      pending: customers.filter((item) => item.status === 'PENDING').length,
      locked: customers.filter((item) => item.status === 'LOCKED').length,
    };
  }, [customers]);

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm({
      fullName: '',
      dateOfBirth: '',
      gender: 'Nam',
      phone: '',
      email: '',
      address: '',
      customerType: 'Cá nhân',
      status: 'ACTIVE',
    });
    setIsFormOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      fullName: customer.fullName,
      dateOfBirth: customer.dateOfBirth,
      gender: customer.gender,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      customerType: customer.customerType,
      status: customer.status,
    });
    setIsFormOpen(true);
  };

  const openDetail = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveTab('personal');
    setIsDetailOpen(true);
  };

  const submitForm = () => {
    if (!form.fullName || !form.dateOfBirth || !form.phone || !form.email) {
      alert('Vui lòng nhập đầy đủ họ tên, ngày sinh, số điện thoại và email.');
      return;
    }

    const duplicatedPhone = customers.some(
      (customer) =>
        customer.phone === form.phone &&
        customer.customerId !== editingCustomer?.customerId
    );

    const duplicatedEmail = customers.some(
      (customer) =>
        customer.email === form.email &&
        customer.customerId !== editingCustomer?.customerId
    );

    if (duplicatedPhone) {
      alert('Số điện thoại đã tồn tại.');
      return;
    }

    if (duplicatedEmail) {
      alert('Email đã tồn tại.');
      return;
    }

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.customerId === editingCustomer.customerId
            ? {
              ...customer,
              fullName: form.fullName,
              dateOfBirth: form.dateOfBirth,
              gender: form.gender,
              phone: form.phone,
              email: form.email,
              address: form.address,
              customerType: form.customerType,
              status: form.status,
            }
            : customer
        )
      );
    } else {
      const nextId = `CUS-${String(customers.length + 1).padStart(4, '0')}`;

      setCustomers((prev) => [
        {
          customerId: nextId,
          fullName: form.fullName,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          phone: form.phone,
          email: form.email,
          address: form.address,
          createdAt: new Date().toISOString().slice(0, 10),
          status: form.status,
          customerType: form.customerType,
          identity: {
            identityType: 'Chưa cập nhật',
            idNumber: 'Chưa cập nhật',
            issueDate: 'Chưa cập nhật',
            issuePlace: 'Chưa cập nhật',
          },
          accounts: [],
          cards: [],
          loans: [],
          bills: [],
          beneficiaries: [],
          transactions: [],
        },
        ...prev,
      ]);
    }

    setIsFormOpen(false);
  };

  const toggleLockCustomer = () => {
    if (!selectedCustomer) return;

    const nextStatus: CustomerStatus =
      selectedCustomer.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.customerId === selectedCustomer.customerId
          ? { ...customer, status: nextStatus }
          : customer
      )
    );

    setSelectedCustomer({ ...selectedCustomer, status: nextStatus });
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
              <span className="text-[#002147]">Quản lý khách hàng</span>
            </nav>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Customer Management
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Quản lý hồ sơ khách hàng, giấy tờ định danh, tài khoản, thẻ,
              khoản vay, hóa đơn, người thụ hưởng và lịch sử giao dịch theo mô
              hình Customer 360°.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Xuất danh sách
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001936]"
            >
              <UserPlus className="h-4 w-4" />
              Thêm khách hàng
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Users className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">
              TOTAL
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tổng khách hàng
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.total}</p>
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
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.active}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-yellow-50 px-2 py-1 text-[11px] font-bold text-yellow-700">
              PENDING
            </span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Chờ xác thực
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.pending}</p>
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
            Bị khóa
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.locked}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã khách hàng, số điện thoại, email..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#002147]"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <select
                value={genderFilter}
                onChange={(event) => setGenderFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="ALL">Tất cả giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="LOCKED">LOCKED</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              />

              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                Lọc nâng cao
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-white">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Ngày sinh / Giới tính
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Loại KH
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Tài khoản
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.customerId} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#002147] text-sm font-bold text-white">
                        {getInitials(customer.fullName)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">{customer.fullName}</p>
                        <p className="font-mono text-xs font-semibold text-slate-500">
                          {customer.customerId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {customer.dateOfBirth}
                    </p>
                    <p className="text-xs text-slate-500">{customer.gender}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {customer.phone}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {customer.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="line-clamp-2 max-w-[240px] text-sm text-slate-600">
                      {customer.address}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {customer.customerType}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-slate-950">
                    {customer.accounts.length}
                  </td>

                  <td className="px-6 py-4">{statusBadge(customer.status)}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openDetail(customer)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => openEditModal(customer)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
                        title="Sửa"
                      >
                        <FileEdit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsConfirmLockOpen(true);
                        }}
                        className={cn(
                          'rounded-lg border p-2 transition',
                          customer.status === 'LOCKED'
                            ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            : 'border-red-200 text-red-700 hover:bg-red-50'
                        )}
                        title={customer.status === 'LOCKED' ? 'Mở khóa' : 'Khóa'}
                      >
                        {customer.status === 'LOCKED' ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12">
                    <EmptyState text="Không tìm thấy khách hàng phù hợp với điều kiện tìm kiếm." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 md:flex-row md:items-center">
          <p className="text-xs font-semibold text-slate-500">
            Hiển thị {filteredCustomers.length} / {customers.length} khách hàng
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
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCustomer ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
        maxWidth="lg"
      >
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Họ và tên *
              </label>
              <input
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
                placeholder="Nhập họ tên khách hàng"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Ngày sinh *
              </label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Giới tính
              </label>
              <select
                value={form.gender}
                onChange={(event) =>
                  setForm({ ...form, gender: event.target.value as Gender })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Loại khách hàng
              </label>
              <select
                value={form.customerType}
                onChange={(event) =>
                  setForm({
                    ...form,
                    customerType: event.target.value as Customer['customerType'],
                  })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="Cá nhân">Cá nhân</option>
                <option value="Doanh nghiệp">Doanh nghiệp</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Số điện thoại *
              </label>
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
                placeholder="09xxxxxxxx"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Trạng thái
              </label>
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value as CustomerStatus })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="LOCKED">LOCKED</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Địa chỉ
              </label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#002147]"
                placeholder="Nhập địa chỉ thường trú"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-bold">Quy tắc kiểm tra dữ liệu</p>
            <p className="mt-1">
              Họ tên, ngày sinh, số điện thoại và email là bắt buộc. Số điện
              thoại và email không được trùng với khách hàng khác.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              onClick={submitForm}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001936]"
            >
              <Save className="h-4 w-4" />
              Lưu khách hàng
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Customer 360°"
        maxWidth="2xl"
      >
        {selectedCustomer && (
          <div className="bg-slate-50">
            <div className="border-b border-slate-200 bg-white p-6">
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#002147] text-xl font-bold text-white">
                    {getInitials(selectedCustomer.fullName)}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">
                      {selectedCustomer.fullName}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {selectedCustomer.customerId}
                      </span>
                      {statusBadge(selectedCustomer.status)}
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                        {selectedCustomer.customerType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => openEditModal(selectedCustomer)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FileEdit className="h-4 w-4" />
                    Sửa khách hàng
                  </button>

                  <button
                    onClick={() => setIsConfirmLockOpen(true)}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
                      selectedCustomer.status === 'LOCKED'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    )}
                  >
                    {selectedCustomer.status === 'LOCKED' ? (
                      <Unlock className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    {selectedCustomer.status === 'LOCKED' ? 'Mở khóa' : 'Khóa khách hàng'}
                  </button>
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
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <Field label="Họ và tên" value={selectedCustomer.fullName} icon={User} />
                  <Field label="Ngày sinh" value={selectedCustomer.dateOfBirth} icon={Calendar} />
                  <Field label="Giới tính" value={selectedCustomer.gender} />
                  <Field label="Số điện thoại" value={selectedCustomer.phone} icon={Phone} />
                  <Field label="Email" value={selectedCustomer.email} icon={Mail} />
                  <Field label="Ngày tạo hồ sơ" value={selectedCustomer.createdAt} icon={Calendar} />
                  <div className="md:col-span-2 xl:col-span-3">
                    <Field label="Địa chỉ" value={selectedCustomer.address} icon={MapPin} />
                  </div>
                </div>
              )}

              {activeTab === 'identity' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Loại giấy tờ" value={selectedCustomer.identity.identityType} icon={IdCard} />
                  <Field label="Số giấy tờ" value={selectedCustomer.identity.idNumber} />
                  <Field label="Ngày cấp" value={selectedCustomer.identity.issueDate} icon={Calendar} />
                  <Field label="Nơi cấp" value={selectedCustomer.identity.issuePlace} icon={MapPin} />

                  <div className="md:col-span-2 flex justify-end">
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white">
                      <Plus className="h-4 w-4" />
                      Thêm / cập nhật định danh
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'accounts' && (
                selectedCustomer.accounts.length ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full min-w-[720px] text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Số tài khoản</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Loại</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Số dư</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Trạng thái</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Ngày tạo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedCustomer.accounts.map((account) => (
                          <tr key={account.accountNumber}>
                            <td className="px-4 py-3 font-mono text-sm font-bold text-[#002147]">{account.accountNumber}</td>
                            <td className="px-4 py-3 text-sm">{account.accountType}</td>
                            <td className="px-4 py-3 text-sm font-bold">{account.balance}</td>
                            <td className="px-4 py-3">{statusBadge(account.status)}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{account.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <EmptyState text="Khách hàng chưa có tài khoản ngân hàng." />
              )}

              {activeTab === 'cards' && (
                selectedCustomer.cards.length ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {selectedCustomer.cards.map((card) => (
                      <div key={card.cardNumber} className="rounded-3xl bg-[#002147] p-6 text-white shadow-sm">
                        <div className="mb-8 flex items-center justify-between">
                          <CreditCard className="h-7 w-7" />
                          {statusBadge(card.status)}
                        </div>
                        <p className="font-mono text-xl font-bold tracking-widest">{card.cardNumber}</p>
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
                            <p className="text-white/60">TK liên kết</p>
                            <p className="font-bold">{card.linkedAccount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Khách hàng chưa có thẻ liên kết." />
              )}

              {activeTab === 'loans' && (
                selectedCustomer.loans.length ? (
                  <div className="space-y-4">
                    {selectedCustomer.loans.map((loan) => (
                      <div key={loan.loanId} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <p className="font-mono text-sm font-bold text-[#002147]">{loan.loanId}</p>
                            <p className="mt-1 text-xl font-bold text-slate-950">{loan.amount}</p>
                          </div>
                          {statusBadge(loan.status)}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                          <Field label="Lãi suất" value={loan.interestRate} />
                          <Field label="Ngày bắt đầu" value={loan.startDate} />
                          <Field label="Ngày kết thúc" value={loan.endDate} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Khách hàng chưa có khoản vay." />
              )}

              {activeTab === 'bills' && (
                selectedCustomer.bills.length ? (
                  <div className="space-y-4">
                    {selectedCustomer.bills.map((bill) => (
                      <div key={bill.billId} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-mono text-sm font-bold text-[#002147]">{bill.billId}</p>
                            <p className="mt-1 text-lg font-bold text-slate-950">{bill.billType}</p>
                            <p className="mt-1 text-sm text-slate-500">Hạn thanh toán: {bill.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-slate-950">{bill.amount}</p>
                            <div className="mt-2">{statusBadge(bill.status)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Khách hàng chưa có hóa đơn." />
              )}

              {activeTab === 'beneficiaries' && (
                selectedCustomer.beneficiaries.length ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {selectedCustomer.beneficiaries.map((beneficiary) => (
                      <div key={beneficiary.accountNumber} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="text-lg font-bold text-slate-950">{beneficiary.name}</p>
                        <p className="mt-2 font-mono text-sm font-bold text-[#002147]">{beneficiary.accountNumber}</p>
                        <p className="mt-1 text-sm text-slate-500">{beneficiary.bankName}</p>
                        <p className="mt-3 text-xs text-slate-400">Tạo ngày: {beneficiary.createdAt}</p>
                      </div>
                    ))}
                  </div>
                ) : <EmptyState text="Khách hàng chưa lưu người thụ hưởng." />
              )}

              {activeTab === 'transactions' && (
                selectedCustomer.transactions.length ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full min-w-[720px] text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Mã giao dịch</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Loại</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Số tiền</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Trạng thái</th>
                          <th className="px-4 py-3 text-xs font-bold uppercase text-slate-500">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedCustomer.transactions.map((transaction) => (
                          <tr key={transaction.transactionId}>
                            <td className="px-4 py-3 font-mono text-sm font-bold text-[#002147]">{transaction.transactionId}</td>
                            <td className="px-4 py-3 text-sm">{transaction.type}</td>
                            <td className="px-4 py-3 text-sm font-bold">{transaction.amount}</td>
                            <td className="px-4 py-3">{statusBadge(transaction.status)}</td>
                            <td className="px-4 py-3 text-sm text-slate-500">{transaction.createdAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <EmptyState text="Khách hàng chưa có lịch sử giao dịch." />
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isConfirmLockOpen}
        onClose={() => setIsConfirmLockOpen(false)}
        title="Xác nhận thay đổi trạng thái"
        maxWidth="md"
      >
        <div className="p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
              <div>
                <p className="font-bold text-amber-900">
                  {selectedCustomer?.status === 'LOCKED'
                    ? 'Mở khóa khách hàng?'
                    : 'Khóa khách hàng?'}
                </p>
                <p className="mt-1 text-sm text-amber-800">
                  Thao tác này sẽ thay đổi trạng thái của khách hàng{' '}
                  <strong>{selectedCustomer?.fullName}</strong>.
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
              onClick={toggleLockCustomer}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#001936]"
            >
              {selectedCustomer?.status === 'LOCKED' ? (
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
