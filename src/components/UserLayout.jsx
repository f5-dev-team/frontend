import { Outlet } from 'react-router-dom';
import Header from './Header';

const userLinks = [
  {
    to: '/',
    label: '홈',
  },
  {
    to: '/login',
    label: '로그인',
  },
  {
    to: '/signup',
    label: '회원가입',
  },
];

function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        title="장학핏"
        homePath="/"
        variant="user"
        links={userLinks}
      />

      <Outlet />
    </div>
  );
}

export default UserLayout;