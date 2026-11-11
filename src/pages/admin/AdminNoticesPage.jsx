// A-001 관리자 공고 목록

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Field, Select } from '../../components/ui';
import { dummyNotices, noticeStatusMeta } from './noticesData';

const statusFilterOptions = [
  { value: 'all', label: '전체 상태' },
  { value: 'open', label: '모집중' },
  { value: 'upcoming', label: '예정' },
  { value: 'closed', label: '마감' },
];

function AdminNoticesPage() {
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 검색어/상태 필터를 적용한 공고 목록
  const filteredNotices = useMemo(() => {
    const trimmed = keyword.trim();

    return dummyNotices.filter((notice) => {
      const matchKeyword =
        !trimmed ||
        notice.title.includes(trimmed) ||
        notice.organization.includes(trimmed);
      const matchStatus =
        statusFilter === 'all' || notice.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [keyword, statusFilter]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">
            장학금 공고 관리
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            등록된 장학금 공고를 확인하고 관리합니다.
          </p>
        </div>

        <Button>+ 새 공고 등록</Button>
      </div>

      {/* 검색/필터 */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_200px]">
        <Field
          id="search"
          label="검색"
          placeholder="공고 제목 또는 기관명으로 검색"
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
              <th className="px-4 py-3 font-semibold">기관</th>
              <th className="px-4 py-3 font-semibold">상태</th>
              <th className="px-4 py-3 font-semibold">접수 기간</th>
              <th className="px-4 py-3 font-semibold text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotices.map((notice) => {
              const meta = noticeStatusMeta[notice.status];

              return (
                <tr
                  key={notice.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {notice.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {notice.organization}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={meta.badge}>{meta.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {notice.period}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/notices/${notice.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      상세
                    </Link>
                  </td>
                </tr>
              );
            })}

            {filteredNotices.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  조건에 맞는 공고가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        총 {filteredNotices.length}건의 공고
      </p>
    </main>
  );
}

export default AdminNoticesPage;
