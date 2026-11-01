import axios from 'axios';

// 공용 axios 인스턴스 — 모든 API 요청은 이 인스턴스를 통해서 보냅니다.
// baseURL은 .env 파일의 VITE_API_BASE_URL 값을 사용하고,
// 값이 없으면 '/api'를 기본값으로 씁니다. (.env.example 참고)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
