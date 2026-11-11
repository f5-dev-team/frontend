// A-003 관리자 공고 상세

import { Link, useParams } from 'react-router-dom';
import { Badge, Button } from '../../components/ui';
import { findNoticeById, noticeStatusMeta } from './noticesData';

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[120px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children}</dd>
    </div>
  );
}

function AdminNoticeDetailPage() {
  const { id } = useParams();
  const notice = findNoticeById(id);

  // 존재하지 않는 공고 ID 처리
  if (!notice) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          공고를 찾을 수 없습니다
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          요청한 공고(ID: {id})가 존재하지 않습니다.
        </p>
        <Link
          to="/admin/notices"
          className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
        >
          ← 공고 목록으로
        </Link>
      </main>
    );
  }

  const meta = noticeStatusMeta[notice.status];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <Link
        to="/admin/notices"
        className="text-sm font-semibold text-blue-600 hover:underline"
      >
        ← 공고 목록으로
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {notice.title}
          </h1>
          <Badge variant={meta.badge}>{meta.label}</Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary">수정</Button>
          <Button variant="neutral">삭제</Button>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <dl className="divide-y divide-gray-100">
          <DetailRow label="주관 기관">{notice.organization}</DetailRow>
          <DetailRow label="접수 기간">{notice.period}</DetailRow>
          <DetailRow label="지원 대상">{notice.target}</DetailRow>
          <DetailRow label="지원 금액">{notice.amount}</DetailRow>
          <DetailRow label="상세 설명">{notice.description}</DetailRow>
          <DetailRow label="공고 원문">
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {notice.sourceUrl}
            </a>
          </DetailRow>
        </dl>
      </section>

      <p className="mt-4 text-xs text-gray-400">공고 ID: {notice.id}</p>
    </main>
  );
}

export default AdminNoticeDetailPage;
