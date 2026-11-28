// 공통 모달
// 사용 예:
//   <Modal open={isOpen} title="공고 수정" onClose={() => setIsOpen(false)}
//     footer={<><Button variant="neutral" onClick={close}>취소</Button><Button>저장</Button></>}>
//     내용
//   </Modal>
// - 바깥(어두운 배경)을 누르거나 ESC를 누르면 onClose가 호출됩니다.
// - 열려 있는 동안 뒤 페이지 스크롤을 막습니다.

import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  title,
  onClose,
  footer = null,
  size = 'md',
  closeOnBackdrop = true,
  children,
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`flex max-h-full w-full ${sizes[size] ?? sizes.md} flex-col rounded-2xl bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
          {title && (
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="ml-auto rounded-lg px-2 py-1 text-xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 text-sm text-gray-700">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

// 확인/취소 두 버튼만 있는 간단한 확인창
export function ConfirmModal({
  open,
  title = '확인',
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onClose,
  isLoading = false,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? '처리 중...' : confirmLabel}
          </Button>
        </>
      }
    >
      {message}
    </Modal>
  );
}

export default Modal;
