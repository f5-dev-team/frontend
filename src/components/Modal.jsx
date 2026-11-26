import { useEffect, useId, useRef } from 'react';
import { Button } from './ui';

export default function Modal({
  open = false,
  onClose,
  title = '안내',
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  closeButtonText = '닫기',
  className = '',
}) {
  const titleId = useId();
  const modalRef = useRef(null);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  // 모달이 열려 있을 때 스크롤 및 키보드 제어
  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    const previousFocus =
      document.activeElement;

    document.body.style.overflow = 'hidden';

    modalRef.current?.focus();

    const handleKeyDown = (event) => {
      // ESC 키로 닫기
      if (event.key === 'Escape' && closeOnEscape) {
        event.preventDefault();
        onClose?.();
      }

      // Tab 키가 모달 밖으로 이동하지 않도록 제한
      if (event.key === 'Tab') {
        const focusableElements =
          modalRef.current?.querySelectorAll(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );

        if (!focusableElements?.length) {
          event.preventDefault();
          return;
        }

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
            focusableElements.length - 1
          ];

        if (
          event.shiftKey &&
          (
            document.activeElement === firstElement ||
            document.activeElement === modalRef.current
          )
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        'keydown',
        handleKeyDown
      );

      previousFocus?.focus?.();
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (
          closeOnBackdrop &&
          event.target === event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`
          flex max-h-[90vh] w-full flex-col
          overflow-hidden rounded-2xl border
          border-gray-400 bg-white shadow-xl
          outline-none
          ${sizes[size] ?? sizes.md}
          ${className}
        `}
      >
        {/* 모달 제목 영역 */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-300 px-6 py-4">
          <h2
            id={titleId}
            className="text-lg font-bold text-gray-900"
          >
            {title}
          </h2>

          {showCloseButton && (
            <button
              type="button"
              aria-label="모달 닫기"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-2xl text-gray-600 transition-colors hover:bg-gray-100"
            >
              ×
            </button>
          )}
        </header>

        {/* 모달 본문 영역 */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-gray-700">
          {children}
        </div>

        {/* 모달 하단 버튼 영역 */}
        <footer className="shrink-0 border-t border-gray-300 px-6 py-4">
          {footer !== undefined ? (
            footer
          ) : (
            <Button
              fullWidth
              onClick={onClose}
            >
              {closeButtonText}
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}