import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

import HomePage from './pages/user/HomePage';
import SignupPage from './pages/user/SignupPage';
import LoginPage from './pages/user/LoginPage';
import ProfilePage from './pages/user/ProfilePage';
import ResultsPage from './pages/user/ResultsPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminNoticesPage from './pages/admin/AdminNoticesPage';
import AdminCrawlPage from './pages/admin/AdminCrawlPage';
import AdminNoticeDetailPage from './pages/admin/AdminNoticeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 사용자 페이지 */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>

        {/* 관리자 로그인: 공통 레이아웃 적용 안 함 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 관리자 페이지: 공통 레이아웃 적용 */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/notices" element={<AdminNoticesPage />} />
          <Route path="/admin/crawl" element={<AdminCrawlPage />} />
          <Route
            path="/admin/notices/:id"
            element={<AdminNoticeDetailPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;