
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Field } from '../../components/ui';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginError('');

    if (!email.trim() || !password) {
      setLoginError('이메일과 비밀번호를 입력해 주세요.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setLoginError('올바른 이메일 형식을 입력해 주세요.');
      return;
    }

    // 실제 로그인 API 연동은 추후 진행
    console.log('입력한 이메일:', email);
    console.log('비밀번호 입력 여부:', password.length > 0);
    console.log('로그인 상태 유지:', isRemembered);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full min-w-0 max-w-5xl grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:gap-10">
        {/* 로그인 카드 */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10">
          <h1 className="text-2xl font-bold text-gray-900">
            로그인
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            가입한 이메일로 로그인해 주세요.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-5"
          >
            <Field
              id="email"
              label="이메일"
              type="email"
              placeholder="student@gachon.ac.kr"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setLoginError('');
              }}
            />

            <Field
              id="password"
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

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isRemembered}
                onChange={(event) =>
                  setIsRemembered(event.target.checked)
                }
                className="h-4 w-4 accent-blue-700"
              />
              로그인 상태 유지
            </label>

            {loginError && (
              <p
                role="alert"
                className="text-sm text-red-600"
              >
                {loginError}
              </p>
            )}

            <div className="[&>button]:w-full">
              <Button type="submit">로그인</Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-gray-500">
                비밀번호 찾기 (준비 중)
              </span>
              <span className="text-gray-300">|</span>
              <Link
                to="/signup"
                className="font-semibold text-blue-700 hover:underline"
              >
                회원가입
              </Link>
            </div>
          </form>
        </section>

        {/* 장학금 안내 카드 */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold leading-relaxed text-gray-900">
            받을 수 있는 장학금과
            <br />
            앞으로 준비할 조건을 함께 알려드려요
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4">
              <span className="rounded-md bg-blue-700 px-3 py-2 text-xs font-bold text-white">
                즉시신청
              </span>
              <p className="text-sm text-gray-700">
                지금 바로 신청할 수 있는 장학금
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4">
              <span className="rounded-md bg-orange-600 px-3 py-2 text-xs font-bold text-white">
                요건부족
              </span>
              <p className="text-sm text-gray-700">
                봉사시간 10시간 부족 (30h / 40h)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4">
              <span className="rounded-md bg-gray-600 px-3 py-2 text-xs font-bold text-white">
                신청불가
              </span>
              <p className="text-sm text-gray-700">
                학년·학과처럼 바꿀 수 없는 조건이 맞지 않는 장학금
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            모든 판정에는 공고 원문 근거와 출처가 함께 제공돼요.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default LoginPage;
