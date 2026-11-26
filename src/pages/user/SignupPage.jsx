import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Field,
  FieldLabel,
  Checkbox,
} from '../../components/ui';

import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';

// 약관 데이터
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

// 서비스 이용 단계 데이터
const signupSteps = [
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
      '적격 · 부적격 · 확인 필요로 나눠 보여주고, 미충족 조건과 판정 근거를 알려줘요.',
  },
];

function SignupPage() {
  // 회원가입 입력값 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
  });

  // 오류 및 안내 메시지 관리
  const [signupError, setSignupError] = useState('');
  const [signupNotice, setSignupNotice] = useState('');

  // 약관 모달 상태 관리
  const [activeTerm, setActiveTerm] = useState(null);

  const allAgreed = Object.values(agreements).every(Boolean);

  const closeTermModal = useCallback(() => {
    setActiveTerm(null);
  }, []);

  // 기존 메시지 초기화
  const clearMessages = () => {
    setSignupError('');
    setSignupNotice('');
  };

  // 전체 약관 동의
  const handleAllAgreement = (checked) => {
    setAgreements({
      service: checked,
      privacy: checked,
      marketing: checked,
    });

    clearMessages();
  };

  // 개별 약관 동의
  const handleAgreement = (id, checked) => {
    setAgreements((previous) => ({
      ...previous,
      [id]: checked,
    }));

    clearMessages();
  };

  // 이메일 중복 확인
  const handleDuplicateCheck = () => {
    clearMessages();

    const normalizedEmail = email.trim().toLowerCase();

    setEmail(normalizedEmail);

    if (!normalizedEmail) {
      setSignupError('이메일을 입력해 주세요.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setSignupError('올바른 이메일 형식을 입력해 주세요.');
      return;
    }

    if (normalizedEmail.split('@')[1] !== 'gachon.ac.kr') {
      setSignupError(
        '가천대학교 이메일(@gachon.ac.kr)만 사용할 수 있습니다.'
      );
      return;
    }

    // TODO: 이메일 중복 확인 API 연동

    setSignupNotice(
      '이메일 중복 확인 기능은 API 연동 후 이용할 수 있습니다.'
    );
  };

  // 회원가입 입력값 검사
  const handleSubmit = (event) => {
    event.preventDefault();

    clearMessages();

    const normalizedEmail = email.trim().toLowerCase();

    setEmail(normalizedEmail);

    // 필수 항목 검사
    if (
      !normalizedEmail ||
      !password ||
      !passwordConfirm ||
      !nickname.trim()
    ) {
      setSignupError('모든 필수 항목을 입력해 주세요.');
      return;
    }

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setSignupError('올바른 이메일 형식을 입력해 주세요.');
      return;
    }

    // 가천대학교 이메일 도메인 검사
    if (normalizedEmail.split('@')[1] !== 'gachon.ac.kr') {
      setSignupError(
        '가천대학교 이메일(@gachon.ac.kr)만 사용할 수 있습니다.'
      );
      return;
    }

    // 비밀번호 형식 검사
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

    if (!passwordPattern.test(password)) {
      setSignupError(
        '비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요.'
      );
      return;
    }

    // 비밀번호 일치 여부 검사
    if (password !== passwordConfirm) {
      setSignupError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 닉네임 검사
    if (
      /\s/.test(nickname) ||
      Array.from(nickname).length < 2 ||
      Array.from(nickname).length > 20
    ) {
      setSignupError(
        '닉네임은 공백 없이 2~20자로 입력해 주세요.'
      );
      return;
    }

    // 필수 약관 동의 검사
    if (!agreements.service || !agreements.privacy) {
      setSignupError('필수 약관에 모두 동의해 주세요.');
      return;
    }

    // TODO: 회원가입 API 연동

    setSignupNotice(
      '입력 항목 검사가 완료되었습니다. 실제 회원가입은 API 연동 후 가능합니다.'
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-6 lg:grid-cols-2">

        {/* 회원가입 카드 */}
        <Card padding="large">
          <h1 className="text-2xl font-bold text-gray-900">
            회원가입
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            이메일로 가입하고, 학적 정보는 다음 단계에서 입력해요.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 flex flex-col gap-5"
          >

            {/* 이메일 */}
            <div className="min-w-0">
              <FieldLabel
                htmlFor="signup-email"
                required
                className="mb-2"
              >
                이메일
              </FieldLabel>

              <div className="flex min-w-0 items-start gap-2">
                <Field
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
                  wrapperClassName="min-w-0 flex-1"
                  aria-describedby="signup-email-guide"
                />

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDuplicateCheck}
                  className="shrink-0 !px-3"
                >
                  중복 확인
                </Button>
              </div>

              <p
                id="signup-email-guide"
                className="mt-2 text-xs leading-relaxed text-gray-600"
              >
                가천대학교 이메일(@gachon.ac.kr)만 사용할 수 있어요.
              </p>
            </div>

            {/* 비밀번호 */}
            <Field
              id="signup-password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="new-password"
              required
              value={password}
              helperText="영문, 숫자, 특수문자를 포함해 8자 이상"
              onChange={(event) => {
                setPassword(event.target.value);
                clearMessages();
              }}
            />

            {/* 비밀번호 확인 */}
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

            {/* 닉네임 */}
            <Field
              id="signup-nickname"
              label="닉네임"
              type="text"
              placeholder="닉네임을 입력하세요"
              autoComplete="nickname"
              required
              value={nickname}
              helperText="공백 없이 2~20자로 입력해 주세요."
              onChange={(event) => {
                setNickname(event.target.value);
                clearMessages();
              }}
            />

            {/* 약관 동의 */}
            <div className="rounded-xl border border-gray-400 bg-gray-100 p-4">

              {/* 전체 동의 */}
              <Checkbox
                id="signup-all-agreement"
                label="전체 동의"
                checked={allAgreed}
                onChange={(event) =>
                  handleAllAgreement(event.target.checked)
                }
                className="border-b border-gray-300 pb-4 !font-bold !text-gray-900"
              />

              {/* 개별 약관 동의 */}
              <div className="mt-4 space-y-4">
                {terms.map((term) => (
                  <div
                    key={term.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <Checkbox
                      id={`signup-term-${term.id}`}
                      label={term.label}
                      checked={agreements[term.id]}
                      onChange={(event) =>
                        handleAgreement(
                          term.id,
                          event.target.checked
                        )
                      }
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveTerm(term)}
                      className="shrink-0 !min-h-0 !rounded-none !p-0 !text-blue-700 underline hover:!bg-transparent hover:!text-blue-900"
                      aria-label={`${term.label} 보기`}
                    >
                      보기
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 오류 메시지 */}
            <Alert
              type="error"
              message={signupError}
            />

            {/* 정상 입력 안내 */}
            <Alert
              type="info"
              message={signupNotice}
            />

            {/* 가입 버튼 */}
            <Button
              type="submit"
              fullWidth
            >
              가입하기
            </Button>

            {/* 로그인 이동 */}
            <p className="text-center text-sm text-gray-600">
              이미 계정이 있나요?{' '}

              <Link
                to="/login"
                className="font-semibold text-blue-700 underline hover:text-blue-900"
              >
                로그인
              </Link>
            </p>
          </form>
        </Card>

        {/* 오른쪽 안내 영역 */}
        <aside className="min-w-0 space-y-4">

          {/* 서비스 이용 단계 */}
          <Card padding="large">
            <h2 className="text-lg font-bold text-gray-900">
              가입 후 이렇게 이용해요
            </h2>

            <div className="mt-5 space-y-4">
              {signupSteps.map((step) => (
                <Card
                  key={step.number}
                  variant="subtle"
                  padding="small"
                  className="!rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                      {step.number}
                    </span>

                    <h3 className="text-base font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm font-medium leading-relaxed text-gray-700">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>
          </Card>

          {/* 약관 및 개인정보 안내 */}
          <Card padding="large">
            <h2 className="text-base font-bold text-gray-900">
              약관 및 개인정보 안내
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              가입 시에는 이메일, 비밀번호, 닉네임과 약관 동의 여부를 입력해요.
              학적·소득 정보는 학생 정보 입력 화면에서
              따로 받고, 장학금 자격 분석에 사용해요.
            </p>

            <Alert
              type="info"
              message="학적 및 소득 정보는 회원가입 단계에서 입력하지 않아도 돼요."
              className="mt-4 !border-blue-200 !p-3"
            />

            <p className="mt-4 border-t border-gray-300 pt-3 text-xs leading-relaxed text-gray-600">
              ※ 약관 전문 및 보관 기간은 확정 후 기입
            </p>
          </Card>
        </aside>
      </div>

      {/* 공통 약관 보기 모달 */}
      <Modal
        open={Boolean(activeTerm)}
        onClose={closeTermModal}
        title={activeTerm?.label}
        size="md"
        closeButtonText="닫기"
      >
        <p>{activeTerm?.content}</p>
      </Modal>
    </main>
  );
}

export default SignupPage;