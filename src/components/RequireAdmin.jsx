import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

// 관리자 로그인 전에는 관리자 화면 대신 로그인 화면으로 보냅니다.
function RequireAdmin() {
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  if (role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export default RequireAdmin;
