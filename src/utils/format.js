// '2026-12-31T18:00:00+09:00' → '2026-12-31 18:00' (값이 없으면 '-')
export const formatDateTime = (iso) => (iso ? iso.slice(0, 16).replace('T', ' ') : '-');

// '2026-12-31T18:00:00+09:00' → '2026-12-31'
export const formatDate = (iso) => (iso ? iso.slice(0, 10) : '-');

// API 오류(RFC 9457)에서 사용자에게 보여 줄 문장을 꺼냅니다.
export const getErrorMessage = (error, fallback = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.') =>
  error?.response?.data?.detail ?? fallback;
