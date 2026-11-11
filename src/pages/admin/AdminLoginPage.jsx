// A-000 관리자 로그인

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Field } from '../../components/ui';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError('');

    if (!adminId.trim() || !password) {
      setLoginError('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    // 실제 관리자 로그인 API 연동은 추후 진행 (지금은 바로 공고 관리로 이동)
    navigate('/admin/notices');
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
            label="아이디"
            placeholder="관리자 아이디"
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
            <Button type="submit">로그인</Button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default AdminLoginPage;
