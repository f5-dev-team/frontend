import { useState, useCallback } from 'react';

import {
  Button,
  Field,
  FieldLabel,
  Select,
  RadioGroup,
  Badge,
} from '../../components/ui';

import Card from '../../components/Card';
import Alert from '../../components/Alert';
import Modal from '../../components/Modal';

import {
  departmentsByCollege,
  globalColleges,
  medicalColleges,
} from '../../data/departments';

// 학생 정보 초기값
const initialForm = {
  college: '',
  department: '',
  grade: '',
  enrollment: '',
  totalGpa: '',
  totalScale: '4.5',
  semesterGpa: '',
  semesterScale: '4.5',
  income: '',
  volunteerHours: '',
  age: '',
  province: '',
  district: '',
  gender: '',
};

// 지역별 시·군·구 데이터
const regionOptions = {
  서울특별시: [
    '강남구', '강동구', '강북구', '강서구', '관악구',
    '광진구', '구로구', '금천구', '노원구', '도봉구',
    '동대문구', '동작구', '마포구', '서대문구', '서초구',
    '성동구', '성북구', '송파구', '양천구', '영등포구',
    '용산구', '은평구', '종로구', '중구', '중랑구',
  ],

  경기도: [
    '고양시', '과천시', '광명시', '광주시', '구리시',
    '군포시', '김포시', '남양주시', '동두천시', '부천시',
    '성남시', '수원시', '시흥시', '안산시', '안성시',
    '안양시', '양주시', '여주시', '오산시', '용인시',
    '의왕시', '의정부시', '이천시', '파주시', '평택시',
    '포천시', '하남시', '화성시', '가평군', '양평군',
    '연천군',
  ],

  인천광역시: [
    '강화군', '계양구', '남동구', '동구', '미추홀구',
    '부평구', '서구', '연수구', '옹진군', '중구',
  ],

  부산광역시: [
    '강서구', '금정구', '기장군', '남구', '동구',
    '동래구', '부산진구', '북구', '사상구', '사하구',
    '서구', '수영구', '연제구', '영도구', '중구',
    '해운대구',
  ],

  대구광역시: [
    '군위군', '남구', '달서구', '달성군', '동구',
    '북구', '서구', '수성구', '중구',
  ],

  광주광역시: [
    '광산구', '남구', '동구', '북구', '서구',
  ],

  대전광역시: [
    '대덕구', '동구', '서구', '유성구', '중구',
  ],

  울산광역시: [
    '남구', '동구', '북구', '울주군', '중구',
  ],

  세종특별자치시: [
    '세종시',
  ],

  강원특별자치도: [
    '강릉시', '동해시', '삼척시', '속초시', '원주시',
    '춘천시', '태백시', '고성군', '양구군', '양양군',
    '영월군', '인제군', '정선군', '철원군', '평창군',
    '홍천군', '화천군', '횡성군',
  ],

  충청북도: [
    '제천시', '청주시', '충주시', '괴산군', '단양군',
    '보은군', '영동군', '옥천군', '음성군', '증평군',
    '진천군',
  ],

  충청남도: [
    '계룡시', '공주시', '논산시', '당진시', '보령시',
    '서산시', '아산시', '천안시', '금산군', '부여군',
    '서천군', '예산군', '청양군', '태안군', '홍성군',
  ],

  전북특별자치도: [
    '군산시', '김제시', '남원시', '익산시', '전주시',
    '정읍시', '고창군', '무주군', '부안군', '순창군',
    '완주군', '임실군', '장수군', '진안군',
  ],

  전라남도: [
    '광양시', '나주시', '목포시', '순천시', '여수시',
    '강진군', '고흥군', '곡성군', '구례군', '담양군',
    '무안군', '보성군', '신안군', '영광군', '영암군',
    '완도군', '장성군', '장흥군', '진도군', '함평군',
    '해남군', '화순군',
  ],

  경상북도: [
    '경산시', '경주시', '구미시', '김천시', '문경시',
    '상주시', '안동시', '영주시', '영천시', '포항시',
    '고령군', '봉화군', '성주군', '영덕군', '영양군',
    '예천군', '울릉군', '울진군', '의성군', '청도군',
    '청송군', '칠곡군',
  ],

  경상남도: [
    '거제시', '김해시', '밀양시', '사천시', '양산시',
    '진주시', '창원시', '통영시', '거창군', '고성군',
    '남해군', '산청군', '의령군', '창녕군', '하동군',
    '함안군', '함양군', '합천군',
  ],

  제주특별자치도: [
    '서귀포시', '제주시',
  ],
};

