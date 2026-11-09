// W-002: 사용자 로그인 페이지

import { useState } from 'react';
import { Button, Field } from '../../components/ui';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('입력한 이메일:', email);
    console.log('비밀번호 입력 여부:', password.length > 0);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8">
        <h1 className="mb-6 text-2xl font-bold text-blue-600">
          로그인
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field
            id="email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Field
            id="password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button type="submit">
            로그인
          </Button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;