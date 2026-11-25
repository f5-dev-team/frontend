// A-000 관리자 로그인

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Field } from '../../components/ui';
import { adminLogin } from '../../api';
import useAuthStore from '../../store/useAuthStore';
import { getErrorMessage } from '../../utils/format';

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');

    if (!adminId.trim() || !password) {
      setLoginError('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    // API-012 관리자 로그인 (Mock: admin@gachon.ac.kr / Admin1234!)
    setIsSubmitting(true);
    try {
      const session = await adminLogin({ email: adminId.trim(), password });
      setSession(session);
      navigate(location.state?.from ?? '/admin/notices', { replace: true });
    } catch (error) {
      setLoginError(getErrorMessage(error, '로그인하지 못했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 sm:p-10">
        <h1 className="text-2xl font-bold text-blue-600">
          성실한두반장 관리자
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          관리자 계정으로 로그인해 주세요.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <Field
            id="adminId"
            label="이메일"
            type="email"
            autoComplete="username"
            placeholder="admin@gachon.ac.kr"
            required
            value={adminId}
            onChange={(event) => {
              setAdminId(event.target.value);
              setLoginError('');
            }}
          />

          <Field
            id="adminPassword"
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setLoginError('');
            }}
          />

          {loginError && (
            <p role="alert" className="text-sm text-red-600">
              {loginError}
            </p>
          )}

          <div className="[&>button]:w-full">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;
