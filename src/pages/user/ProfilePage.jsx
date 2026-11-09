
import { useState } from 'react';
import { Button } from '../../components/ui';

const initialForm = {
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

const departments = [
  '컴퓨터공학과',
  '소프트웨어학과',
  '전자공학과',
  '전기공학과',
  '기계공학과',
  '건축공학과',
  '경영학과',
  '경제학과',
  '간호학과',
  '기타',
];

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
    '서구', '수영구', '연제구', '영도구', '중구', '해운대구',
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

const inputClass =
  'w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

const labelClass =
  'mb-2 block text-sm font-semibold text-gray-800';

function ProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');

  const updateField = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError('');
    setFormNotice('');
  };

  const handleProvinceChange = (value) => {
    setForm((previous) => ({
      ...previous,
      province: value,
      district: '',
    }));

    setFormError('');
    setFormNotice('');
  };

  const validateGpa = (value, scale) => {
    const number = Number(value);
    const maximum = Number(scale);

    return (
      value.trim() !== '' &&
      Number.isFinite(number) &&
      number >= 0 &&
      number <= maximum
    );
  };

  const convertTo45 = (value, scale) => {
    return (Number(value) / Number(scale)) * 4.5;
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      '입력한 내용을 모두 지우시겠습니까?'
    );

    if (!confirmed) return;

    setForm({ ...initialForm });
    setFormError('');
    setFormNotice('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormError('');
    setFormNotice('');

    const requiredFields = [
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

    const hasEmptyField = requiredFields.some(
      (field) => String(form[field]).trim() === ''
    );

    if (hasEmptyField) {
      setFormError('모든 필수 항목을 입력해 주세요.');
      return;
    }

    if (
      !validateGpa(form.totalGpa, form.totalScale) ||
      !validateGpa(form.semesterGpa, form.semesterScale)
    ) {
      setFormError(
        '학점은 0점 이상, 선택한 만점 이하로 입력해 주세요.'
      );
      return;
    }

    const volunteer = Number(form.volunteerHours);
    const age = Number(form.age);

    if (
      !Number.isFinite(volunteer) ||
      volunteer < 0 ||
      !Number.isInteger(volunteer)
    ) {
      setFormError(
        '봉사시간은 0 이상의 정수로 입력해 주세요.'
      );
      return;
    }

    if (
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120
    ) {
      setFormError('나이를 올바르게 입력해 주세요.');
      return;
    }

    const normalizedTotalGpa = convertTo45(
      form.totalGpa,
      form.totalScale
    );

    const normalizedSemesterGpa = convertTo45(
      form.semesterGpa,
      form.semesterScale
    );

    // 추후 장학금 분석 API 연동 시 전달할 데이터
    const profileData = {
      ...form,
      totalGpa45: Number(normalizedTotalGpa.toFixed(2)),
      semesterGpa45: Number(normalizedSemesterGpa.toFixed(2)),
    };

    console.log('학생 정보 입력 검증 완료:', profileData);

    setFormNotice(
      '입력 항목 검사가 완료되었습니다. 장학금 분석은 API 연동 후 이용할 수 있습니다.'
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* 학생 정보 입력 카드 */}
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            학생 정보 입력
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            입력한 정보를 장학금 자격요건과 비교해요.
            저장한 정보는 다음에도 불러와요.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7"
          >
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
              {/* 학과 */}
              <div>
                <label htmlFor="department" className={labelClass}>
                  학과
                </label>

                <select
                  id="department"
                  value={form.department}
                  onChange={(event) =>
                    updateField('department', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">학과를 선택하세요</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              {/* 학년 */}
              <div>
                <label htmlFor="grade" className={labelClass}>
                  학년
                </label>

                <select
                  id="grade"
                  value={form.grade}
                  onChange={(event) =>
                    updateField('grade', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">학년을 선택하세요</option>
                  {[1, 2, 3, 4].map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}학년
                    </option>
                  ))}
                </select>
              </div>

              {/* 학적 상태 */}
              <div>
                <label htmlFor="enrollment" className={labelClass}>
                  학적 상태
                </label>

                <select
                  id="enrollment"
                  value={form.enrollment}
                  onChange={(event) =>
                    updateField('enrollment', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">학적 상태를 선택하세요</option>
                  <option value="재학">재학</option>
                  <option value="휴학">휴학</option>
                  <option value="졸업예정">졸업예정</option>
                </select>
              </div>

              {/* 전체 학점 */}
              <div>
                <label htmlFor="totalGpa" className={labelClass}>
                  전체 학점
                </label>

                <div className="flex min-w-0 items-center gap-2">
                  <input
                    id="totalGpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max={form.totalScale}
                    placeholder="3.30"
                    value={form.totalGpa}
                    onChange={(event) =>
                      updateField('totalGpa', event.target.value)
                    }
                    className={inputClass}
                  />

                  <span className="text-sm text-gray-400">/</span>

                  <select
                    aria-label="전체 학점 만점"
                    value={form.totalScale}
                    onChange={(event) =>
                      updateField('totalScale', event.target.value)
                    }
                    className={`${inputClass} max-w-24 shrink-0`}
                  >
                    <option value="4.5">4.5</option>
                    <option value="4.3">4.3</option>
                  </select>
                </div>
              </div>

              {/* 직전 학기 학점 */}
              <div>
                <label htmlFor="semesterGpa" className={labelClass}>
                  직전 학기 학점
                </label>

                <div className="flex min-w-0 items-center gap-2">
                  <input
                    id="semesterGpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max={form.semesterScale}
                    placeholder="3.60"
                    value={form.semesterGpa}
                    onChange={(event) =>
                      updateField('semesterGpa', event.target.value)
                    }
                    className={inputClass}
                  />

                  <span className="text-sm text-gray-400">/</span>

                  <select
                    aria-label="직전 학기 학점 만점"
                    value={form.semesterScale}
                    onChange={(event) =>
                      updateField('semesterScale', event.target.value)
                    }
                    className={`${inputClass} max-w-24 shrink-0`}
                  >
                    <option value="4.5">4.5</option>
                    <option value="4.3">4.3</option>
                  </select>
                </div>
              </div>

              {/* 소득구간 */}
              <div>
                <label htmlFor="income" className={labelClass}>
                  소득구간
                </label>

                <select
                  id="income"
                  value={form.income}
                  onChange={(event) =>
                    updateField('income', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">소득구간을 선택하세요</option>
                  {Array.from({ length: 10 }, (_, index) => (
                    <option
                      key={index + 1}
                      value={String(index + 1)}
                    >
                      {index + 1}구간
                    </option>
                  ))}
                </select>
              </div>

              {/* 봉사시간 */}
              <div>
                <label htmlFor="volunteerHours" className={labelClass}>
                  봉사시간
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id="volunteerHours"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="30"
                    value={form.volunteerHours}
                    onChange={(event) =>
                      updateField('volunteerHours', event.target.value)
                    }
                    className={inputClass}
                  />

                  <span className="shrink-0 text-sm text-gray-500">
                    시간
                  </span>
                </div>
              </div>

              {/* 나이 */}
              <div>
                <label htmlFor="age" className={labelClass}>
                  나이
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    step="1"
                    placeholder="23"
                    value={form.age}
                    onChange={(event) =>
                      updateField('age', event.target.value)
                    }
                    className={inputClass}
                  />

                  <span className="shrink-0 text-sm text-gray-500">
                    세
                  </span>
                </div>
              </div>

              {/* 주소지 */}
              <div>
                <label htmlFor="province" className={labelClass}>
                  주소지
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    id="province"
                    value={form.province}
                    onChange={(event) =>
                      handleProvinceChange(event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">시·도 선택</option>
                    {Object.keys(regionOptions).map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="시·군·구"
                    value={form.district}
                    onChange={(event) =>
                      updateField('district', event.target.value)
                    }
                    disabled={!form.province}
                    className={`${inputClass} disabled:bg-gray-100`}
                  >
                    <option value="">시·군·구 선택</option>
                    {(regionOptions[form.province] || []).map(
                      (district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  1년 이상 주민등록이 되어 있는 주소지 기준
                </p>
              </div>

              {/* 성별 */}
              <div>
                <span className={labelClass}>성별</span>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '남성', label: '남성' },
                    { value: '여성', label: '여성' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                        form.gender === option.value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={form.gender === option.value}
                        onChange={(event) =>
                          updateField('gender', event.target.value)
                        }
                        className="accent-blue-700"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {formError && (
              <p
                role="alert"
                className="mt-5 text-sm text-red-600"
              >
                {formError}
              </p>
            )}

            {formNotice && (
              <p
                role="status"
                className="mt-5 text-sm text-blue-700"
              >
                {formNotice}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-2 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                초기화
              </button>

              <Button type="submit">
                장학금 조회하기
              </Button>
            </div>
          </form>
        </section>

        {/* 오른쪽 안내 카드 */}
        <aside className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-bold text-gray-900">
              조회하면 이렇게 나눠 보여드려요
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <span className="inline-block rounded-md bg-blue-700 px-3 py-1.5 text-xs font-bold text-white">
                  즉시신청
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  모든 자격요건을 충족했어요.
                </p>
              </div>

              <div>
                <span className="inline-block rounded-md bg-orange-600 px-3 py-1.5 text-xs font-bold text-white">
                  요건부족
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  학점·봉사시간처럼 채울 수 있는 조건이 부족해요.
                </p>
              </div>

              <div>
                <span className="inline-block rounded-md bg-gray-600 px-3 py-1.5 text-xs font-bold text-white">
                  신청불가
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  학년·학과처럼 바꿀 수 없는 조건이 맞지 않아요.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-bold text-gray-900">
              학점 입력 안내
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              만점 기준을 함께 선택하면 4.5 만점으로
              환산해서 비교해요.
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-bold text-gray-900">
              개인정보 안내
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              입력한 정보는 장학금 자격 분석에만 사용해요.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default ProfilePage;
