// A-002 관리자 크롤링 관리

import { useState } from 'react';
import { Badge, Button, Select } from '../../components/ui';

const sourceOptions = [
  { value: 'kosaf', label: '한국장학재단' },
  { value: 'school', label: '교내 공지' },
  { value: 'region', label: '지자체 인재재단' },
];

// 최근 크롤링 기록 더미 데이터 (추후 실제 API 로 교체)
const crawlHistory = [
  {
    id: 1,
    source: '한국장학재단',
    runAt: '2026-11-11 09:10',
    collected: 12,
    status: 'success',
  },
  {
    id: 2,
    source: '교내 공지',
    runAt: '2026-11-10 18:40',
    collected: 3,
    status: 'success',
  },
  {
    id: 3,
    source: '지자체 인재재단',
    runAt: '2026-11-10 09:05',
    collected: 0,
    status: 'failed',
  },
];

const crawlStatusMeta = {
  success: { label: '성공', badge: 'success' },
  failed: { label: '실패', badge: 'danger' },
  running: { label: '진행중', badge: 'warning' },
};

function AdminCrawlPage() {
  const [source, setSource] = useState('kosaf');
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');

  const handleRun = () => {
    // 실제 크롤링 실행 API 연동은 추후 진행 (지금은 UI 동작만 흉내)
    setIsRunning(true);
    setMessage('크롤링을 시작했습니다. 잠시 후 결과가 목록에 반영됩니다.');

    setTimeout(() => {
      setIsRunning(false);
      setMessage('크롤링이 완료되었습니다. (데모)');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-blue-600">크롤링 관리</h1>
      <p className="mt-2 text-sm text-gray-600">
        장학금 공고 수집 작업을 실행하고 기록을 확인합니다.
      </p>

      {/* 크롤링 실행 패널 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">크롤링 실행</h2>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-64">
            <Select
              id="source"
              label="수집 대상"
              options={sourceOptions}
              value={source}
              onChange={(event) => setSource(event.target.value)}
            />
          </div>

          <Button onClick={handleRun} disabled={isRunning}>
            {isRunning ? '실행 중...' : '크롤링 실행'}
          </Button>
        </div>

        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </section>

      {/* 최근 크롤링 기록 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-lg font-semibold text-gray-900">
          최근 크롤링 기록
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">실행 일시</th>
                <th className="px-5 py-3 font-semibold">대상</th>
                <th className="px-5 py-3 font-semibold">수집 건수</th>
                <th className="px-5 py-3 font-semibold">결과</th>
              </tr>
            </thead>
            <tbody>
              {crawlHistory.map((row) => {
                const meta = crawlStatusMeta[row.status];

                return (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-3 text-gray-700">{row.runAt}</td>
                    <td className="px-5 py-3 text-gray-700">{row.source}</td>
                    <td className="px-5 py-3 text-gray-700">
                      {row.collected}건
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={meta.badge}>{meta.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminCrawlPage;
