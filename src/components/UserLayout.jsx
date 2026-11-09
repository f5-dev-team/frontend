import { Link, Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600"
          >
            성실한두반장
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              홈
            </Link>

            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              로그인
            </Link>

            <Link to="/signup" className="text-gray-700 hover:text-blue-600">
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