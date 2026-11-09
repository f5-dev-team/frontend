
import { Link, Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link
            to="/"
            className="text-center text-xl font-bold text-blue-600 sm:text-left"
          >
            성실한두반장
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600"
            >
              홈
            </Link>

            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600"
            >
              로그인
            </Link>

            <Link
              to="/signup"
              className="text-gray-700 hover:text-blue-600"
            >
              회원가입
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default UserLayout;