// 문자열 배열을 Select 옵션 형식으로 변환
const toOptions = (items) =>
  items.map((item) => ({
    value: item,
    label: item,
  }));

// 캠퍼스별 대학 목록
const collegeGroups = [
  {
    label: '글로벌캠퍼스 (G)',
    options: toOptions(globalColleges),
  },
  {
    label: '메디컬캠퍼스 (M)',
    options: toOptions(medicalColleges),
  },
];

// 학년 선택 목록
const gradeOptions = [1, 2, 3, 4].map((grade) => ({
  value: String(grade),
  label: `${grade}학년`,
}));

// 학적 상태 선택 목록
const enrollmentOptions = toOptions([
  '재학',
  '휴학',
  '졸업예정',
]);

// 학점 만점 선택 목록
const scaleOptions = toOptions([
  '4.5',
  '4.3',
]);

// 소득구간 선택 목록
const incomeOptions = Array.from(
  { length: 10 },
  (_, index) => ({
    value: String(index + 1),
    label: `${index + 1}구간`,
  })
);

// 성별 선택 목록
const genderOptions = toOptions([
  '남성',
  '여성',
]);

// 시·도 선택 목록
const provinceOptions = toOptions(
  Object.keys(regionOptions)
);

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

// 학점 범위 검사
function validateGpa(value, scale) {
  const number = Number(value);
  const maximum = Number(scale);

  return (
    value.trim() !== '' &&
    Number.isFinite(number) &&
    number >= 0 &&
    number <= maximum
  );
}

// 봉사시간 검사: 0 이상의 정수
function validateVolunteerHours(value) {
  const number = Number(value);

  return (
    value.trim() !== '' &&
    Number.isInteger(number) &&
    number >= 0
  );
}

// 나이 검사: 1~120세의 정수
function validateAge(value) {
  const number = Number(value);

  return (
    value.trim() !== '' &&
    Number.isInteger(number) &&
    number >= 1 &&
    number <= 120
  );
}

// 4.5 만점 기준 학점 환산
function convertTo45(value, scale) {
  return (Number(value) / Number(scale)) * 4.5;
}

// 전체 학점 및 직전 학기 학점 공통 입력 컴포넌트
function GpaField({
  id,
  label,
  value,
  scale,
  placeholder,
  onValueChange,
  onScaleChange,
}) {
  const invalid =
    value !== '' &&
    !validateGpa(value, scale);

  return (
    <div className="min-w-0">
      <FieldLabel
        htmlFor={id}
        required
        className="mb-2"
      >
        {label}
      </FieldLabel>

      <div className="flex min-w-0 items-center gap-2">
        <Field
          id={id}
          type="number"
          step="0.01"
          min="0"
          max={scale}
          placeholder={placeholder}
          required
          value={value}
          aria-invalid={invalid}
          aria-describedby={
            invalid ? `${id}-error` : undefined
          }
          onChange={(event) =>
            onValueChange(event.target.value)
          }
          wrapperClassName="min-w-0 flex-1"
          className={
            invalid
              ? '!border-orange-500 !bg-orange-50'
              : ''
          }
        />

        <span className="text-sm text-gray-600">
          /
        </span>

        <Select
          id={`${id}-scale`}
          aria-label={`${label} 만점`}
          options={scaleOptions}
          placeholder=""
          value={scale}
          onChange={(event) =>
            onScaleChange(event.target.value)
          }
          wrapperClassName="w-24 shrink-0"
        />
      </div>

      {invalid && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-xs font-medium text-orange-700"
        >
          0점 이상 {scale}점 이하로 입력해 주세요.
        </p>
      )}

      {!invalid &&
        value !== '' &&
        scale === '4.3' && (
          <p className="mt-2 text-xs text-blue-700">
            4.5 만점 환산:{' '}
            {convertTo45(value, scale).toFixed(2)}
            점
          </p>
        )}
    </div>
  );
}

