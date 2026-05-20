import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowRightLeft,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Globe,
  Headphones,
  Landmark,
  LockKeyhole,
  LogIn,
  Menu,
  ReceiptText,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { cn } from '../lib/utils';

type NavItem = {
  id: string;
  label: string;
  href: string;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: React.ElementType;
};

type StatItem = {
  label: string;
  value: string;
  hint: string;
  icon: React.ElementType;
};

type MiniTxn = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  status: 'COMPLETED' | 'PENDING';
};

const PRIMARY = '#002147';

const navItems: NavItem[] = [
  { id: 'home', label: 'Trang chủ', href: '#home' },
  { id: 'features', label: 'Tính năng', href: '#features' },
  { id: 'services', label: 'Dịch vụ', href: '#services' },
  { id: 'security', label: 'Bảo mật', href: '#security' },
  { id: 'support', label: 'Hỗ trợ', href: '#support' },
];

const features: FeatureItem[] = [
  {
    title: 'Quản lý khách hàng',
    description:
      'Tổng quan hồ sơ, phân loại, trạng thái và lịch sử tương tác theo mô hình Customer 360.',
    icon: Users,
  },
  {
    title: 'Quản lý tài khoản',
    description:
      'Theo dõi số dư, trạng thái, loại tài khoản và liên kết khách hàng trên một giao diện thống nhất.',
    icon: Wallet,
  },
  {
    title: 'Chuyển tiền',
    description:
      'Giao dịch chuyển tiền nội bộ nhanh, kiểm soát điều kiện và đối soát rõ ràng theo chuẩn ngân hàng.',
    icon: ArrowRightLeft,
  },
  {
    title: 'Lịch sử giao dịch',
    description:
      'Tra cứu giao dịch chi tiết, lọc theo thời gian và trạng thái, hỗ trợ kiểm toán và truy vết.',
    icon: ReceiptText,
  },
  {
    title: 'Người thụ hưởng',
    description:
      'Lưu danh bạ thụ hưởng, giảm sai sót nhập liệu và tăng tốc thao tác chuyển tiền.',
    icon: Building2,
  },
  {
    title: 'Dashboard phân tích',
    description:
      'Báo cáo KPI, xu hướng giao dịch và cảnh báo rủi ro giúp điều hành ra quyết định nhanh.',
    icon: BarChart3,
  },
];

const securityBullets: { title: string; detail: string }[] = [
  { title: 'JWT Authentication', detail: 'Phiên đăng nhập an toàn, dễ mở rộng và tích hợp.' },
  { title: 'Transaction Verification', detail: 'Ràng buộc điều kiện giao dịch, hạn chế sai lệch.' },
  { title: 'Role-based Access', detail: 'Phân quyền theo vai trò, giảm rủi ro thao tác nhầm.' },
  { title: 'PostgreSQL Transaction Safety', detail: 'BEGIN/COMMIT/ROLLBACK, khóa dòng khi cần.' },
  { title: 'Audit Logs', detail: 'Ghi nhận hành động quan trọng để hỗ trợ kiểm toán.' },
  { title: 'Encryption', detail: 'Mã hóa dữ liệu nhạy cảm trong kênh truyền và lưu trữ.' },
];

const kpiStats: StatItem[] = [
  { label: 'Transactions', value: '1M+', hint: 'Xử lý giao dịch mỗi tháng', icon: ReceiptText },
  { label: 'Customers', value: '50K+', hint: 'Hồ sơ khách hàng hoạt động', icon: Users },
  { label: 'Uptime', value: '99.99%', hint: 'Độ ổn định vận hành', icon: ShieldCheck },
  { label: 'Support', value: '24/7', hint: 'Hỗ trợ liên tục', icon: Headphones },
];

