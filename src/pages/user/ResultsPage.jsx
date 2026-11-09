// W-004: 장학금 추천 결과 페이지

import { Badge } from '../../components/ui';

function ResultsPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-600">
        장학금 추천 결과
      </h1>

      <p className="mb-6 text-gray-700">
        나에게 맞는 장학금을 확인해 보세요!
      </p>

      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              국가장학금
            </h2>
            <Badge variant="success">모집중</Badge>
          </div>
          <p className="text-sm text-gray-600">
            장학금 정보가 표시되는 영역입니다.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              교내장학금
            </h2>
            <Badge variant="danger">마감</Badge>
          </div>
          <p className="text-sm text-gray-600">
            장학금 정보가 표시되는 영역입니다.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              지역인재장학금
            </h2>
            <Badge variant="neutral">예정</Badge>
          </div>
          <p className="text-sm text-gray-600">
            장학금 정보가 표시되는 영역입니다.
          </p>
        </div>
      </div>
    </main>
  );
}

export default ResultsPage;