// A-003 관리자 공고 상세 (API-014 조회, API-015 수정)

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge, Button, Field } from '../../components/ui';
import { Modal } from '../../components/Modal';
import { getAdminScholarship, updateAdminScholarship } from '../../api';
import { formatDateTime, getErrorMessage } from '../../utils/format';
import { getNoticeStatus, noticeStatusMeta } from './scholarshipStatus';

const EDITABLE_FIELDS = ['title', 'organization', 'applicationPeriodText', 'description'];

function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[120px_1fr] sm:gap-4">
      <dt className="text-sm font-semibold text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{children ?? '-'}</dd>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/admin/notices" className="text-sm font-semibold text-blue-600 hover:underline">
      ← 공고 목록으로
    </Link>
  );
}

function AdminNoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const loadNotice = () =>
    getAdminScholarship(id).then((data) => {
      setNotice(data);
      return data;
    });

  useEffect(() => {
    let ignore = false;

    getAdminScholarship(id)
      .then((data) => {
        if (!ignore) setNotice(data);
      })
      .catch((error) => {
        if (!ignore) setLoadError(error);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const openEdit = () => {
    setForm(Object.fromEntries(EDITABLE_FIELDS.map((key) => [key, notice[key] ?? ''])));
    setSaveError('');
    setSavedMessage('');
    setIsEditOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setSaveError('제목은 비울 수 없습니다.');
      return;
    }

    // 바뀐 항목만 보냅니다. 빈 칸은 null로 저장합니다.
    const changes = Object.fromEntries(
      EDITABLE_FIELDS.map((key) => [key, form[key].trim() || null]).filter(
        ([key, value]) => value !== (notice[key] ?? null),
      ),
    );
    if (Object.keys(changes).length === 0) {
      setIsEditOpen(false);
      return;
    }

    setIsSaving(true);
    setSaveError('');
    try {
      const updated = await updateAdminScholarship(notice.scholarshipId, {
        ...changes,
        version: notice.version,
      });
      setNotice(updated);
      setIsEditOpen(false);
      setSavedMessage('수정 내용을 저장했습니다.');
    } catch (error) {
      // 409: 그사이 다른 관리자가 먼저 수정함 → 최신 내용을 다시 불러온다
      if (error?.response?.status === 409) {
        await loadNotice().catch(() => {});
      }
      setSaveError(getErrorMessage(error, '저장하지 못했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
        <BackLink />
        <p className="mt-6 text-sm text-gray-500">공고를 불러오는 중입니다...</p>
      </main>
    );
  }

  // 존재하지 않는 공고 ID 처리 + 그 밖의 오류
  if (loadError || !notice) {
    const isNotFound = loadError?.response?.status === 404;
    return (
      <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNotFound ? '공고를 찾을 수 없습니다' : '공고를 불러오지 못했습니다'}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {isNotFound
            ? `요청한 공고(ID: ${id})가 존재하지 않습니다.`
            : getErrorMessage(loadError)}
        </p>
        <div className="mt-4">
          <BackLink />
        </div>
      </main>
    );
  }

  const meta = noticeStatusMeta[getNoticeStatus(notice)];

  return (
    <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <BackLink />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{notice.title}</h1>
          <Badge variant={meta.badge}>{meta.label}</Badge>
        </div>

        <Button variant="secondary" onClick={openEdit}>
          수정
        </Button>
      </div>

      {savedMessage && (
        <p role="status" className="mt-3 text-sm text-green-700">
          {savedMessage}
        </p>
      )}

      {notice.processingError && (
        <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          AI 처리 실패: {notice.processingError.message} ({notice.processingError.code})
        </div>
      )}

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <dl className="divide-y divide-gray-100">
          <DetailRow label="주관 기관">{notice.organization}</DetailRow>
          <DetailRow label="접수 기간">
            {notice.applicationPeriodText ??
              (notice.applicationEndAt
                ? `${formatDateTime(notice.applicationStartAt)} ~ ${formatDateTime(notice.applicationEndAt)}`
                : null)}
          </DetailRow>
          <DetailRow label="지원 조건">
            {notice.requirements.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5">
                {notice.requirements.map((condition) => (
                  <li key={condition.conditionId}>
                    {condition.description}
                    {!condition.required && (
                      <span className="ml-2 text-xs text-gray-500">(우대)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </DetailRow>
          <DetailRow label="상세 설명">{notice.description}</DetailRow>
          <DetailRow label="첨부 문서">
            {notice.documents.length > 0
              ? notice.documents.map((doc) => `${doc.fileName} (${doc.fileType})`).join(', ')
              : null}
          </DetailRow>
          <DetailRow label="공고 원문">
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              원문 보기
            </a>
          </DetailRow>
          <DetailRow label="수집 일시">{formatDateTime(notice.collectedAt)}</DetailRow>
          <DetailRow label="최근 수정">{formatDateTime(notice.updatedAt)}</DetailRow>
        </dl>
      </section>

      <p className="mt-4 text-xs text-gray-400">
        공고 ID: {notice.scholarshipId} · 버전 {notice.version}
      </p>

      <Modal
        open={isEditOpen}
        title="공고 수정"
        onClose={() => setIsEditOpen(false)}
        footer={
          <>
            <Button variant="neutral" onClick={() => setIsEditOpen(false)}>
              취소
            </Button>
            <Button type="submit" form="notice-edit-form" disabled={isSaving}>
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </>
        }
      >
        <form id="notice-edit-form" onSubmit={handleSave} noValidate className="space-y-4">
          <Field
            id="edit-title"
            label="제목"
            required
            value={form.title ?? ''}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <Field
            id="edit-organization"
            label="주관 기관"
            value={form.organization ?? ''}
            onChange={(event) => setForm({ ...form, organization: event.target.value })}
          />
          <Field
            id="edit-period"
            label="접수 기간 (표시용 문구)"
            value={form.applicationPeriodText ?? ''}
            onChange={(event) =>
              setForm({ ...form, applicationPeriodText: event.target.value })
            }
          />
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
              상세 설명
            </label>
            <textarea
              id="edit-description"
              rows={4}
              value={form.description ?? ''}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {saveError && (
            <p role="alert" className="text-sm text-red-600">
              {saveError}
            </p>
          )}
        </form>
      </Modal>
    </main>
  );
}

export default AdminNoticeDetailPage;
