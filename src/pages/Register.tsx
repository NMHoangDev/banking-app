import React, { useMemo, useState } from 'react';

type Role = 'customer' | 'employee' | 'admin';

export default function RegisterPage() {
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [role, setRole] = useState<Role>('customer');
  const [agree, setAgree] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const passwordType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);
  const confirmPasswordType = useMemo(
    () => (showConfirmPassword ? 'text' : 'password'),
    [showConfirmPassword],
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: gọi API đăng ký ở đây
    // eslint-disable-next-line no-console
    console.log({
      fullName,
      phone,
      email,
      username,
      password,
      confirmPassword,
      role,
      agree,
    });
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex text-body-md">
      <div className="flex-1 hidden lg:flex flex-col relative bg-primary overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Financial illustration"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFhWlEG_Q_yOxu-lAMFIWYy40ME26gijABcEHFni1BVZoYvB4ZtVXo1982Yef4aZ_nPf4HPDTzSb9KsrfstPzmZUcc6iNBEaGj26a6y64Rsn_lfS4voAuINtVe0ZVEmgmfWJI3rl6bHYp3qlBIOPE9qWPbb8VV4C5LDmi-rOWvmeJr0j2nl0VXxJL7n8ZT6fEGh0kKGZRVK9xW_JG5RFO6jBIcMw2abXnI_9pwV7yqBHPA1EAgZwdsl87aZL-M6zjf9SGYoUwW5Hw"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-white">account_balance</span>
            <span className="font-display text-[28px] leading-[36px] text-white">BankDB System</span>
          </div>

          <div className="max-w-md">
            <h2 className="font-display text-[40px] leading-[48px] text-white mb-4">
              Nền tảng Quản lý Tài chính Doanh nghiệp
            </h2>
            <p className="text-[16px] leading-[24px] text-white opacity-80">
              Trải nghiệm hệ thống ngân hàng bảo mật, tốc độ cao với các công cụ phân tích dữ
              liệu và quản lý dòng tiền chuyên sâu dành cho tổ chức và cá nhân.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white opacity-60 text-body-sm">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Hệ thống đạt chuẩn bảo mật quốc tế ISO 27001</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center bg-surface-container-lowest relative">
        <div className="w-full max-w-[560px] mx-auto p-6 lg:p-10 h-full lg:h-auto overflow-y-auto">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[28px] text-primary">account_balance</span>
            <span className="font-display text-[28px] leading-[36px] text-primary">BankDB System</span>
          </div>

          <div className="mb-6">
            <h1 className="font-display text-[40px] leading-[48px] text-on-surface mb-1">
              Tạo tài khoản mới
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Đăng ký tài khoản để sử dụng hệ thống ngân hàng
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="fullName">
                  Họ và tên <span className="text-error">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 border border-outline-variant rounded bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-outline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="phone">
                  Số điện thoại <span className="text-error">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 border border-outline-variant rounded bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-outline"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="email">
                Email <span className="text-error">*</span>
              </label>
              <input
                id="email"
                name="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border border-outline-variant rounded bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-outline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="username">
                Tên đăng nhập <span className="text-error">*</span>
              </label>
              <input
                id="username"
                name="username"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-10 px-3 border border-outline-variant rounded bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-outline"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="password">
                  Mật khẩu <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    required
                    type={passwordType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 pr-10 border border-outline-variant rounded bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-outline"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="confirmPassword">
                  Xác nhận mật khẩu <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    type={confirmPasswordType}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 px-3 pr-10 border border-outline-variant rounded bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-body-md placeholder:text-outline"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded border border-surface-variant">
              <div className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary mt-0.5">info</span>
                <p className="text-body-sm text-on-surface-variant">
                  Mật khẩu cần tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                Loại tài khoản <span className="text-error">*</span>
              </label>

              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    name="role"
                    type="radio"
                    value="customer"
                    checked={role === 'customer'}
                    onChange={() => setRole('customer')}
                  />
                  <span className="text-body-md text-on-surface">Customer</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    name="role"
                    type="radio"
                    value="employee"
                    checked={role === 'employee'}
                    onChange={() => setRole('employee')}
                  />
                  <span className="text-body-md text-on-surface">Employee</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    className="w-4 h-4 text-primary focus:ring-primary border-outline"
                    name="role"
                    type="radio"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                  />
                  <span className="text-body-md text-on-surface">Admin</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 mt-1 text-primary focus:ring-primary border-outline rounded"
                  required
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-body-md text-on-surface-variant">
                  Tôi đã đọc và{' '}
                  <span className="text-primary font-medium cursor-pointer hover:underline">
                    Đồng ý điều khoản sử dụng
                  </span>{' '}
                  cùng chính sách bảo mật của hệ thống.
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                className="w-full h-10 bg-primary hover:bg-on-primary-fixed-variant text-white font-medium rounded transition-colors flex items-center justify-center gap-1.5"
                type="submit"
              >
                Đăng ký
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-body-md text-on-surface-variant">
                Đã có tài khoản?{' '}
                <a className="text-primary font-medium hover:underline" href="/login">
                  Đăng nhập
                </a>
              </p>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-outline-variant flex items-center justify-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="text-body-sm">Kết nối được bảo vệ bằng mã hóa SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
