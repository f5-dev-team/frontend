// W-001: 사용자 회원가입 페이지

import { useState } from 'react';
import { Button, Field, Checkbox } from '../../components/ui';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isAgreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    console.log('회원가입 폼 제출 테스트 완료');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8">
        <h1 className="mb-6 text-2xl font-bold text-blue-600">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field
            id="signup-email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Field
            id="signup-password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Checkbox
            id="agreement"
            label="개인정보 수집 및 이용에 동의합니다."
            checked={isAgreed}
            onChange={(event) => setIsAgreed(event.target.checked)}
          />

          <Button type="submit">
            회원가입
          </Button>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;