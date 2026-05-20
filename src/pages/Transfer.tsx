import React, { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, CheckCircle2, ChevronRight, Send } from "lucide-react";
import { getAccounts } from "../services/accounts.service";
import { transferMoney } from "../services/transactions.service";

type AccountOption = {
  account_id: number;
  account_number: string;
  full_name: string;
  status: string;
  balance: string;
};

export default function Transfer() {
  const [accounts, setAccounts] = useState<AccountOption[]>([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAccounts();
        setAccounts(data);
        if (data.length > 0) {
          setFromAccountId(String(data[0].account_id));
        }
      } catch (_err) {
        setError("Không thể tải danh sách tài khoản");
      } finally {
        setLoading(false);
      }
    };

    void loadAccounts();
  }, []);

  const selectedFrom = useMemo(
    () => accounts.find((item) => String(item.account_id) === fromAccountId),
    [accounts, fromAccountId]
  );

  const submitTransfer = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!fromAccountId || !toAccountId || !amount) {
      setError("Vui lòng nhập đủ thông tin chuyển tiền");
      return;
    }

    try {
      setSubmitting(true);
      await transferMoney({
        from_account_id: Number(fromAccountId),
        to_account_id: Number(toAccountId),
        amount: Number(amount),
      });

      setMessage("Chuyển tiền thành công");
      setToAccountId("");
      setAmount("");
    } catch (_err) {
      setError("Chuyển tiền thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 text-slate-900 md:p-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <nav className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <span>Transfers</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#002147]">Chuyển tiền nội bộ</span>
        </nav>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Chuyển tiền nội bộ</h2>
      </div>

      {loading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-800">
          Đang tải dữ liệu tài khoản...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>
      )}

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        </div>
      )}

      <form onSubmit={submitTransfer} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-950">
          <ArrowRightLeft className="h-5 w-5 text-[#002147]" />
          Thông tin chuyển tiền
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Tài khoản nguồn</label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
            >
              <option value="">Chọn tài khoản nguồn</option>
              {accounts.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.account_number} - {account.full_name} - {account.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Tài khoản nhận</label>
            <select
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
            >
              <option value="">Chọn tài khoản nhận</option>
              {accounts
                .filter((account) => String(account.account_id) !== fromAccountId)
                .map((account) => (
                  <option key={account.account_id} value={account.account_id}>
                    {account.account_number} - {account.full_name} - {account.status}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Số tiền</label>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#002147]"
              placeholder="Nhập số tiền"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            <p className="font-semibold">Số dư tài khoản nguồn</p>
            <p>{selectedFrom ? `${Number(selectedFrom.balance).toLocaleString("vi-VN")} VND` : "-"}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-5 py-3 text-sm font-bold text-white hover:bg-[#001936] disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Đang xử lý..." : "Chuyển tiền"}
          </button>
        </div>
      </form>
    </div>
  );
}
