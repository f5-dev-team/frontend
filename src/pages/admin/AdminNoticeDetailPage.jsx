// A-003 관리자 공고 상세

import { useParams } from 'react-router-dom';

function AdminNoticeDetailPage() {
  const { id } = useParams();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        장학금 공고 상세
      </h1>

      <p className="mt-4 text-gray-600">
        선택한 장학금 공고의 상세 정보를 확인하는 페이지입니다.
      </p>

      <p className="mt-4 font-semibold text-gray-800">
        공고 ID: {id}
      </p>
    </main>
  );
}

export default AdminNoticeDetailPage;