
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Field } from '../../components/ui';

const terms = [
  {
    id: 'service',
    label: '[필수] 서비스 이용약관',
    required: true,
    content:
      '서비스 이용약관 전문은 추후 확정된 약관 문서로 연결됩니다.',
  },
  {
    id: 'privacy',
    label: '[필수] 개인정보 수집·이용',
    required: true,
    content:
      '개인정보 수집 및 이용 약관 전문은 추후 확정된 약관 문서로 연결됩니다.',
  },
  {
    id: 'marketing',
    label: '[선택] 장학금 알림 수신',
    required: false,
    content:
      '장학금 알림 수신 동의 안내는 추후 확정된 약관 문서로 연결됩니다.',
  },
];

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  const [signupError, setSignupError] = useState('');
  const [signupNotice, setSignupNotice] = useState('');
  const [activeTerm, setActiveTerm] = useState(null);

  const allAgreed = Object.values(agreements).every(Boolean);

  const clearMessages = () => {
    setSignupError('');
    setSignupNotice('');
  };

  const handleAllAgreement = (checked) => {
    setAgreements({
      service: checked,
      privacy: checked,
      marketing: checked,
    });
    clearMessages();
  };

  const handleAgreement = (id, checked) => {
    setAgreements((previous) => ({
      ...previous,
      [id]: checked,
    }));
    clearMessages();
  };

  const handleDuplicateCheck = () => {
    clearMessages();

    if (!email.trim()) {
      setSignupError('이메일을 입력해 주세요.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setSignupError('올바른 이메일 형식을 입력해 주세요.');
      return;
    }

    setSignupNotice(
      '이메일 중복 확인 기능은 API 연동 후 이용할 수 있습니다.'
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearMessages();

    if (
      !email.trim() ||
      !password ||
      !passwordConfirm ||
      !nickname.trim()
    ) {
      setSignupError('모든 필수 항목을 입력해 주세요.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setSignupError('올바른 이메일 형식을 입력해 주세요.');
      return;
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setSignupError(
        '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.'
      );
      return;
    }

    if (password !== passwordConfirm) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreements.service || !agreements.privacy) {
      setSignupError('필수 약관에 모두 동의해 주세요.');
      return;
    }

    setSignupNotice(
      '입력 항목 검사가 완료되었습니다. 실제 회원가입은 API 연동 후 가능합니다.'
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-2">
        {/* 회원가입 카드 */}
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            회원가입
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            이메일로 가입하고, 학적 정보는 다음 단계에서 입력해요.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 flex flex-col gap-5"
          >
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                이메일
              </label>

              <div className="flex min-w-0 gap-2">
                <input
                  id="signup-email"
                  type="email"
                  placeholder="student@gachon.ac.kr"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearMessages();
                  }}
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={handleDuplicateCheck}
                  className="shrink-0 rounded-lg border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                >
                  중복 확인
                </button>
              </div>
            </div>

            <div>
              <Field
                id="signup-password"
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearMessages();
                }}
              />
              <p className="mt-2 text-xs text-gray-500">
                영문, 숫자, 특수문자를 포함해 8자 이상
              </p>
            </div>

            <Field
              id="signup-password-confirm"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              required
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                clearMessages();
              }}
            />

            <Field
              id="signup-nickname"
              label="닉네임"
              type="text"
              placeholder="닉네임을 입력하세요"
              required
              value={nickname}
              onChange={(event) => {
                setNickname(event.target.value);
                clearMessages();
              }}
            />

            {/* 약관 동의 */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-center gap-2 border-b border-gray-200 pb-3 text-sm font-semibold text-gray-900">
                <input
                  type="checkbox"
                  checked={allAgreed}
                  onChange={(event) =>
                    handleAllAgreement(event.target.checked)
                  }
                  className="h-4 w-4 accent-blue-700"
                />
                전체 동의
              </label>

              <div className="mt-3 space-y-3">
                {terms.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <label className="flex min-w-0 cursor-pointer items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={agreements[term.id]}
                        onChange={(event) =>
                          handleAgreement(
                            term.id,
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 shrink-0 accent-blue-700"
                      />
                      <span>{term.label}</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setActiveTerm(term)}
                      className="shrink-0 text-xs font-medium text-blue-700 underline"
                    >
                      보기
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {signupError && (
              <p role="alert" className="text-sm text-red-600">
                {signupError}
              </p>
            )}

            {signupNotice && (
              <p role="status" className="text-sm text-blue-700">
                {signupNotice}
              </p>
            )}

            <div className="[&>button]:w-full">
              <Button type="submit">가입하기</Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              이미 계정이 있나요?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-700 underline"
              >
                로그인
              </Link>
            </p>
          </form>
        </section>

        {/* 오른쪽 안내 영역 */}
        <aside className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900">
              가입 후 이렇게 이용해요
            </h2>

            <div className="mt-6 space-y-6">
              {[
                {
                  number: '1',
                  title: '회원가입',
                  description:
                    '이메일, 비밀번호, 닉네임만 입력해요.',
                },
                {
                  number: '2',
                  title: '학생 정보 입력',
                  description:
                    '학과, 학년, 학점, 소득구간 등 10개 항목을 입력해요.',
                },
                {
                  number: '3',
                  title: '추천 결과 확인',
                  description:
                    '즉시신청 · 요건부족 · 신청불가로 나눠 보여주고, 부족한 조건은 수치로 알려줘요.',
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {step.number}
                  </span>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-base font-bold text-gray-900">
              약관 및 개인정보 안내
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              가입 시에는 이메일과 닉네임만 수집해요.
              학적·소득 정보는 학생 정보 입력 화면에서
              따로 받고, 장학금 자격 분석에만 사용해요.
            </p>

            <p className="mt-4 text-xs text-gray-400">
              ※ 약관 전문 및 보관 기간은 확정 후 기입
            </p>
          </section>
        </aside>
      </div>

      {/* 약관 보기 임시 모달 */}
      {activeTerm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setActiveTerm(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="term-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="term-dialog-title"
              className="text-lg font-bold text-gray-900"
            >
              {activeTerm.label}
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {activeTerm.content}
            </p>

            <button
              type="button"
              onClick={() => setActiveTerm(null)}
              className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default SignupPage;
