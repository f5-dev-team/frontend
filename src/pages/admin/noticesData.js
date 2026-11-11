// 관리자 공고 목록/상세에서 공유하는 임시 더미 데이터.
// 백엔드/Mock API 연동 전까지 화면 확인용으로만 씁니다.
// 나중에 feature/mock-api 의 실제 데이터로 교체하면 됩니다.

// status: 'open'(모집중) | 'closed'(마감) | 'upcoming'(예정)
export const noticeStatusMeta = {
  open: { label: '모집중', badge: 'success' },
  closed: { label: '마감', badge: 'danger' },
  upcoming: { label: '예정', badge: 'neutral' },
};

export const dummyNotices = [
  {
    id: '1',
    title: '2026학년도 1학기 국가장학금',
    organization: '한국장학재단',
    status: 'open',
    period: '2026-11-01 ~ 2026-11-30',
    target: '소득 8구간 이하 재학생',
    amount: '학기당 최대 2,600,000원',
    sourceUrl: 'https://www.kosaf.go.kr',
    description:
      '소득 구간에 따라 차등 지급되는 대표 국가장학금입니다. 직전 학기 12학점 이상 이수 및 100분위 70점 이상 조건이 적용됩니다.',
  },
  {
    id: '2',
    title: '성실한두반장 교내 성적우수 장학금',
    organization: '학생지원처',
    status: 'open',
    period: '2026-11-05 ~ 2026-11-20',
    target: '직전 학기 평점 4.0 이상 재학생',
    amount: '등록금 50% 감면',
    sourceUrl: 'https://example.ac.kr/scholarship',
    description:
      '직전 학기 성적이 우수한 재학생을 대상으로 하는 교내 장학금입니다. 봉사시간 40시간 이상을 함께 충족해야 합니다.',
  },
  {
    id: '3',
    title: '지역인재 희망 장학금',
    organization: '경기도 인재육성재단',
    status: 'upcoming',
    period: '2026-12-01 ~ 2026-12-15',
    target: '경기도 거주 2학년 이상',
    amount: '1인당 1,000,000원',
    sourceUrl: 'https://example.or.kr/region',
    description:
      '지역 거주 요건을 충족하는 학생을 지원하는 장학금입니다. 접수 기간이 아직 시작되지 않았습니다.',
  },
  {
    id: '4',
    title: '2025학년도 2학기 복지 장학금',
    organization: '학생지원처',
    status: 'closed',
    period: '2025-09-01 ~ 2025-09-20',
    target: '가계 곤란 재학생',
    amount: '학기당 1,500,000원',
    sourceUrl: 'https://example.ac.kr/welfare',
    description:
      '가계 사정이 어려운 재학생을 지원했던 장학금입니다. 접수가 마감되었습니다.',
  },
];

export function findNoticeById(id) {
  return dummyNotices.find((notice) => notice.id === String(id)) ?? null;
}
