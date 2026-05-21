import React, { useState, useMemo, useEffect } from "react";
import {
  CreditCard,
  Search,
  Plus,
  ChevronRight,
  Lock,
  Unlock,
  History,
  Eye,
  Download,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Sliders,
  DollarSign,
} from "lucide-react";
import { cn } from "../lib/utils";
import { getCards, createCard, updateCard } from "../services/cards.service";
import Modal from "../components/ui/Modal";

const initialCards = [
  {
    id: "4532 **** **** 8821",
    holder: "Nguyễn Văn Thành",
    type: "Credit Platinum",
    expiry: "12/28",
    limit: "200,000,000",
    used: "45,200,000",
    status: "Active",
    brand: "Visa",
    color: "bg-primary-container",
    linkedAccount: "1000000001",
  },
  {
    id: "5421 **** **** 0092",
    holder: "Lê Minh Hoàng",
    type: "Debit Gold",
    expiry: "05/26",
    limit: "500,000,000",
    used: "12,000,000",
    status: "Active",
    brand: "Mastercard",
    color: "bg-secondary-container",
    linkedAccount: "1000000003",
  },
  {
    id: "4921 **** **** 4432",
    holder: "Trần Thị Phương",
    type: "Credit Signature",
    expiry: "10/27",
    limit: "1,000,000,000",
    used: "850,000,000",
    status: "Blocked",
    brand: "Visa",
    color: "bg-error-container",
    linkedAccount: "1000000021",
  },
  {
    id: "3567 **** **** 1120",
    holder: "Vũ Anh Duy",
    type: "Credit Classic",
    expiry: "03/25",
    limit: "50,000,000",
    used: "5,000,000",
    status: "Active",
    brand: "JCB",
    color: "bg-tertiary-fixed",
    linkedAccount: "1000000002",
  },
];

const mockCardTxns: Record<string, any[]> = {
  "4532 **** **** 8821": [
    {
      merchant: "Starbucks Coffee",
      date: "Hôm nay, 08:30",
      amount: "125,000 VND",
      type: "Dining",
    },
    {
      merchant: "CGV Cinemas Cinema",
      date: "Hôm qua, 20:15",
      amount: "220,000 VND",
      type: "Entertainment",
    },
    {
      merchant: "Grab Ride VietNam",
      date: "15/10/2023",
      amount: "45,000 VND",
      type: "Transport",
    },
  ],
  "5421 **** **** 0092": [
    {
      merchant: "Lotte Mart Supermarket",
      date: "14/10/2023",
      amount: "1,540,000 VND",
      type: "Shopping",
    },
    {
      merchant: "Petrolimex Gas",
      date: "12/10/2023",
      amount: "500,000 VND",
      type: "Transport",
    },
  ],
  "4921 **** **** 4432": [
    {
      merchant: "Apple Store Online",
      date: "08/10/2023",
      amount: "32,990,000 VND",
      type: "Shopping",
    },
  ],
  "3567 **** **** 1120": [
    {
      merchant: "Spotify Premium",
      date: "01/10/2023",
      amount: "59,000 VND",
      type: "Entertainment",
    },
  ],
};

