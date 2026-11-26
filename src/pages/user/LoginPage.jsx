import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Field,
  Checkbox,
  Badge,
} from '../../components/ui';

import Card from '../../components/Card';
import Alert from '../../components/Alert';

// 장학금 판정 상태 안내 데이터
const scholarshipStatuses = [
  {
    label: '적격',
    badgeVariant: 'eligible',
    cardVariant: 'blue',
    description:
      '모든 필수 지원 조건을 충족한 장학금',
  },
  {
    label: '부적격',
    badgeVariant: 'ineligible',
    cardVariant: 'orange',
    description:
      '하나 이상의 필수 지원 조건을 충족하지 못한 장학금',
  },
  {
    label: '확인 필요',
    badgeVariant: 'uncertain',
    cardVariant: 'gray',
    description:
      '현재 정보만으로 지원 자격을 확정하기 어려운 장학금',
  },
];

function LoginPage() {
  // 로그인 입력값 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);

  // 오류 및 안내 메시지 관리
  const [loginError, setLoginError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');

  // 기존 메시지 초기화
  const clearMessages = () => {
    setLoginError('');
    setLoginNotice('');
  };

  // 로그인 입력값 검사
  const handleSubmit = (event) => {
    event.preventDefault();

    clearMessages();

    const normalizedEmail = email.trim().toLowerCase();

    setEmail(normalizedEmail);

    // 필수 항목 검사
    if (!normalizedEmail || !password) {
      setLoginError(
        '이메일과 비밀번호를 입력해 주세요.'
      );
      return;
    }

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setLoginError(
        '올바른 이메일 형식을 입력해 주세요.'
      );
      return;
    }

    // 가천대학교 이메일 도메인 검사
    if (normalizedEmail.split('@')[1] !== 'gachon.ac.kr') {
      setLoginError(
        '가천대학교 이메일(@gachon.ac.kr)만 사용할 수 있습니다.'
      );
      return;
    }

    // TODO: 로그인 API 연동
    // TODO: 로그인 응답 및 닉네임 처리
    // TODO: 로그인 상태 유지 처리
    // TODO: 로그인 성공 후 페이지 이동

    setLoginNotice(
      '입력 항목 검사가 완료되었습니다. 실제 로그인은 API 연동 후 가능합니다.'
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full min-w-0 max-w-5xl grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-2 lg:gap-10">

        {/* 로그인 카드 */}
        <Card
          padding="default"
          className="sm:!p-10"
        >
          <h1 className="text-2xl font-bold text-gray-900">
            로그인
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            가입한 이메일로 로그인해 주세요.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-6"
          >

            {/* 이메일 입력 */}
            <Field
              id="email"
              label="이메일"
              type="email"
              placeholder="student@gachon.ac.kr"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearMessages();
              }}
            />

            {/* 비밀번호 입력 */}
            <Field
              id="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearMessages();
              }}
            />

            {/* 로그인 상태 유지 */}
            <Checkbox
              id="remember-login"
              label="로그인 상태 유지"
              checked={isRemembered}
              onChange={(event) => {
                setIsRemembered(event.target.checked);
                clearMessages();
              }}
              className="!gap-2 !text-gray-700"
              inputClassName="!h-4 !w-4"
            />

            {/* 오류 메시지 */}
            <Alert
              type="error"
              message={loginError}
            />

            {/* 정상 입력 안내 */}
            <Alert
              type="info"
              message={loginNotice}
            />

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              fullWidth
            >
              로그인
            </Button>

            {/* 하단 링크 */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="text-gray-600">
                비밀번호 찾기 (준비 중)
              </span>

              <span className="text-gray-400">
                |
              </span>

              <Link
                to="/signup"
                className="font-semibold text-blue-700 hover:underline"
              >
                회원가입
              </Link>
            </div>
          </form>
        </Card>

        {/* 장학금 안내 영역 */}
        <aside className="min-w-0">
          <Card padding="large">
            <h2 className="text-xl font-bold leading-relaxed text-gray-900">
              받을 수 있는 장학금과
              <br />
              앞으로 준비할 조건을 함께 알려드려요
            </h2>

            {/* 장학금 판정 상태 안내 */}
            <div className="mt-6 space-y-4">
              {scholarshipStatuses.map((status) => (
                <Card
                  key={status.label}
                  variant={status.cardVariant}
                  padding="small"
                  className={`
                    flex flex-col items-start gap-3
                    !rounded-xl
                    ${
                      status.cardVariant === 'gray'
                        ? '!border-gray-400'
                        : ''
                    }
                  `}
                >
                  <Badge
                    variant={status.badgeVariant}
                    className="!px-3 !py-2 !text-sm !font-bold"
                  >
                    {status.label}
                  </Badge>

                  <p className="text-base font-medium leading-relaxed text-gray-800">
                    {status.description}
                  </p>
                </Card>
              ))}
            </div>

            {/* 상세 판정 안내 */}
            <p className="mt-6 border-t border-gray-300 pt-4 text-sm leading-relaxed text-gray-600">
              미충족 조건과 상세 판정 근거, 공고 원문 출처를 함께 제공해요.
            </p>
          </Card>
        </aside>
      </div>
    </main>
  );
}

export default LoginPage;