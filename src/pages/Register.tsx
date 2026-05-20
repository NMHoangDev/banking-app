import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, saveAuth } from '../services/auth.service';

type Role = 'customer' | 'employee' | 'admin';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export default function RegisterPage() {
  const [fullName, setFullName] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [role, setRole] = useState<Role>('customer');
  const [agree, setAgree] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const passwordType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);
  const confirmPasswordType = useMemo(
    () => (showConfirmPassword ? 'text' : 'password'),
    [showConfirmPassword],
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!username.trim() || !password || !fullName.trim() || !dateOfBirth) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agree) {
      setError('Bạn cần đồng ý điều khoản sử dụng.');
      return;
    }

    try {
      setLoading(true);

      const data = await register({
        username: username.trim(),
        password,
        full_name: fullName.trim(),
        date_of_birth: dateOfBirth,
        gender,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
      });

      saveAuth(data);
      setMessage('Đăng ký thành công');

      // giữ route hiện tại: Dashboard nằm ở /dashboard
      navigate('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
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
              Trải nghiệm hệ thống ngân hàng bảo mật, tốc độ cao với các công cụ phân tích dữ liệu và
              quản lý dòng tiền chuyên sâu dành cho tổ chức và cá nhân.
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

          {error && (
            <div className="bg-error-container border-l-4 border-error p-4 rounded-lg mb-6 flex items-start gap-2">
              <span className="material-symbols-outlined text-error mt-0.5">error</span>
              <div>
                <h3 className="font-semibold text-sm text-on-error-container">Đăng ký thất bại</h3>
                <p className="text-body-sm text-on-error-container mt-1">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-tertiary-container border-l-4 border-tertiary p-4 rounded-lg mb-6 flex items-start gap-2">
              <span className="material-symbols-outlined text-tertiary mt-0.5">check_circle</span>
              <div>
                <h3 className="font-semibold text-sm text-on-tertiary-container">Thành công</h3>
                <p className="text-body-sm text-on-tertiary-container mt-1">{message}</p>
              </div>
            </div>
          )}

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
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="dateOfBirth">
                  Ngày sinh <span className="text-error">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  required
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="gender">
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0901234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="vana@example.com"
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
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="nguyenvana"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="address">
                  Địa chỉ
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 bg-surface border border-outline-variant rounded px-3 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Đà Nẵng"
                />
              </div>

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
                    className="w-full h-10 bg-surface border border-outline-variant rounded px-3 pr-10 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-on-surface"
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
                    className="w-full h-10 bg-surface border border-outline-variant rounded px-3 pr-10 outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-on-surface"
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
                  Mật khẩu cần tối thiểu 6 ký tự. Nên dùng kết hợp chữ hoa, chữ thường và số.
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
                className="w-full h-10 bg-primary hover:bg-on-primary-fixed-variant text-white font-medium rounded transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
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
