import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <Link
          to="/admin/notices"
          className="text-xl font-bold text-blue-600"
        >
          마이핏 관리자
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          로그아웃
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-65px)]">
        <aside className="w-60 border-r border-gray-200 bg-white p-6">
          <nav className="flex flex-col gap-4">
            <Link
              to="/admin/notices"
              className="text-gray-700 hover:text-blue-600"
            >
              공고 관리
            </Link>

            <Link
              to="/admin/crawl"
              className="text-gray-700 hover:text-blue-600"
            >
              크롤링 관리
            </Link>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;