function ProfilePage() {
  // 학생 정보 입력값 관리
  const [form, setForm] = useState(initialForm);

  // 오류 및 안내 메시지 관리
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');

  // 초기화 확인 모달 상태
  const [isResetModalOpen, setIsResetModalOpen] =
    useState(false);

  // 기존 메시지 초기화
  const clearMessages = () => {
    setFormError('');
    setFormNotice('');
  };

  // 개별 입력값 변경
  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearMessages();
  };

  // 소속 대학 변경 시 기존 학과 초기화
  const handleCollegeChange = (value) => {
    setForm((previous) => ({
      ...previous,
      college: value,
      department: '',
    }));

    clearMessages();
  };

  // 시·도 변경 시 기존 시·군·구 초기화
  const handleProvinceChange = (value) => {
    setForm((previous) => ({
      ...previous,
      province: value,
      district: '',
    }));

    clearMessages();
  };

  // 입력 즉시 봉사시간 오류 검사
  const volunteerInvalid =
    form.volunteerHours !== '' &&
    !validateVolunteerHours(form.volunteerHours);

  // 입력 즉시 나이 오류 검사
  const ageInvalid =
    form.age !== '' &&
    !validateAge(form.age);

  // 선택한 대학에 해당하는 학과 목록
  const availableDepartments =
    departmentsByCollege[form.college] || [];

  // 선택한 시·도에 해당하는 시·군·구 목록
  const availableDistricts =
    regionOptions[form.province] || [];

  // 초기화 확인 모달 열기
  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  // 초기화 확인 모달 닫기
  const closeResetModal = useCallback(() => {
    setIsResetModalOpen(false);
  }, []);

  // 입력 내용 초기화
  const confirmReset = () => {
    setForm({ ...initialForm });
    clearMessages();
    closeResetModal();
  };

  // 장학금 조회 전 입력값 검사
  const handleSubmit = (event) => {
    event.preventDefault();

    clearMessages();

    const requiredFields = [
      'college',
      'department',
      'grade',
      'enrollment',
      'totalGpa',
      'semesterGpa',
      'income',
      'volunteerHours',
      'age',
      'province',
      'district',
      'gender',
    ];

    // 필수 항목 검사
    const hasEmptyField = requiredFields.some(
      (field) => String(form[field]).trim() === ''
    );

    if (hasEmptyField) {
      setFormError(
        '모든 필수 항목을 입력해 주세요.'
      );
      return;
    }

    // 대학 및 학과 일치 여부 검사
    if (!availableDepartments.includes(form.department)) {
      setFormError(
        '선택한 소속 대학에 해당하는 학과를 선택해 주세요.'
      );
      return;
    }

    // 학점 범위 검사
    if (
      !validateGpa(form.totalGpa, form.totalScale) ||
      !validateGpa(form.semesterGpa, form.semesterScale)
    ) {
      setFormError(
        '학점은 0점 이상, 선택한 만점 이하로 입력해 주세요.'
      );
      return;
    }

    // 봉사시간 검사
    if (!validateVolunteerHours(form.volunteerHours)) {
      setFormError(
        '봉사시간은 0 이상의 정수로 입력해 주세요.'
      );
      return;
    }

    // 나이 검사
    if (!validateAge(form.age)) {
      setFormError(
        '나이는 1~120세의 정수로 입력해 주세요.'
      );
      return;
    }

    // TODO: 학생 정보 저장 API 연동
    // TODO: 장학금 분석 API 연동
    // TODO: 분석 결과 화면 이동

    setFormNotice(
      '입력 항목 검사가 완료되었습니다. 장학금 분석은 API 연동 후 이용할 수 있습니다.'
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">

        {/* 학생 정보 입력 카드 */}
        <Card padding="large">
          <h1 className="text-2xl font-bold text-gray-900">
            학생 정보 입력
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            입력한 정보를 장학금 자격요건과 비교해요.
          </p>

          <p className="mt-1 text-sm text-gray-600">
            아래 10개 항목을 입력해 주세요.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7"
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">

              {/* 학과 */}
              <fieldset className="min-w-0 sm:col-span-2">
                <legend className="mb-2 block text-sm font-semibold text-gray-800">
                  학과
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </legend>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* 소속 대학 */}
                  <div className="min-w-0">
                    <FieldLabel
                      htmlFor="college"
                      className="mb-2 !text-xs !font-medium !text-gray-600"
                    >
                      소속 대학
                    </FieldLabel>

                    <Select
                      id="college"
                      required
                      groups={collegeGroups}
                      placeholder="소속 대학을 선택하세요"
                      placeholderDisabled={false}
                      value={form.college}
                      onChange={(event) =>
                        handleCollegeChange(
                          event.target.value
                        )
                      }
                    />
                  </div>

                  {/* 학과 및 전공 */}
                  <div className="min-w-0">
                    <FieldLabel
                      htmlFor="department"
                      className="mb-2 !text-xs !font-medium !text-gray-600"
                    >
                      학과 및 전공
                    </FieldLabel>

                    <Select
                      id="department"
                      required
                      disabled={!form.college}
                      options={toOptions(
                        availableDepartments
                      )}
                      placeholder="학과 및 전공을 선택하세요"
                      placeholderDisabled={false}
                      value={form.department}
                      onChange={(event) =>
                        updateField(
                          'department',
                          event.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  가천대학교 2026년 전공교육과정 기준
                </p>
              </fieldset>

              {/* 학년 */}
              <Select
                id="grade"
                label="학년"
                required
                options={gradeOptions}
                placeholder="학년을 선택하세요"
                placeholderDisabled={false}
                value={form.grade}
                onChange={(event) =>
                  updateField(
                    'grade',
                    event.target.value
                  )
                }
              />

              {/* 학적 상태 */}
              <Select
                id="enrollment"
                label="학적 상태"
                required
                options={enrollmentOptions}
                placeholder="학적 상태를 선택하세요"
                placeholderDisabled={false}
                value={form.enrollment}
                onChange={(event) =>
                  updateField(
                    'enrollment',
                    event.target.value
                  )
                }
              />

              {/* 전체 학점 */}
              <GpaField
                id="totalGpa"
                label="전체 학점"
                value={form.totalGpa}
                scale={form.totalScale}
                placeholder="3.30"
                onValueChange={(value) =>
                  updateField('totalGpa', value)
                }
                onScaleChange={(value) =>
                  updateField('totalScale', value)
                }
              />

              {/* 직전 학기 학점 */}
              <GpaField
                id="semesterGpa"
                label="직전 학기 학점"
                value={form.semesterGpa}
                scale={form.semesterScale}
                placeholder="3.60"
                onValueChange={(value) =>
                  updateField('semesterGpa', value)
                }
                onScaleChange={(value) =>
                  updateField('semesterScale', value)
                }
              />

              {/* 소득구간 */}
              <Select
                id="income"
                label="소득구간"
                required
                options={incomeOptions}
                placeholder="소득구간을 선택하세요"
                placeholderDisabled={false}
                value={form.income}
                onChange={(event) =>
                  updateField(
                    'income',
                    event.target.value
                  )
                }
              />

              {/* 봉사시간 */}
              <Field
                id="volunteerHours"
                label="봉사시간"
                type="number"
                min="0"
                step="1"
                placeholder="30"
                required
                suffix="시간"
                value={form.volunteerHours}
                error={
                  volunteerInvalid
                    ? '봉사시간은 0 이상의 정수로 입력해 주세요.'
                    : ''
                }
                className={
                  volunteerInvalid
                    ? '!border-orange-500 !bg-orange-50'
                    : ''
                }
                onChange={(event) =>
                  updateField(
                    'volunteerHours',
                    event.target.value
                  )
                }
              />

              {/* 나이 */}
              <Field
                id="age"
                label="나이"
                type="number"
                min="1"
                max="120"
                step="1"
                placeholder="23"
                required
                suffix="세"
                value={form.age}
                error={
                  ageInvalid
                    ? '나이는 1~120세의 정수로 입력해 주세요.'
                    : ''
                }
                className={
                  ageInvalid
                    ? '!border-orange-500 !bg-orange-50'
                    : ''
                }
                onChange={(event) =>
                  updateField(
                    'age',
                    event.target.value
                  )
                }
              />

              {/* 성별 */}
              <RadioGroup
                label="성별"
                name="gender"
                required
                options={genderOptions}
                value={form.gender}
                onChange={(event) =>
                  updateField(
                    'gender',
                    event.target.value
                  )
                }
              />

              {/* 주소지 */}
              <div className="min-w-0 sm:col-span-2">
                <FieldLabel
                  htmlFor="province"
                  required
                  className="mb-2"
                >
                  주소지
                </FieldLabel>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* 시·도 */}
                  <Select
                    id="province"
                    required
                    options={provinceOptions}
                    placeholder="시·도를 선택하세요"
                    placeholderDisabled={false}
                    value={form.province}
                    onChange={(event) =>
                      handleProvinceChange(
                        event.target.value
                      )
                    }
                  />

                  {/* 시·군·구 */}
                  <Select
                    id="district"
                    aria-label="시·군·구"
                    required
                    disabled={!form.province}
                    options={toOptions(
                      availableDistricts
                    )}
                    placeholder="시·군·구를 선택하세요"
                    placeholderDisabled={false}
                    value={form.district}
                    onChange={(event) =>
                      updateField(
                        'district',
                        event.target.value
                      )
                    }
                  />
                </div>

                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  1년 이상 주민등록이 되어 있는 주소지 기준
                </p>
              </div>
            </div>

            {/* 오류 메시지 */}
            <Alert
              type="error"
              message={formError}
              className="mt-5"
            />

            {/* 정상 입력 안내 */}
            <Alert
              type="info"
              message={formNotice}
              className="mt-5"
            />

            {/* 하단 버튼 */}
            <div className="mt-7 flex flex-wrap justify-end gap-2 border-t border-gray-300 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="!px-5"
              >
                초기화
              </Button>

              <Button type="submit">
                장학금 조회하기
              </Button>
            </div>
          </form>
        </Card>

        {/* 오른쪽 안내 카드 */}
        <aside className="min-w-0 space-y-4">

          {/* 장학금 판정 안내 */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900">
              조회하면 이렇게 나눠 보여드려요
            </h2>

            <div className="mt-5 space-y-4">
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

            <p className="mt-5 border-t border-gray-300 pt-4 text-sm leading-relaxed text-gray-600">
              미충족 조건과 상세 판정 근거, 공고 원문 출처를 함께 제공해요.
            </p>
          </Card>

          {/* 학점 입력 안내 */}
          <Card>
            <h2 className="text-base font-bold text-gray-900">
              학점 입력 안내
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              전체 학점과 직전 학기 학점을 각각 입력해 주세요.
              4.5 또는 4.3 만점 기준을 선택할 수 있어요.
            </p>

            <Alert
              type="info"
              message="4.3 만점으로 입력하면 4.5 만점 환산값을 확인할 수 있어요."
              className="mt-4 !border-blue-200 !p-3"
            />
          </Card>

          {/* 개인정보 안내 */}
          <Card>
            <h2 className="text-base font-bold text-gray-900">
              개인정보 안내
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              입력한 정보는 장학금 자격 분석을 위한 정보예요.
              현재 개발 단계에서는 서버에 저장되지 않아요.
            </p>
          </Card>
        </aside>
      </div>

      {/* 초기화 확인 모달 */}
      <Modal
        open={isResetModalOpen}
        onClose={closeResetModal}
        title="학생 정보 초기화"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={closeResetModal}
            >
              취소
            </Button>

            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={confirmReset}
            >
              초기화
            </Button>
          </div>
        }
      >
        <p className="font-medium text-gray-800">
          입력한 내용을 모두 지우시겠습니까?
        </p>

        <p className="mt-2 text-sm text-gray-600">
          초기화하면 현재 입력한 학생 정보가 모두 삭제됩니다.
        </p>
      </Modal>
    </main>
  );
}

export default ProfilePage;