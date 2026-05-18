import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit2,
  Filter,
  Plus,
  Search,
  Send,
  Trash2,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';
import Modal from '../components/ui/Modal';

type Beneficiary = {
  id: string;
  nickname: string;
  beneficiaryName: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  createdAt: string;
  category: 'Cá nhân' | 'Gia đình' | 'Đối tác' | 'Doanh nghiệp';
  isFavorite: boolean;
};

const initialBeneficiaries: Beneficiary[] = [
  {
    id: 'BEN-0001',
    nickname: 'Lan em gái',
    beneficiaryName: 'Trần Thị Lan',
    accountNumber: '1000000010',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    createdAt: '2023-02-01',
    category: 'Gia đình',
    isFavorite: true,
  },
  {
    id: 'BEN-0002',
    nickname: 'Minh đối tác',
    beneficiaryName: 'Lê Minh',
    accountNumber: '1000000034',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    createdAt: '2023-04-15',
    category: 'Đối tác',
    isFavorite: false,
  },
  {
    id: 'BEN-0003',
    nickname: 'Công ty Minh Long',
    beneficiaryName: 'Công ty Minh Long',
    accountNumber: '1000000045',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    createdAt: '2023-08-21',
    category: 'Doanh nghiệp',
    isFavorite: true,
  },
];