export default function Cards() {
  const [cards, setCards] = useState<any[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Lock/Unlock Confirmation Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cardToToggle, setCardToToggle] = useState<any>(null);

  // New card form state
  const [newCardAccount, setNewCardAccount] = useState("1000000001");
  const [newCardHolder, setNewCardHolder] = useState("Nguyễn Văn Thành");
  const [newCardType, setNewCardType] = useState("Credit Platinum");
  const [newCardBrand, setNewCardBrand] = useState("Visa");
  const [newCardLimit, setNewCardLimit] = useState("100,000,000");

  const filteredCards = useMemo(() => {
    return cards.filter(
      (card) =>
        card.holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id.includes(searchTerm),
    );
  }, [searchTerm, cards]);

  const handleOpenDetail = (card: any) => {
    setSelectedCard(card);
    setIsDetailModalOpen(true);
  };

  const handleOpenConfirmToggle = (card: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardToToggle(card);
    setIsConfirmModalOpen(true);
  };

  const executeToggleStatus = () => {
    if (!cardToToggle) return;
    const prev = cards;
    const nextStatus = cardToToggle.status === "Active" ? "Blocked" : "Active";
    // optimistic
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === cardToToggle.id ? { ...c, status: nextStatus } : c,
      ),
    );
    if (selectedCard && selectedCard.id === cardToToggle.id) {
      setSelectedCard((prev: any) => ({ ...prev, status: nextStatus }));
    }
    setIsConfirmModalOpen(false);

    const apiId = cardToToggle.apiId;
    updateCard(apiId, { status: nextStatus })
      .then(() => {
        // success - nothing to do
      })
      .catch((err) => {
        console.error("Failed to update card status", err);
        alert("Không thể thay đổi trạng thái thẻ, thử lại sau.");
        setCards(prev);
        if (selectedCard && selectedCard.id === cardToToggle.id)
          setSelectedCard(cardToToggle);
      });
    setCardToToggle(null);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    const lastDigits = Math.floor(1000 + Math.random() * 9000);
    const firstDigits =
      newCardBrand === "Visa"
        ? "4532"
        : newCardBrand === "Mastercard"
          ? "5421"
          : "3567";
    const generatedIdFull = `${firstDigits}${Math.floor(10000000 + Math.random() * 90000000)}`; // 16-digit
    const generatedId = `${firstDigits} **** **** ${lastDigits}`;
    const colors = [
      "bg-primary-container",
      "bg-secondary-container",
      "bg-error-container",
      "bg-tertiary-container",
    ];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const newCard = {
      apiId: undefined,
      id: generatedId,
      holder: newCardHolder,
      type: newCardType,
      expiry: "05/29",
      limit: newCardLimit,
      used: "0",
      status: "Active",
      brand: newCardBrand,
      color: chosenColor,
      linkedAccount: newCardAccount,
    };

    // Persist to API
    const payload = {
      card_number: generatedIdFull,
      card_type: newCardType,
      expiry_date: "2029-05-01",
      status: "ACTIVE",
      linked_account: newCardAccount,
    };
    createCard(payload)
      .then((created: any) => {
        const mapped = {
          apiId: created.card_id,
          id: generatedId,
          holder: created.holder_name || newCardHolder,
          type: created.card_type || newCardType,
          expiry: created.expiry_date
            ? new Date(created.expiry_date).toLocaleDateString("en-US", {
                month: "2-digit",
                year: "2-digit",
              })
            : "05/29",
          limit: newCardLimit,
          used: "0",
          status: created.status === "ACTIVE" ? "Active" : created.status,
          brand: newCardBrand,
          color: chosenColor,
          linkedAccount: created.linked_account || newCardAccount,
        };
        setCards((prev) => [mapped, ...prev]);
        setIsAddModalOpen(false);
        setNewCardLimit("100,000,000");
      })
      .catch((err) => {
        console.error("Failed to create card", err);
        alert("Không thể phát hành thẻ mới, thử lại sau.");
      });
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingCards(true);
      setCardsError(null);
      try {
        const rows = await getCards();
        if (!mounted) return;
        const mapped = rows.map((r: any) => ({
          apiId: r.card_id,
          id: `${String(r.card_number).slice(0, 4)} **** **** ${String(r.card_number).slice(-4)}`,
          holder: r.holder_name || "Chủ thẻ",
          type: r.card_type || "Card",
          expiry: r.expiry_date
            ? new Date(r.expiry_date).toLocaleDateString("en-US", {
                month: "2-digit",
                year: "2-digit",
              })
            : "-",
          limit: r.limit ? r.limit.toLocaleString() : "0",
          used: r.used ? r.used.toLocaleString() : "0",
          status: r.status === "ACTIVE" ? "Active" : r.status,
          brand: r.brand || "Visa",
          color: "bg-primary-container",
          linkedAccount: r.linked_account || "",
        }));
        setCards(mapped);
      } catch (err) {
        console.error("Failed to load cards", err);
        setCardsError("Không thể tải danh sách thẻ, hiển thị dữ liệu mẫu.");
        setCards(initialCards);
      } finally {
        setLoadingCards(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <nav className="flex text-[11px] font-bold text-on-surface-variant mb-2 gap-2 uppercase tracking-widest items-center">
            <span>Hệ thống</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Quản lý thẻ</span>
          </nav>
          <h2 className="font-display font-bold text-24 text-primary tracking-tight">
            Danh sách thẻ ngân hàng
          </h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#002147] hover:bg-[#001936] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Phát hành thẻ mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "TỔNG THẺ ĐANG CHẠY",
            value: cards.filter((c) => c.status === "Active").length,
            icon: <CreditCard className="w-5 h-5" />,
            color: "primary",
          },
          {
            label: "THẺ ĐÃ KHÓA",
            value: cards.filter((c) => c.status === "Blocked").length,
            icon: <Lock className="w-5 h-5" />,
            color: "error",
          },
          {
            label: "HẠN MỨC CẤP PHÁT",
            value: "1.75B",
            icon: <Sliders className="w-5 h-5" />,
            color: "secondary",
          },
          {
            label: "YÊU CẦU PHÁT HÀNH",
            value: "3",
            icon: <ShieldCheck className="w-5 h-5" />,
            color: "tertiary",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between"
          >
            <div
              className={cn(
                "p-2.5 rounded-xl w-fit mb-4",
                `bg-${stat.color}-container text-on-${stat.color}-container`,
              )}
            >
              {stat.icon}
            </div>
            <div>
              <p className="label-uppercase text-on-surface-variant mb-1">
                {stat.label}
              </p>
              <p className="font-display font-bold text-2xl text-primary">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 flex flex-wrap items-center gap-4 border-b border-outline-variant bg-surface-container-low/30">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              placeholder="Tìm kiếm số thẻ, chủ thẻ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-surface border border-outline-variant p-2 rounded-lg hover:bg-surface-container-low transition-all">
              <Download className="w-4 h-4 text-outline" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thông tin thẻ</th>
                <th>Chủ thẻ</th>
                <th>Phân loại / TK liên kết</th>
                <th>Hạn mức chi tiêu (VND)</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card, i) => (
                <tr key={card.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-6 rounded shrink-0 flex flex-col justify-between p-1 text-[7px] text-white font-bold shadow-sm",
                          card.color,
                        )}
                      >
                        <div className="flex justify-between items-start leading-none">
                          <div className="w-2 h-1.5 bg-yellow-400/80 rounded-sm"></div>
                          <span className="opacity-70">{card.brand}</span>
                        </div>
                        <div className="leading-none text-[5px] truncate uppercase tracking-tighter">
                          **** {card.id.split(" ").pop()}
                        </div>
                      </div>
                      <div>
                        <p className="font-numeric-data text-primary text-xs font-bold tracking-wider">
                          {card.id}
                        </p>
                        <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">
                          Hạn: {card.expiry}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-bold text-sm text-on-surface">
                      {card.holder}
                    </span>
                  </td>
                  <td>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase">
                      {card.type}
                    </p>
                    <p className="text-[9px] text-outline font-mono font-bold">
                      TK: {card.linkedAccount}
                    </p>
                  </td>
                  <td>
                    <div className="space-y-1 max-w-[120px]">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-primary">{card.used}</span>
                        <span className="text-outline">{card.limit}</span>
                      </div>
                      <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full",
                            parseInt(card.used.replace(/,/g, "")) /
                              parseInt(card.limit.replace(/,/g, "")) >
                              0.8
                              ? "bg-error"
                              : "bg-primary",
                          )}
                          style={{
                            width: `${Math.min(100, (parseInt(card.used.replace(/,/g, "")) / parseInt(card.limit.replace(/,/g, ""))) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        card.status === "Active"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-error-container text-on-error-container",
                      )}
                    >
                      {card.status === "Active" ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleOpenDetail(card)}
                        className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-primary"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleOpenConfirmToggle(card, e)}
                        className={cn(
                          "p-1.5 rounded transition-colors",
                          card.status === "Active"
                            ? "hover:bg-red-50 text-red-600 hover:text-red-700"
                            : "hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700",
                        )}
                        title={
                          card.status === "Active" ? "Khóa thẻ" : "Mở khóa"
                        }
                      >
                        {card.status === "Active" ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCards.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-outline font-medium"
                  >
                    Không tìm thấy thẻ phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Card Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Phát hành thẻ mới"
      >
        <form onSubmit={handleCreateCard} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">
              Chọn tài khoản liên kết
            </label>
            <select
              value={newCardAccount}
              onChange={(e) => setNewCardAccount(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="1000000001">
                1000000001 - Nguyễn Văn Thành ( saving )
              </option>
              <option value="1000000003">
                1000000003 - Lê Minh Hoàng ( payment )
              </option>
              <option value="1000000021">
                1000000021 - Trần Thị Phương ( locked )
              </option>
              <option value="1000000002">
                1000000002 - Vũ Anh Duy ( personal )
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">
              Họ & Tên chủ thẻ
            </label>
            <input
              type="text"
              required
              value={newCardHolder}
              onChange={(e) => setNewCardHolder(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Nhập tên in trên thẻ..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                Hạng & Loại Thẻ
              </label>
              <select
                value={newCardType}
                onChange={(e) => setNewCardType(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Credit Platinum">Credit Platinum</option>
                <option value="Credit Signature">Credit Signature</option>
                <option value="Credit Classic">Credit Classic</option>
                <option value="Debit Gold">Debit Gold</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-on-surface-variant">
                Tổ chức thẻ (Brand)
              </label>
              <select
                value={newCardBrand}
                onChange={(e) => setNewCardBrand(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="JCB">JCB</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-on-surface-variant">
              Hạn mức tín dụng cấp phát (VND)
            </label>
            <input
              type="text"
              required
              value={newCardLimit}
              onChange={(e) => setNewCardLimit(e.target.value)}
              placeholder="Nhập hạn mức..."
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm font-bold bg-[#002147] text-white shadow-sm hover:shadow-lg transition-all active:scale-95"
            >
              Xác nhận phát hành
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Lock/Unlock Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Xác nhận thay đổi trạng thái"
      >
        {cardToToggle && (
          <div className="p-6 space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 items-start">
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#002147]">
                  Bạn chắc chắn muốn{" "}
                  {cardToToggle.status === "Active" ? "KHÓA" : "MỞ KHÓA"} thẻ
                  này?
                </p>
                <p className="text-xs text-on-surface-variant mt-1.5">
                  Thẻ:{" "}
                  <strong className="font-mono text-primary">
                    {cardToToggle.id}
                  </strong>{" "}
                  <br />
                  Chủ thẻ: <strong>{cardToToggle.holder}</strong>
                </p>
                <p className="text-[11px] text-red-700 mt-2 italic">
                  *{" "}
                  {cardToToggle.status === "Active"
                    ? "Khi bị khóa, tất cả các giao dịch trực tuyến và rút tiền ATM qua thẻ này sẽ bị đình chỉ ngay lập tức."
                    : "Sau khi mở khóa, chủ thẻ có thể giao dịch lại bình thường."}
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setCardToToggle(null);
                }}
                className="px-6 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeToggleStatus}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-bold text-white shadow-sm hover:shadow-lg transition-all active:scale-95",
                  cardToToggle.status === "Active"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700",
                )}
              >
                Đồng ý{" "}
                {cardToToggle.status === "Active" ? "Khóa thẻ" : "Mở khóa"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Thông tin thẻ chi tiết"
        maxWidth="lg"
      >
        {selectedCard && (
          <div className="p-6 space-y-6">
            <div className="flex justify-center p-6 bg-surface-container-low rounded-3xl border border-outline-variant relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              <div
                className={cn(
                  "w-80 h-48 rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl relative z-10 transition-transform hover:scale-[1.02] border border-white/10",
                  selectedCard.color,
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="w-10 h-8 bg-yellow-400/80 rounded shadow-inner flex items-center justify-center font-bold text-primary/40 text-xs">
                    CHIP
                  </div>
                  <span className="font-display font-bold italic text-white/80 text-lg tracking-wider">
                    {selectedCard.brand}
                  </span>
                </div>
                <div>
                  <p className="font-numeric-data text-xl tracking-[0.2em] shadow-sm mb-4 text-center">
                    {selectedCard.id}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] uppercase opacity-60 mb-0.5 tracking-widest">
                        Card Holder
                      </p>
                      <p className="text-xs font-bold uppercase truncate max-w-[150px]">
                        {selectedCard.holder}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] uppercase opacity-60 mb-0.5 tracking-widest">
                        Expires
                      </p>
                      <p className="text-xs font-bold">{selectedCard.expiry}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-surface border border-outline-variant/30 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] font-bold text-outline uppercase tracking-wider">
                  Hạn mức chi tiêu
                </span>
                <span className="text-sm font-bold text-primary mt-1">
                  {selectedCard.limit} VND
                </span>
              </div>
              <div className="p-3.5 bg-surface border border-outline-variant/30 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] font-bold text-outline uppercase tracking-wider">
                  Tài khoản liên kết
                </span>
                <span className="text-sm font-bold text-[#002147] mt-1 font-mono">
                  {selectedCard.linkedAccount}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-xs font-bold">Khóa thẻ tạm thời</p>
                    <p className="text-[9px] text-outline">
                      Bảo vệ thẻ khi chưa có nhu cầu sử dụng
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    setIsDetailModalOpen(false);
                    handleOpenConfirmToggle(selectedCard, e);
                  }}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold rounded-lg uppercase",
                    selectedCard.status === "Active"
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                  )}
                >
                  {selectedCard.status === "Active" ? "Khóa" : "Kích hoạt"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-outline" />
                  <div>
                    <p className="text-xs font-bold">
                      Thanh toán trực tuyến (E-commerce)
                    </p>
                    <p className="text-[9px] text-outline">
                      Cho phép giao dịch trực tuyến qua Internet
                    </p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-[#002147] rounded-full p-0.5 flex justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Recent Card Transactions */}
            <div className="border-t border-outline-variant pt-4">
              <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                <History className="w-4 h-4" /> Lịch sử giao dịch qua thẻ gần
                đây
              </h5>
              <div className="space-y-2">
                {(mockCardTxns[selectedCard.id] || []).map((txn, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2.5 hover:bg-surface-container-low rounded-xl border border-outline-variant/20 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#002147]">
                        {txn.merchant}
                      </p>
                      <p className="text-[9px] text-outline">
                        {txn.date} • {txn.type}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-red-600">
                      -{txn.amount}
                    </span>
                  </div>
                ))}
                {(!mockCardTxns[selectedCard.id] ||
                  mockCardTxns[selectedCard.id].length === 0) && (
                  <p className="text-xs text-outline italic text-center py-4">
                    Chưa có giao dịch nào qua thẻ này
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="w-full py-2.5 bg-[#002147] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#001936] transition-all"
            >
              Đóng chi tiết
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
