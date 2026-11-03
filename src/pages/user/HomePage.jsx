// W-000: 사용자 홈페이지

import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';

function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="mb-4 text-3xl font-bold text-blue-600">
        성실한두반장
      </h1>

      <p className="mb-6 text-gray-700">
        나에게 맞는 장학금을 찾아보세요!
      </p>

      <div className="flex gap-3">
        <Button onClick={handleLogin}>
          로그인
        </Button>

        <Button variant="secondary" onClick={handleSignup}>
          회원가입
        </Button>
      </div>
    </main>
  );
}

export default HomePage;