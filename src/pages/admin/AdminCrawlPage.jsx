// A-002 관리자 크롤링 관리 (API-016 목록, API-017 상세)
// 크롤링 실행 API는 아직 설계서에 없어서, 지금은 실행 기록 조회만 합니다.

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Select } from '../../components/ui';
import { Modal } from '../../components/Modal';
import { getCrawlRun, getCrawlRuns } from '../../api';
import { formatDateTime, getErrorMessage } from '../../utils/format';

const crawlStatusMeta = {
  QUEUED: { label: '대기', badge: 'neutral' },
  RUNNING: { label: '진행중', badge: 'warning' },
  SUCCEEDED: { label: '성공', badge: 'success' },
  PARTIAL_FAILED: { label: '일부 실패', badge: 'warning' },
  FAILED: { label: '실패', badge: 'danger' },
};

const statusFilterOptions = [
  { value: 'all', label: '전체 결과' },
  ...Object.entries(crawlStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
];

const getMeta = (status) => crawlStatusMeta[status] ?? { label: status, badge: 'neutral' };

function AdminCrawlPage() {
  const [runs, setRuns] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [selectedRun, setSelectedRun] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 로딩 표시는 호출하는 쪽(필터 변경·새로고침)에서 켭니다.
  const loadRuns = useCallback(() => {
    return getCrawlRuns({
      page: 0,
      size: 20,
      ...(statusFilter !== 'all' && { status: statusFilter }),
    })
      .then((result) => {
        setRuns(result.items);
        setLoadError('');
      })
      .catch((error) =>
        setLoadError(getErrorMessage(error, '크롤링 기록을 불러오지 못했습니다.')),
      )
      .finally(() => setIsLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const openDetail = async (crawlRunId) => {
    setSelectedRun(null);
    setDetailError('');
    setIsDetailOpen(true);
    try {
      setSelectedRun(await getCrawlRun(crawlRunId));
    } catch (error) {
      setDetailError(getErrorMessage(error, '상세 기록을 불러오지 못했습니다.'));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-blue-600">크롤링 관리</h1>
      <p className="mt-2 text-sm text-gray-600">
        장학금 공고 수집 작업의 실행 기록을 확인합니다.
      </p>

      {/* 필터 + 새로고침 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-64">
            <Select
              id="crawlStatus"
              label="결과"
              options={statusFilterOptions}
              placeholder="전체 결과"
              value={statusFilter}
              onChange={(event) => {
                setIsLoading(true);
                setStatusFilter(event.target.value);
              }}
            />
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setIsLoading(true);
              loadRuns();
            }}
            disabled={isLoading}
          >
            {isLoading ? '불러오는 중...' : '새로고침'}
          </Button>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          크롤링은 서버에서 정해진 시간에 자동으로 실행됩니다.
        </p>
      </section>

      {/* 최근 크롤링 기록 */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white">
        <h2 className="border-b border-gray-200 px-5 py-4 text-lg font-semibold text-gray-900">
          최근 크롤링 기록
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-3 font-semibold">실행 일시</th>
                <th className="px-5 py-3 font-semibold">결과</th>
                <th className="px-5 py-3 font-semibold">발견</th>
                <th className="px-5 py-3 font-semibold">수집</th>
                <th className="px-5 py-3 font-semibold">건너뜀</th>
                <th className="px-5 py-3 font-semibold">실패</th>
                <th className="px-5 py-3 font-semibold text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                !loadError &&
                runs.map((run) => {
                  const meta = getMeta(run.status);

                  return (
                    <tr key={run.crawlRunId} className="border-b border-gray-100 last:border-0">
                      <td className="px-5 py-3 text-gray-700">{formatDateTime(run.startedAt)}</td>
                      <td className="px-5 py-3">
                        <Badge variant={meta.badge}>{meta.label}</Badge>
                      </td>
                      <td className="px-5 py-3 text-gray-700">{run.discoveredCount}건</td>
                      <td className="px-5 py-3 text-gray-700">{run.collectedCount}건</td>
                      <td className="px-5 py-3 text-gray-700">{run.skippedCount}건</td>
                      <td className="px-5 py-3 text-gray-700">{run.failedCount}건</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openDetail(run.crawlRunId)}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          상세
                        </button>
                      </td>
                    </tr>
                  );
                })}

              {(isLoading || loadError || runs.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className={`px-5 py-10 text-center ${loadError ? 'text-red-600' : 'text-gray-400'}`}
                  >
                    {isLoading
                      ? '기록을 불러오는 중입니다...'
                      : loadError || '크롤링 기록이 없습니다.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={isDetailOpen}
        title="크롤링 상세 기록"
        size="lg"
        onClose={() => setIsDetailOpen(false)}
        footer={
          <Button variant="neutral" onClick={() => setIsDetailOpen(false)}>
            닫기
          </Button>
        }
      >
        {detailError && <p className="text-red-600">{detailError}</p>}
        {!detailError && !selectedRun && <p className="text-gray-500">불러오는 중입니다...</p>}
        {selectedRun && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getMeta(selectedRun.status).badge}>
                {getMeta(selectedRun.status).label}
              </Badge>
              <span className="text-gray-500">
                {formatDateTime(selectedRun.startedAt)} ~ {formatDateTime(selectedRun.finishedAt)}
              </span>
            </div>
            <p>
              수집 대상:{' '}
              <a
                href={selectedRun.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedRun.sourceUrl}
              </a>
            </p>
            <p>
              발견 {selectedRun.discoveredCount}건 · 수집 {selectedRun.collectedCount}건 · 건너뜀{' '}
              {selectedRun.skippedCount}건 · 실패 {selectedRun.failedCount}건
            </p>

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                오류 {selectedRun.errorCount}건
              </h3>
              {selectedRun.errors.length === 0 ? (
                <p className="text-gray-500">오류가 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedRun.errors.map((error) => (
                    <li
                      key={error.requestId}
                      className="rounded-lg border border-red-100 bg-red-50 p-3 text-red-700"
                    >
                      <p className="font-medium">{error.message}</p>
                      <p className="mt-1 text-xs">
                        {error.code} · {formatDateTime(error.occurredAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {selectedRun.errorsTruncated && (
                <p className="mt-2 text-xs text-gray-500">오류가 많아 일부만 표시합니다.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

export default AdminCrawlPage;
