// A-001 관리자 공고 목록 (API-013)

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Field, Select } from '../../components/ui';
import { getAdminScholarships } from '../../api';
import { formatDate, formatDateTime, getErrorMessage } from '../../utils/format';
import { getNoticeStatus, noticeStatusMeta } from './scholarshipStatus';

const statusFilterOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'open', label: '모집중' },
  { value: 'closed', label: '마감' },
  { value: 'failed', label: '처리 실패' },
  { value: 'unknown', label: '기간 미정' },
];

function AdminNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let ignore = false;

    getAdminScholarships({ page: 0, size: 100 })
      .then((result) => {
        if (!ignore) setNotices(result.items);
      })
      .catch((error) => {
        if (!ignore) setLoadError(getErrorMessage(error, '공고 목록을 불러오지 못했습니다.'));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // 검색어/상태 필터를 적용한 공고 목록
  const filteredNotices = useMemo(() => {
    const trimmed = keyword.trim();

    return notices.filter((notice) => {
      const matchKeyword = !trimmed || notice.title.includes(trimmed);
      const matchStatus =
        statusFilter === 'all' || getNoticeStatus(notice) === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [notices, keyword, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-600">장학금 공고 관리</h1>
        <p className="mt-2 text-sm text-gray-600">
          수집된 장학금 공고를 확인하고 관리합니다.
        </p>
      </div>

      {/* 검색/필터 */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
        <Field
          id="search"
          label="검색"
          placeholder="공고 제목으로 검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <Select
          id="statusFilter"
          label="상태"
          options={statusFilterOptions}
          placeholder="전체 상태"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        />
      </div>

      {/* 공고 테이블 */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold">상태</th>
              <th className="px-4 py-3 font-semibold">마감 일시</th>
              <th className="px-4 py-3 font-semibold">수집일</th>
              <th className="px-4 py-3 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              !loadError &&
              filteredNotices.map((notice) => {
                const meta = noticeStatusMeta[getNoticeStatus(notice)];

                return (
                  <tr
                    key={notice.scholarshipId}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{notice.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant={meta.badge}>{meta.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDateTime(notice.applicationEndAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(notice.collectedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/notices/${notice.scholarshipId}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                );
              })}

            {(isLoading || loadError || filteredNotices.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className={`px-4 py-10 text-center ${loadError ? 'text-red-600' : 'text-gray-400'}`}
                >
                  {isLoading
                    ? '공고를 불러오는 중입니다...'
                    : loadError || '조건에 맞는 공고가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !loadError && (
        <p className="mt-4 text-sm text-gray-500">총 {filteredNotices.length}건의 공고</p>
      )}
    </main>
  );
}

export default AdminNoticesPage;
