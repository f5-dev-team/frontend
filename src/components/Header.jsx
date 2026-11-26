import { Link } from 'react-router-dom';

export default function Header({
  title = '장학핏',
  homePath = '/',
  variant = 'user',
  links = [],
  actions = null,
  className = '',
}) {
  const isAdmin = variant === 'admin';

  return (
    <header
      className={`
        border-b border-gray-200 bg-white
        ${className}
      `}
    >
      <div
        className={
          isAdmin
            ? 'flex flex-wrap items-center justify-between gap-4 px-6 py-4'
            : 'mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6'
        }
      >
        {/* 서비스 로고 */}
        <Link
          to={homePath}
          className={`
            text-xl font-bold text-blue-600
            ${
              isAdmin
                ? ''
                : 'text-center sm:text-left'
            }
          `}
        >
          {title}
        </Link>

        {/* 상단 메뉴 */}
        {links.length > 0 && (
          <nav
            aria-label="상단 메뉴"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 transition-colors hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* 로그인 상태, 알림, 로그아웃 등 추후 연결 */}
        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}