const availableAccounts = [
  {
    accountNumber: '1000000010',
    ownerName: 'Trần Thị Lan',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    status: 'ACTIVE',
  },
  {
    accountNumber: '1000000034',
    ownerName: 'Lê Minh',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    status: 'ACTIVE',
  },
  {
    accountNumber: '1000000045',
    ownerName: 'Công ty Minh Long',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    status: 'ACTIVE',
  },
  {
    accountNumber: '1000000099',
    ownerName: 'Tài khoản bị khóa',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    status: 'LOCKED',
  },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(-2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function categoryBadge(category: Beneficiary['category']) {
  const styles: Record<Beneficiary['category'], string> = {
    'Cá nhân': 'bg-blue-50 text-blue-700 border-blue-200',
    'Gia đình': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Đối tác': 'bg-purple-50 text-purple-700 border-purple-200',
    'Doanh nghiệp': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold',
        styles[category]
      )}
    >
      {category}
    </span>
  );
}

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] =
    useState<Beneficiary[]>(initialBeneficiaries);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | Beneficiary['category']>('ALL');
  const [bankFilter, setBankFilter] = useState('ALL');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditAliasOpen, setIsEditAliasOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);

  const [form, setForm] = useState({
    accountNumber: '',
    bankName: 'Enterprise Bank',
    bankCode: 'EBANK',
    nickname: '',
    category: 'Cá nhân' as Beneficiary['category'],
  });

  const [checkedAccount, setCheckedAccount] = useState<null | {
    accountNumber: string;
    ownerName: string;
    bankName: string;
    bankCode: string;
    status: string;
  }>(null);

  const [formError, setFormError] = useState('');

  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((item) => {
      const keyword = searchTerm.trim().toLowerCase();

      const matchSearch =
        item.nickname.toLowerCase().includes(keyword) ||
        item.beneficiaryName.toLowerCase().includes(keyword) ||
        item.accountNumber.includes(keyword) ||
        item.bankName.toLowerCase().includes(keyword);

      const matchCategory =
        categoryFilter === 'ALL' || item.category === categoryFilter;

      const matchBank = bankFilter === 'ALL' || item.bankName === bankFilter;

      return matchSearch && matchCategory && matchBank;
    });
  }, [beneficiaries, searchTerm, categoryFilter, bankFilter]);

  const summary = useMemo(() => {
    return {
      total: beneficiaries.length,
      favorite: beneficiaries.filter((item) => item.isFavorite).length,
      enterprise: beneficiaries.filter((item) => item.category === 'Doanh nghiệp').length,
      personal: beneficiaries.filter((item) => item.category === 'Cá nhân').length,
    };
  }, [beneficiaries]);

  const resetForm = () => {
    setForm({
      accountNumber: '',
      bankName: 'Enterprise Bank',
      bankCode: 'EBANK',
      nickname: '',
      category: 'Cá nhân',
    });
    setCheckedAccount(null);
    setFormError('');
  };

  const openAddModal = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const checkAccount = () => {
    setFormError('');
    setCheckedAccount(null);

    if (!form.accountNumber.trim()) {
      setFormError('Vui lòng nhập số tài khoản nhận.');
      return;
    }

    const account = availableAccounts.find(
      (item) => item.accountNumber === form.accountNumber.trim()
    );

    if (!account) {
      setFormError('Không tìm thấy tài khoản nhận.');
      return;
    }

    if (account.status !== 'ACTIVE') {
      setFormError('Tài khoản nhận không ở trạng thái ACTIVE.');
      return;
    }

    setCheckedAccount(account);
    setForm((prev) => ({
      ...prev,
      bankName: account.bankName,
      bankCode: account.bankCode,
      nickname: prev.nickname || account.ownerName,
    }));
  };

  const addBeneficiary = () => {
    setFormError('');

    if (!form.accountNumber.trim()) {
      setFormError('Số tài khoản nhận là bắt buộc.');
      return;
    }

    if (!form.bankName.trim()) {
      setFormError('Tên ngân hàng là bắt buộc.');
      return;
    }

    if (!form.nickname.trim()) {
      setFormError('Tên gợi nhớ là bắt buộc.');
      return;
    }

    if (!checkedAccount) {
      setFormError('Vui lòng kiểm tra tài khoản nhận trước khi lưu.');
      return;
    }

    const duplicated = beneficiaries.some(
      (item) => item.accountNumber === form.accountNumber.trim()
    );

    if (duplicated) {
      setFormError('Người thụ hưởng này đã tồn tại trong danh sách.');
      return;
    }

    const newBeneficiary: Beneficiary = {
      id: `BEN-${String(beneficiaries.length + 1).padStart(4, '0')}`,
      nickname: form.nickname,
      beneficiaryName: checkedAccount.ownerName,
      accountNumber: checkedAccount.accountNumber,
      bankName: checkedAccount.bankName,
      bankCode: checkedAccount.bankCode,
      createdAt: new Date().toISOString().slice(0, 10),
      category: form.category,
      isFavorite: false,
    };

    setBeneficiaries((prev) => [newBeneficiary, ...prev]);
    setIsAddOpen(false);
  };

  const openEditAlias = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setForm({
      accountNumber: beneficiary.accountNumber,
      bankName: beneficiary.bankName,
      bankCode: beneficiary.bankCode,
      nickname: beneficiary.nickname,
      category: beneficiary.category,
    });
    setFormError('');
    setIsEditAliasOpen(true);
  };

  const saveAlias = () => {
    if (!selectedBeneficiary) return;

    if (!form.nickname.trim()) {
      setFormError('Tên gợi nhớ không được để trống.');
      return;
    }

    setBeneficiaries((prev) =>
      prev.map((item) =>
        item.id === selectedBeneficiary.id
          ? {
            ...item,
            nickname: form.nickname,
            category: form.category,
          }
          : item
      )
    );

    setIsEditAliasOpen(false);
  };

  const openDeleteModal = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDeleteOpen(true);
  };

  const deleteBeneficiary = () => {
    if (!selectedBeneficiary) return;

    setBeneficiaries((prev) =>
      prev.filter((item) => item.id !== selectedBeneficiary.id)
    );

    setIsDeleteOpen(false);
  };

  const toggleFavorite = (beneficiaryId: string) => {
    setBeneficiaries((prev) =>
      prev.map((item) =>
        item.id === beneficiaryId
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      )
    );
  };

  const transferToBeneficiary = (beneficiary: Beneficiary) => {
    const query = new URLSearchParams({
      toAccount: beneficiary.accountNumber,
      receiverName: beneficiary.beneficiaryName,
      bankName: beneficiary.bankName,
    }).toString();

    window.location.href = `/transfers/new?${query}`;
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <nav className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span>Transfers</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#002147]">Beneficiaries</span>
            </nav>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Quản lý người thụ hưởng
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Lưu danh sách tài khoản nhận thường xuyên, đặt tên gợi nhớ,
              chuyển tiền nhanh, sửa alias hoặc xóa người thụ hưởng khi không
              còn sử dụng.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#001936]"
          >
            <UserPlus className="h-4 w-4" />
            Thêm người thụ hưởng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Users className="mb-4 h-6 w-6 text-[#002147]" />
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Tổng người thụ hưởng
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <BadgeCheck className="mb-4 h-6 w-6 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Yêu thích
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.favorite}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Building2 className="mb-4 h-6 w-6 text-amber-600" />
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Doanh nghiệp
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.enterprise}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <User className="mb-4 h-6 w-6 text-blue-600" />
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Cá nhân
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{summary.personal}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tên gợi nhớ, số tài khoản, ngân hàng..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#002147]"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(event.target.value as 'ALL' | Beneficiary['category'])
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="ALL">Tất cả nhóm</option>
                <option value="Cá nhân">Cá nhân</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Đối tác">Đối tác</option>
                <option value="Doanh nghiệp">Doanh nghiệp</option>
              </select>

              <select
                value={bankFilter}
                onChange={(event) => setBankFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#002147]"
              >
                <option value="ALL">Tất cả ngân hàng</option>
                <option value="Enterprise Bank">Enterprise Bank</option>
              </select>

              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                Lọc nâng cao
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 xl:grid-cols-3">
          {filteredBeneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002147] text-sm font-bold text-white">
                    {getInitials(beneficiary.beneficiaryName)}
                  </div>

                  <div>
                    <p className="text-base font-bold text-slate-950">
                      {beneficiary.nickname}
                    </p>
                    <p className="text-sm text-slate-500">
                      {beneficiary.beneficiaryName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(beneficiary.id)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[11px] font-bold',
                    beneficiary.isFavorite
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  )}
                >
                  {beneficiary.isFavorite ? 'Favorite' : 'Normal'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                    <Banknote className="h-4 w-4" />
                    Số tài khoản nhận
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm font-bold text-[#002147]">
                      {beneficiary.accountNumber}
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(beneficiary.accountNumber)}
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Ngân hàng
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-950">
                      {beneficiary.bankName}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-bold uppercase text-slate-500">
                      Nhóm
                    </p>
                    <div className="mt-1">{categoryBadge(beneficiary.category)}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="mb-1 flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
                    <Calendar className="h-4 w-4" />
                    Ngày tạo
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {beneficiary.createdAt}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => transferToBeneficiary(beneficiary)}
                  className="col-span-3 inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#001936]"
                >
                  <Send className="h-4 w-4" />
                  Chuyển tiền nhanh
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => openEditAlias(beneficiary)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Edit2 className="h-4 w-4" />
                  Sửa
                </button>

                <button
                  onClick={() => openDeleteModal(beneficiary)}
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa người thụ hưởng
                </button>
              </div>
            </div>
          ))}

          {filteredBeneficiaries.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-sm font-bold text-slate-600">
                Không tìm thấy người thụ hưởng phù hợp.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 md:flex-row md:items-center">
          <p className="text-xs font-semibold text-slate-500">
            Hiển thị {filteredBeneficiaries.length} / {beneficiaries.length} người thụ hưởng
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
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Thêm người thụ hưởng"
        maxWidth="lg"
      >
        <div className="space-y-5 p-6">
          {formError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                {formError}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
              Số tài khoản nhận *
            </label>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={form.accountNumber}
                onChange={(event) => {
                  setForm({ ...form, accountNumber: event.target.value });
                  setCheckedAccount(null);
                  setFormError('');
                }}
                placeholder="Nhập số tài khoản nhận"
                className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />

              <button
                onClick={checkAccount}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Search className="h-4 w-4" />
                Kiểm tra
              </button>
            </div>
          </div>

          {checkedAccount && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-bold text-emerald-900">
                    {checkedAccount.ownerName}
                  </p>
                  <p className="mt-1 text-sm text-emerald-700">
                    {checkedAccount.bankName} • {checkedAccount.accountNumber} • {checkedAccount.status}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Ngân hàng *
              </label>
              <input
                value={form.bankName}
                onChange={(event) => setForm({ ...form, bankName: event.target.value })}
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Nhóm
              </label>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({
                    ...form,
                    category: event.target.value as Beneficiary['category'],
                  })
                }
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              >
                <option value="Cá nhân">Cá nhân</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Đối tác">Đối tác</option>
                <option value="Doanh nghiệp">Doanh nghiệp</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
                Tên gợi nhớ *
              </label>
              <input
                value={form.nickname}
                onChange={(event) => setForm({ ...form, nickname: event.target.value })}
                placeholder="Ví dụ: Lan em gái, Công ty Minh Long..."
                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-bold">Quy tắc thêm người thụ hưởng</p>
            <p className="mt-1">
              Số tài khoản nhận và ngân hàng là bắt buộc. Một khách hàng không
              được thêm trùng cùng một số tài khoản nhận.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={() => setIsAddOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Hủy
            </button>

            <button
              onClick={addBeneficiary}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#001936]"
            >
              <Plus className="h-4 w-4" />
              Lưu người thụ hưởng
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditAliasOpen}
        onClose={() => setIsEditAliasOpen(false)}
        title="Sửa tên gợi nhớ"
        maxWidth="md"
      >
        <div className="space-y-5 p-6">
          {formError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              {formError}
            </div>
          )}

          {selectedBeneficiary && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">
                {selectedBeneficiary.beneficiaryName}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-[#002147]">
                {selectedBeneficiary.accountNumber}
              </p>
              <p className="text-sm text-slate-500">{selectedBeneficiary.bankName}</p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
              Tên gợi nhớ *
            </label>
            <input
              value={form.nickname}
              onChange={(event) => setForm({ ...form, nickname: event.target.value })}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">
              Nhóm
            </label>
            <select
              value={form.category}
              onChange={(event) =>
                setForm({
                  ...form,
                  category: event.target.value as Beneficiary['category'],
                })
              }
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
            >
              <option value="Cá nhân">Cá nhân</option>
              <option value="Gia đình">Gia đình</option>
              <option value="Đối tác">Đối tác</option>
              <option value="Doanh nghiệp">Doanh nghiệp</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={() => setIsEditAliasOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              onClick={saveAlias}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#001936]"
            >
              <Edit2 className="h-4 w-4" />
              Lưu thay đổi
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Xác nhận xóa người thụ hưởng"
        maxWidth="md"
      >
        <div className="space-y-5 p-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-700" />
              <div>
                <p className="font-bold text-red-900">
                  Bạn có chắc muốn xóa người thụ hưởng này?
                </p>
                <p className="mt-1 text-sm text-red-800">
                  Sau khi xóa, người thụ hưởng sẽ không còn xuất hiện trong
                  danh sách chuyển tiền nhanh.
                </p>
              </div>
            </div>
          </div>

          {selectedBeneficiary && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-bold text-slate-950">
                {selectedBeneficiary.nickname}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {selectedBeneficiary.beneficiaryName}
              </p>
              <p className="mt-1 font-mono text-sm font-bold text-[#002147]">
                {selectedBeneficiary.accountNumber}
              </p>
              <p className="text-sm text-slate-500">
                {selectedBeneficiary.bankName}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              onClick={deleteBeneficiary}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Xóa người thụ hưởng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}