const heroMiniTxns: MiniTxn[] = [
  {
    id: 'TXN-90214',
    title: 'Chuyển tiền nội bộ',
    subtitle: 'Từ 1000000001 đến 1000000010',
    amount: '-25,000,000 VND',
    status: 'COMPLETED',
  },
  {
    id: 'TXN-90215',
    title: 'Thanh toán hóa đơn',
    subtitle: 'Internet doanh nghiệp',
    amount: '-320,000 VND',
    status: 'PENDING',
  },
  {
    id: 'TXN-90216',
    title: 'Nạp tiền',
    subtitle: 'Tài khoản thanh toán',
    amount: '+10,000,000 VND',
    status: 'COMPLETED',
  },
];

function NavLink({
  item,
  activeId,
  onClick,
}: {
  item: NavItem;
  activeId: string;
  onClick: () => void;
}) {
  const isActive = activeId === item.id;

  return (
    <a
      href={item.href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-xl px-3 py-2 text-sm font-bold transition',
        isActive
          ? 'bg-blue-50 text-[#002147]'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.label}
    </a>
  );
}

function SectionTitle({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{kicker}</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem['id']>('home');

  const sectionIds = useMemo(() => navItems.map((x) => x.id), []);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        if (visible[0]?.target?.id) {
          setActiveNav(visible[0].target.id as NavItem['id']);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: [0.05, 0.1, 0.2, 0.35],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-6">
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#002147]">
              <Landmark className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-black tracking-tight text-slate-950">BankDB System</p>
              <p className="text-xs font-semibold text-slate-500">Banking App</p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                activeId={activeNav}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Globe className="h-4 w-4" />
              VI
            </button>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <LogIn className="h-4 w-4" />
              Đăng nhập
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#002147] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#001936]"
            >
              <UserPlus className="h-4 w-4" />
              Đăng ký
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="mx-auto max-w-7xl space-y-2 px-4 py-4 md:px-6">
              <div className="grid grid-cols-1 gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveNav(item.id);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm font-bold transition',
                      activeNav === item.id
                        ? 'bg-blue-50 text-[#002147]'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Globe className="h-4 w-4" />
                  VI
                </button>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#001936]"
                >
                  <UserPlus className="h-4 w-4" />
                  Đăng ký
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden pt-[96px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute right-[-120px] top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute left-1/2 top-[380px] h-72 w-72 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-slate-50 to-slate-50" />
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-14 md:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-700 shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-[#002147]" />
              Secure Digital Banking
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl lg:text-5xl">
              Nền tảng ngân hàng số hiện đại
            </h1>

            <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
              Quản lý khách hàng, tài khoản, chuyển tiền và lịch sử giao dịch trên một hệ thống
              thống nhất. Kiến trúc hướng doanh nghiệp, ưu tiên bảo mật, truy vết và an toàn giao
              dịch.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#001936] hover:shadow-md"
              >
                Bắt đầu ngay
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Xem tính năng
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Bảo mật
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">Chuẩn enterprise</p>
                <p className="mt-1 text-xs text-slate-500">Phân quyền, kiểm toán, xác thực</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Tốc độ
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">Giao dịch nhanh</p>
                <p className="mt-1 text-xs text-slate-500">Tối ưu luồng xử lý và truy vấn</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Tin cậy
                </p>
                <p className="mt-2 text-sm font-bold text-slate-950">An toàn dữ liệu</p>
                <p className="mt-1 text-xs text-slate-500">Transaction DB và ràng buộc</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-white/60 via-blue-50/40 to-indigo-50/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/70 shadow-sm backdrop-blur transition hover:shadow-md">
              <div className="border-b border-slate-200 bg-white/70 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Banking Dashboard
                    </p>
                    <p className="mt-1 text-lg font-black tracking-tight text-slate-950">
                      Tổng quan hệ thống
                    </p>
                  </div>
                  <div className="rounded-2xl bg-blue-50 p-3 text-[#002147]">
                    <CircleDollarSign className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Total Balance
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-950">1,245,800,000</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">VND</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Transactions
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-950">12,841</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">30 ngày gần nhất</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Active Accounts
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-950">2,034</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Đang hoạt động</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <p className="text-sm font-black text-slate-950">Giao dịch gần đây</p>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-[#002147]">
                      LIVE
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {heroMiniTxns.map((txn) => (
                      <div key={txn.id} className="flex items-start justify-between px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-950">{txn.title}</p>
                          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                            {txn.subtitle}
                          </p>
                          <p className="mt-1 font-mono text-[11px] font-bold text-slate-400">
                            {txn.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-950">{txn.amount}</p>
                          <span
                            className={cn(
                              'mt-1 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-black',
                              txn.status === 'COMPLETED'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                            )}
                          >
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl bg-white p-3 text-[#002147] shadow-sm">
                        <LockKeyhole className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-950">Bảo vệ giao dịch</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Kiểm tra trạng thái và số dư trước khi xử lý
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-2xl bg-white p-3 text-[#002147] shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-950">Truy vết & kiểm toán</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Nhật ký hành động và lịch sử giao dịch rõ ràng
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            kicker="Tính năng"
            title="Bộ công cụ vận hành ngân hàng số"
            description="Thiết kế theo phong cách admin banking hiện đại, tối ưu thao tác, hỗ trợ kiểm soát và vận hành ở quy mô lớn."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-blue-50 p-3 text-[#002147] transition group-hover:bg-[#002147] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-black text-slate-600">
                      BankDB
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{feature.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#002147]">
                    Xem chi tiết
                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Dịch vụ
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                Trải nghiệm internet banking theo chuẩn quản trị
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
                Tập trung vào luồng nghiệp vụ cốt lõi: quản lý khách hàng, quản lý tài khoản, chuyển
                tiền và giám sát giao dịch. Giao diện tối giản, rõ ràng, giúp nhân sự vận hành thao
                tác nhanh và chính xác.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { title: 'Quy trình rõ ràng', icon: CheckCircle2, desc: 'Luồng nghiệp vụ có xác thực và kiểm tra.' },
                  { title: 'Dễ mở rộng', icon: Building2, desc: 'Thêm module mới mà không phá kiến trúc.' },
                  { title: 'Chuẩn hóa dữ liệu', icon: ShieldCheck, desc: 'Đồng bộ field, trạng thái và truy vết.' },
                  { title: 'Hiệu năng ổn định', icon: CircleDollarSign, desc: 'Tối ưu truy vấn và transaction.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-2xl bg-white p-3 text-[#002147] shadow-sm">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-black text-slate-950">{item.title}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="absolute -right-28 -top-20 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
              <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      Gói dịch vụ đề xuất
                    </p>
                    <p className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Enterprise Operations
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Dành cho hệ thống vận hành ngân hàng số nội bộ hoặc mô phỏng nghiệp vụ đầy đủ.
                    </p>
                  </div>
                  <span className="rounded-2xl bg-blue-50 p-3 text-[#002147]">
                    <Landmark className="h-5 w-5" />
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    'Quản lý khách hàng và hồ sơ định danh',
                    'Quản lý tài khoản và loại tài khoản',
                    'Chuyển tiền với kiểm soát trạng thái và số dư',
                    'Lịch sử giao dịch và đối soát trạng thái',
                    'Báo cáo và dashboard KPI vận hành',
                    'Tích hợp log kiểm toán theo module',
                  ].map((text) => (
                    <div
                      key={text}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur"
                    >
                      <span className="mt-0.5 rounded-full bg-emerald-50 p-1.5 text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-slate-700">{text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#001936]"
                  >
                    Dùng thử ngay
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#support"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                  >
                    Liên hệ hỗ trợ
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            kicker="Bảo mật"
            title="Vận hành an toàn theo chuẩn giao dịch"
            description="Thiết kế ưu tiên an toàn dữ liệu và kiểm soát giao dịch. Mọi thao tác quan trọng đều có thể truy vết và mở rộng cơ chế xác thực."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-3xl bg-blue-50 p-4 text-[#002147]">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    Security-first Architecture
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Kết hợp xác thực, phân quyền, transaction database và audit log để đảm bảo an
                    toàn và tính toàn vẹn khi xử lý nghiệp vụ.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {securityBullets.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-full bg-white p-1.5 text-[#002147] shadow-sm">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-950">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Chính sách vận hành
              </p>
              <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
                Kiểm soát rủi ro và minh bạch giao dịch
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Các lớp kiểm soát giúp hạn chế sai lệch, giảm lỗi thao tác và tăng khả năng giám sát
                theo thời gian thực.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    icon: LockKeyhole,
                    title: 'Xác thực & phân quyền',
                    desc: 'Giới hạn quyền thao tác theo vai trò và ngữ cảnh vận hành.',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'An toàn giao dịch',
                    desc: 'Khóa dòng tài khoản khi chuyển tiền, đảm bảo tính nhất quán số dư.',
                  },
                  {
                    icon: ReceiptText,
                    title: 'Đối soát trạng thái',
                    desc: 'Trạng thái PENDING/COMPLETED rõ ràng, dễ truy vết và báo cáo.',
                  },
                  {
                    icon: BarChart3,
                    title: 'Giám sát KPI',
                    desc: 'Theo dõi tăng trưởng, cảnh báo bất thường và xu hướng giao dịch.',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
                    >
                      <span className="rounded-2xl bg-white p-3 text-[#002147] shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-950">{item.title}</p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle
            kicker="Thống kê"
            title="Chỉ số vận hành nổi bật"
            description="Các KPI dưới đây là số liệu mô phỏng nhằm thể hiện định hướng hệ thống theo mô hình internet banking/admin banking."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpiStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-blue-50 p-3 text-[#002147] transition group-hover:bg-[#002147] group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-600">
                      KPI
                    </span>
                  </div>
                  <p className="mt-5 text-3xl font-black tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-900">{stat.label}</p>
                  <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{stat.hint}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div
            className="relative overflow-hidden rounded-[32px] border border-slate-200 p-8 shadow-sm md:p-12"
            style={{ backgroundColor: PRIMARY }}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  BankDB System
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white md:text-3xl">
                  Sẵn sàng trải nghiệm ngân hàng số?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
                  Tạo tài khoản để bắt đầu khám phá các module quản trị: Customers, Accounts,
                  Transfer, Transactions và Dashboard theo chuẩn internet banking.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#002147] shadow-sm transition hover:shadow-md"
                >
                  <UserPlus className="h-4 w-4" />
                  Đăng ký
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Hỗ trợ
                </p>
                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
                  Cần hỗ trợ triển khai hoặc vận hành?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Liên hệ đội ngũ kỹ thuật để được tư vấn cấu hình hệ thống, database và quy trình
                  nghiệp vụ.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:w-auto sm:grid-cols-2">
                <a
                  href="#support"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <Headphones className="h-4 w-4 text-[#002147]" />
                  Tạo yêu cầu
                </a>
                <a
                  href="#support"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#002147] px-4 py-3 text-sm font-black text-white transition hover:bg-[#001936]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Tài liệu bảo mật
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#002147]">
                  <Landmark className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-black tracking-tight text-slate-950">BankDB System</p>
                  <p className="text-xs font-semibold text-slate-500">Banking App</p>
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-500">
                Hệ thống ngân hàng số mô phỏng theo phong cách enterprise, tập trung vào vận hành,
                bảo mật và an toàn giao dịch trên PostgreSQL.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-black text-slate-950">Quick Links</p>
              <div className="grid grid-cols-1 gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-black text-slate-950">Dịch vụ</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Quản trị khách hàng',
                  'Quản trị tài khoản',
                  'Chuyển tiền nội bộ',
                  'Theo dõi giao dịch',
                  'Báo cáo KPI',
                ].map((text) => (
                  <p key={text} className="text-sm font-semibold text-slate-600">
                    {text}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-black text-slate-950">Contact</p>
              <div className="space-y-2 text-sm font-semibold text-slate-600">
                <p className="inline-flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-[#002147]" />
                  Hỗ trợ kỹ thuật 24/7
                </p>
                <p className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#002147]" />
                  Security & Compliance
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 md:flex-row md:items-center">
            <p className="text-xs font-semibold text-slate-500">
              © {new Date().getFullYear()} BankDB System. All rights reserved.
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Primary color: <span className="font-mono">{PRIMARY}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
