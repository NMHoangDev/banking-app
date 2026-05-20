import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveAuth } from '../services/auth.service';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const passwordInputType = useMemo(
    () => (showPassword ? 'text' : 'password'),
    [showPassword],
  );

  const inputBorderClass = showError
    ? 'border-error focus:ring-error focus:border-error'
    : 'border-outline-variant focus:ring-primary focus:border-primary';
  const iconColorClass = showError ? 'text-error' : 'text-outline';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShowError(false);
    setMessage('');

    if (!username.trim() || !password) {
      setShowError(true);
      setMessage('Vui lòng nhập tên đăng nhập và mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      const data = await login({ username: username.trim(), password });
      saveAuth(data);

      // giữ route hiện tại: Dashboard nằm ở /dashboard
      navigate('/dashboard');
    } catch (err) {
      setShowError(true);
      const msg = err instanceof Error ? err.message : '';
      setMessage(msg || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] border border-white rounded-full" />
          <div className="absolute top-[15%] left-[25%] w-[300px] h-[300px] border border-white rounded-full" />
          <div className="absolute bottom-[20%] right-[10%] w-[200px] h-[200px] border-2 border-white rounded-full" />
          <div className="absolute top-[50%] left-[50%] w-[600px] h-[1px] bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <span className="material-symbols-outlined text-white text-[32px]">account_balance</span>
          <span className="font-display text-[28px] leading-[36px] text-white">BankDB System</span>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-6">
            <span className="material-symbols-outlined text-white text-[64px] mb-2 opacity-90">
              database
            </span>
          </div>
          <h1 className="font-display text-[40px] leading-[48px] text-white mb-4">
            Nền tảng Quản trị Dữ liệu Ngân hàng Chuyên sâu
          </h1>
          <p className="text-[16px] leading-[24px] text-primary-fixed-dim">
            Hệ thống cốt lõi đảm bảo an toàn giao dịch, toàn vẹn dữ liệu và tối ưu hóa quy trình
            nghiệp vụ cho tổ chức tài chính.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-body-sm text-primary-fixed-dim">
            © 2024 BankDB System. All rights reserved. Vận hành theo tiêu chuẩn bảo mật ISO 27001.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-surface-container-lowest p-6 sm:p-10 relative">
        <div className="lg:hidden absolute top-10 left-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">account_balance</span>
          <span className="font-display text-[22px] leading-[28px] text-primary">BankDB System</span>
        </div>

        <div className="w-full max-w-[440px] mt-12 lg:mt-0">
          <div className="mb-6">
            <h2 className="font-display text-[36px] leading-[44px] text-on-surface mb-1">
              Đăng nhập hệ thống
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Truy cập vào hệ thống quản lý nghiệp vụ ngân hàng
            </p>
          </div>

          {showError && (
            <div className="bg-error-container border-l-4 border-error p-4 rounded-lg mb-6 flex items-start gap-2">
              <span className="material-symbols-outlined text-error mt-0.5">error</span>
              <div>
                <h3 className="font-semibold text-sm text-on-error-container">Lỗi xác thực</h3>
                <p className="text-body-sm text-on-error-container mt-1">
                  {message || 'Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.'}
                </p>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block label-uppercase text-on-surface mb-1" htmlFor="username">
                Tên đăng nhập / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className={`material-symbols-outlined ${iconColorClass}`}>person</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={[
                    'block w-full pl-12 pr-4 py-2.5 bg-surface text-body-md text-on-surface border rounded-lg outline-none transition-shadow',
                    'focus:ring-2',
                    inputBorderClass,
                  ].join(' ')}
                />
              </div>
            </div>

            <div>
              <label className="block label-uppercase text-on-surface mb-1" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className={`material-symbols-outlined ${iconColorClass}`}>lock</span>
                </div>

                <input
                  id="password"
                  name="password"
                  type={passwordInputType}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={[
                    'block w-full pl-12 pr-12 py-2.5 bg-surface font-numeric text-body-md text-on-surface border rounded-lg outline-none transition-shadow',
                    'focus:ring-2',
                    inputBorderClass,
                  ].join(' ')}
                />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  <span className="material-symbols-outlined text-outline hover:text-on-surface transition-colors">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-primary border-outline-variant rounded focus:ring-primary focus:ring-2 bg-surface cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-body-sm text-on-surface cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <a
                className="text-sm font-medium text-primary hover:text-primary-container transition-colors"
                href="#"
              >
                Quên mật khẩu?
              </a>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={[
                  'w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-primary transition-all',
                  isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-110',
                ].join(' ')}
              >
                {isLoading && (
                  <span className="material-symbols-outlined animate-spin mr-2 text-[20px]">
                    progress_activity
                  </span>
                )}
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-body-sm text-on-surface-variant">
              Chưa có tài khoản?
              <a
                className="font-medium text-primary hover:text-primary-container transition-colors ml-1"
                href="/register"
              >
                Đăng ký ngay
              </a>
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-outline-variant flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
            <span className="text-body-sm text-secondary">
              Kết nối được bảo vệ bằng mã hóa SSL 256-bit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
