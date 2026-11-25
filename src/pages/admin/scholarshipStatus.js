// 관리자 화면에서 공고 상태를 배지로 보여 주기 위한 규칙.
// - AI 처리 실패(processingStatus=FAILED)는 가장 먼저 표시
// - 그 외에는 마감 일시(applicationEndAt) 기준으로 모집중/마감
export const noticeStatusMeta = {
  open: { label: '모집중', badge: 'success' },
  upcoming: { label: '예정', badge: 'neutral' },
  closed: { label: '마감', badge: 'danger' },
  failed: { label: '처리 실패', badge: 'warning' },
  unknown: { label: '기간 미정', badge: 'neutral' },
};

export const getNoticeStatus = (scholarship, now = Date.now()) => {
  if (scholarship.processingStatus === 'FAILED') return 'failed';

  const { applicationStartAt, applicationEndAt } = scholarship;
  if (!applicationEndAt) return 'unknown';
  if (Date.parse(applicationEndAt) < now) return 'closed';
  if (applicationStartAt && Date.parse(applicationStartAt) > now) return 'upcoming';
  return 'open';
};
