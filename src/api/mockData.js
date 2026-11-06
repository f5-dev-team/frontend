// 백엔드 완성 전에 쓰는 더미 데이터 (설계서 7.3 응답 형식).
// - 학생 프로필: 회의록 더미 1~6 기준. 회의록에 없는 항목은 명세 규칙대로 null.
// - 장학금: 제목과 원문 링크만 실제 공고이고, 기간·조건·인용 문장은 테스트용으로 지어낸 값.

export const MOCK_PASSWORD = 'Test1234!';
export const MOCK_ADMIN_PASSWORD = 'Admin1234!';

const profile = (
  department,
  grade,
  previousSemesterGpa,
  incomeBracket,
  residenceAddress = null,
) => ({
  department,
  grade,
  enrollmentStatus: 'ENROLLED',
  cumulativeGpa: null,
  previousSemesterGpa,
  incomeBracket,
  volunteerHours: null,
  age: null,
  residenceAddress,
  gender: null,
  version: 1,
  updatedAt: '2026-11-01T09:00:00+09:00',
});

export const users = [
  { userId: '1', email: 'admin@gachon.ac.kr', password: MOCK_ADMIN_PASSWORD, role: 'ADMIN' },
  { userId: '101', email: 'dummy1@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
  { userId: '102', email: 'dummy2@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
  { userId: '103', email: 'dummy3@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
  { userId: '104', email: 'dummy4@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
  { userId: '105', email: 'dummy5@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
  { userId: '106', email: 'dummy6@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
  // 분석 실패(FAILED) 화면 확인용 계정
  { userId: '107', email: 'fail@gachon.ac.kr', password: MOCK_PASSWORD, role: 'USER' },
];

export const profiles = {
  101: profile('컴퓨터공학과', 2, 3.8, 7),
  102: profile('경영학과', 3, 4.2, 2),
  103: profile('소프트웨어학과', 1, null, 5, '경기도 화성시'),
  104: profile('간호학과', 4, 3.5, 8),
  105: profile('컴퓨터공학과', 3, 2.2, 9),
  106: profile('기계공학과', 4, 3.9, 4),
  107: profile('컴퓨터공학과', 2, 3.0, 5),
};

// StudentProfile에 필드가 없는 더미 특이사항을 판정에 반영한다.
export const waivedConditions = { 104: ['c1002'] }; // 다자녀 가구: 소득구간 조건 예외
export const excludedUsers = { 106: '초과학기(9학기) 학생은 지원 대상에서 제외됩니다.' };
export const failingUsers = ['107'];

const GACHON_NOTICE = 'https://www.gachon.ac.kr/kor/1146/subview.do?enc=';

const documents = (documentId, fileName, fileType = 'PDF') => [{ documentId, fileName, fileType }];

const condition = (conditionId, field, operator, expectedValue, description, required = true) => ({
  conditionId,
  field,
  operator,
  expectedValue,
  description,
  required,
  sourceQuote: `(더미 문장) ${description}`,
});

export const scholarships = [
  {
    scholarshipId: '1001',
    title: '26-1학기 장학사정관(국가장학금 2유형 대응) 장학금 지급 안내',
    organization: '가천대학교',
    description: '테스트용 더미 공고',
    applicationStartAt: '2026-10-01T09:00:00+09:00',
    applicationEndAt: '2026-12-31T18:00:00+09:00',
    applicationPeriodText: '2026년 10월 1일 09:00 ~ 12월 31일 18:00',
    sourceUrl: `${GACHON_NOTICE}Zm5jdDF8QEB8JTJGYmJzJTJGa29yJTJGNDc4JTJGMTIxNDQwJTJGYXJ0Y2xWaWV3LmRvJTNGcGFnZSUzRDMlMjZzcmNoQ29sdW1uJTNEJTI2c3JjaFdyZCUzRCUyNmJic0NsU2VxJTNEJTI2YmJzT3BlbldyZFNlcSUzRCUyNnJnc0JnbmRlU3RyJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZwYXNzd29yZCUzRCUyNg%3D%3D`,
    requirements: [
      condition('c1001', 'previousSemesterGpa', 'GTE', 2.5, '직전 학기 학점 2.5 이상'),
      condition('c1002', 'incomeBracket', 'LTE', 7, '소득구간 7구간 이하'),
    ],
    documents: documents('d1001', '장학사정관_장학금_안내.pdf'),
    version: 1,
    updatedAt: '2026-11-01T09:00:00+09:00',
    processingStatus: 'READY',
    collectedAt: '2026-10-30T08:00:00+09:00',
    processingError: null,
  },
  {
    scholarshipId: '1002',
    title: '화성시인재육성재단 「꿈드림 장학금」',
    organization: '화성시인재육성재단',
    description: '테스트용 더미 공고',
    applicationStartAt: '2026-10-15T09:00:00+09:00',
    applicationEndAt: '2026-11-20T18:00:00+09:00',
    applicationPeriodText: '2026년 10월 15일 09:00 ~ 11월 20일 18:00',
    sourceUrl: `${GACHON_NOTICE}Zm5jdDF8QEB8JTJGYmJzJTJGa29yJTJGNDc4JTJGMTIwMTI0JTJGYXJ0Y2xWaWV3LmRvJTNGcGFnZSUzRDQlMjZzcmNoQ29sdW1uJTNEJTI2c3JjaFdyZCUzRCUyNmJic0NsU2VxJTNEJTI2YmJzT3BlbldyZFNlcSUzRCUyNnJnc0JnbmRlU3RyJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZwYXNzd29yZCUzRCUyNg%3D%3D`,
    requirements: [
      condition('c2001', 'residenceAddress', 'EQ', '경기도 화성시', '주소지 경기도 화성시'),
      condition('c2002', 'enrollmentStatus', 'EQ', 'ENROLLED', '재학생'),
    ],
    documents: documents('d2001', '꿈드림장학금_선발공고.pdf'),
    version: 1,
    updatedAt: '2026-11-01T09:00:00+09:00',
    processingStatus: 'READY',
    collectedAt: '2026-10-31T08:00:00+09:00',
    processingError: null,
  },
  {
    scholarshipId: '1003',
    title: '하나금융나눔재단 하나장학생',
    organization: '하나금융나눔재단',
    description: '테스트용 더미 공고',
    applicationStartAt: '2026-12-01T09:00:00+09:00',
    applicationEndAt: '2026-12-20T18:00:00+09:00',
    applicationPeriodText: '2026년 12월 1일 09:00 ~ 12월 20일 18:00',
    sourceUrl: `${GACHON_NOTICE}Zm5jdDF8QEB8JTJGYmJzJTJGa29yJTJGNDc4JTJGMTI1NzEyJTJGYXJ0Y2xWaWV3LmRvJTNGcGFnZSUzRDElMjZzcmNoQ29sdW1uJTNEJTI2c3JjaFdyZCUzRCUyNmJic0NsU2VxJTNEJTI2YmJzT3BlbldyZFNlcSUzRCUyNnJnc0JnbmRlU3RyJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZwYXNzd29yZCUzRCUyNg%3D%3D`,
    requirements: [
      condition('c3001', 'previousSemesterGpa', 'GTE', 3.5, '직전 학기 학점 3.5 이상'),
      condition('c3002', 'incomeBracket', 'LTE', 8, '소득구간 8구간 이하'),
      condition('c3003', 'other', 'TEXT', null, '봉사활동 경험 우대', false),
    ],
    documents: documents('d3001', '하나장학생_선발공고.pdf'),
    version: 1,
    updatedAt: '2026-11-01T09:00:00+09:00',
    processingStatus: 'READY',
    collectedAt: '2026-11-01T08:00:00+09:00',
    processingError: null,
  },
  {
    // 관리자 화면의 실패 상태 확인용. 사용자 분석에서는 제외된다.
    scholarshipId: '1004',
    title: '[더미] AI 처리 실패 공고',
    organization: null,
    description: null,
    applicationStartAt: null,
    applicationEndAt: null,
    applicationPeriodText: null,
    sourceUrl: `${GACHON_NOTICE}MOCK`,
    requirements: [],
    documents: documents('d4001', '처리실패_공고.hwp', 'HWP'),
    version: 1,
    updatedAt: '2026-11-02T09:00:00+09:00',
    processingStatus: 'FAILED',
    collectedAt: '2026-11-02T08:00:00+09:00',
    processingError: { code: 'DOCUMENT_PARSE_FAILED', message: '문서를 파싱하지 못했습니다.' },
  },
];

export const notifications = [
  {
    notificationId: 'n103',
    type: 'ELIGIBLE_SCHOLARSHIP',
    message: '자격조건을 충족한 장학금이 있습니다.',
    scholarshipId: '1001',
    analysisId: '5001',
    createdAt: '2026-11-03T09:00:00+09:00',
  },
  {
    notificationId: 'n102',
    type: 'DEADLINE_APPROACHING',
    message: '꿈드림 장학금 마감이 다가오고 있습니다.',
    scholarshipId: '1002',
    analysisId: null,
    createdAt: '2026-11-02T09:00:00+09:00',
  },
  {
    notificationId: 'n101',
    type: 'NEW_SCHOLARSHIP',
    message: '새로운 장학금 공고가 등록되었습니다.',
    scholarshipId: '1003',
    analysisId: null,
    createdAt: '2026-11-01T09:00:00+09:00',
  },
];

export const crawlRuns = [
  {
    crawlRunId: '7002',
    status: 'PARTIAL_FAILED',
    startedAt: '2026-11-02T08:00:00+09:00',
    finishedAt: '2026-11-02T08:02:00+09:00',
    discoveredCount: 5,
    collectedCount: 3,
    skippedCount: 1,
    failedCount: 1,
    sourceUrl: 'https://www.gachon.ac.kr/kor/1146/subview.do',
    errors: [
      {
        code: 'DOCUMENT_FETCH_FAILED',
        message: '첨부파일을 내려받지 못했습니다.',
        sourceUrl: `${GACHON_NOTICE}MOCK`,
        occurredAt: '2026-11-02T08:01:00+09:00',
        requestId: 'req-crawl-7002',
      },
    ],
    errorCount: 1,
    errorsTruncated: false,
  },
  {
    crawlRunId: '7001',
    status: 'SUCCEEDED',
    startedAt: '2026-11-01T08:00:00+09:00',
    finishedAt: '2026-11-01T08:01:00+09:00',
    discoveredCount: 5,
    collectedCount: 2,
    skippedCount: 3,
    failedCount: 0,
    sourceUrl: 'https://www.gachon.ac.kr/kor/1146/subview.do',
    errors: [],
    errorCount: 0,
    errorsTruncated: false,
  },
];
