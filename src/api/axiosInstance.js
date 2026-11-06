import axios from 'axios';
import { mockAdapter } from './mockAdapter';

// 공용 axios 인스턴스 — 모든 API 요청은 이 인스턴스를 통해서 보냅니다.
// baseURL은 .env 파일의 VITE_API_BASE_URL 값을 사용하고,
// 값이 없으면 '/api/v1'을 기본값으로 씁니다. (.env.example 참고)
// VITE_USE_MOCK=true 이면 실제 서버 대신 더미 데이터로 응답합니다.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  ...(import.meta.env.VITE_USE_MOCK === 'true' && { adapter: mockAdapter }),
});

// 로그인 후 토큰을 넘기면 모든 요청에 자동으로 붙습니다. null을 넘기면 제거합니다.
export const setAuthToken = (token) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};

export default api;
