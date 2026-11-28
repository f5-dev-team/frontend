import api from './axiosInstance';

// 화면에서는 axios를 직접 쓰지 않고 이 파일의 함수만 사용한다. (설계서 7.3)
// 성공하면 응답의 data를 돌려주고, 실패하면 error.response.data에 RFC 9457 오류가 들어 있다.

const unwrap = (response) => response.data.data;

// 사용자
export const registerUser = (body) => api.post('/users', body).then(unwrap); // API-001
export const login = (body) => api.post('/sessions', body).then(unwrap); // API-002
export const getStudentProfile = () => api.get('/users/me/student-profile').then(unwrap); // API-003
export const saveStudentProfile = (body) =>
  api.put('/users/me/student-profile', body).then(unwrap); // API-004
export const requestAnalysis = (profileVersion) =>
  api.post('/analyses', { profileVersion }).then(unwrap); // API-005
export const getAnalysis = (analysisId) => api.get(`/analyses/${analysisId}`).then(unwrap); // API-006
export const getRecommendations = (analysisId, params) =>
  api.get(`/analyses/${analysisId}/recommendations`, { params }).then(unwrap); // API-007
export const getEvidence = (analysisId, scholarshipId) =>
  api.get(`/analyses/${analysisId}/recommendations/${scholarshipId}/evidence`).then(unwrap); // API-008
export const getScholarship = (scholarshipId) =>
  api.get(`/scholarships/${scholarshipId}`).then(unwrap); // API-009
export const getScholarshipDocument = (scholarshipId, documentId) =>
  api.get(`/scholarships/${scholarshipId}/documents/${documentId}`).then(unwrap); // API-010
export const getNotifications = (params) =>
  api.get('/users/me/notifications', { params }).then(unwrap); // API-011

// 관리자
export const adminLogin = (body) => api.post('/admin/sessions', body).then(unwrap); // API-012
export const getAdminScholarships = (params) =>
  api.get('/admin/scholarships', { params }).then(unwrap); // API-013
export const getAdminScholarship = (scholarshipId) =>
  api.get(`/admin/scholarships/${scholarshipId}`).then(unwrap); // API-014
export const updateAdminScholarship = (scholarshipId, body) =>
  api.patch(`/admin/scholarships/${scholarshipId}`, body).then(unwrap); // API-015
export const getCrawlRuns = (params) => api.get('/admin/crawl-runs', { params }).then(unwrap); // API-016
export const getCrawlRun = (crawlRunId) =>
  api.get(`/admin/crawl-runs/${crawlRunId}`).then(unwrap); // API-017
export const getAdminScholarshipDocument = (scholarshipId, documentId) =>
  api.get(`/admin/scholarships/${scholarshipId}/documents/${documentId}`).then(unwrap); // API-018
