import { useId } from 'react';

// 공통 입력창 스타일
const controlStyle =
  'w-full min-w-0 min-h-[46px] rounded-lg border bg-white px-3 py-2.5 text-base text-gray-800 placeholder:text-gray-500 outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-200';

const normalStyle =
  'border-gray-400 focus:border-blue-600 focus:ring-blue-100';

const errorStyle =
  'border-orange-500 bg-orange-50 focus:border-orange-500 focus:ring-orange-100';

const labelStyle =
  'block text-sm font-semibold text-gray-800';

const errorTextStyle =
  'text-xs font-medium text-orange-700';

const helperTextStyle =
  'text-xs leading-relaxed text-gray-600';


// ==================================================
// Button
// 공통 버튼 컴포넌트
// ==================================================

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  loadingText = '처리 중...',
  fullWidth = false,
  className = '',
  ...props
}) {
  const baseStyle =
    'inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700',

    secondary:
      'border border-blue-600 bg-white text-blue-700 hover:bg-blue-50',

    neutral:
      'bg-gray-200 text-gray-700 hover:bg-gray-300',

    outline:
      'border border-gray-400 bg-white text-gray-700 hover:bg-gray-100',

    danger:
      'bg-red-600 text-white hover:bg-red-700',

    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        ${baseStyle}
        ${variants[variant] ?? variants.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}

      {loading ? loadingText : children}
    </button>
  );
}


// ==================================================
// Badge
// 공통 상태 표시 컴포넌트
// ==================================================

export function Badge({
  children,
  variant = 'success',
  className = '',
  ...props
}) {
  const baseStyle =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';

  const variants = {
    success:
      'bg-green-100 text-green-700',

    danger:
      'bg-red-100 text-red-700',

    warning:
      'bg-yellow-100 text-yellow-800',

    neutral:
      'bg-gray-100 text-gray-700',

    eligible:
      '!rounded-md bg-blue-700 px-3 py-2 text-sm font-bold text-white',

    ineligible:
      '!rounded-md bg-orange-600 px-3 py-2 text-sm font-bold text-white',

    uncertain:
      '!rounded-md bg-gray-600 px-3 py-2 text-sm font-bold text-white',
  };

  return (
    <span
      className={`
        ${baseStyle}
        ${variants[variant] ?? variants.neutral}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}


// ==================================================
// FieldLabel
// 공통 입력 항목 제목
// ==================================================

export function FieldLabel({
  children,
  htmlFor,
  required = false,
  className = '',
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`${labelStyle} ${className}`}
    >
      {children}

      {required && (
        <span className="ml-1 text-red-500">
          *
        </span>
      )}
    </label>
  );
}


// ==================================================
// Field
// 공통 입력창 컴포넌트
// ==================================================

export function Field({
  label,
  id,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  helperText = '',
  suffix = '',
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const describedBy = [
    props['aria-describedby'],
    error ? `${inputId}-error` : '',
    helperText ? `${inputId}-helper` : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div
      className={`
        flex min-w-0 flex-col gap-2
        ${wrapperClassName}
      `}
    >
      {label && (
        <FieldLabel
          htmlFor={inputId}
          required={required}
        >
          {label}
        </FieldLabel>
      )}

      <div className="flex min-w-0 items-center gap-2">
        <input
          {...props}
          id={inputId}
          type={type}
          placeholder={placeholder}
          required={required}
          aria-invalid={
            error ? true : props['aria-invalid']
          }
          aria-describedby={describedBy}
          className={`
            ${controlStyle}
            ${error ? errorStyle : normalStyle}
            ${className}
          `}
        />

        {suffix && (
          <span className="shrink-0 text-sm font-medium text-gray-600">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className={errorTextStyle}
        >
          {error}
        </p>
      )}

      {helperText && (
        <p
          id={`${inputId}-helper`}
          className={helperTextStyle}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}


// ==================================================
// Select
// 공통 드롭다운 컴포넌트
// ==================================================

export function Select({
  label,
  id,
  options = [],
  groups = [],
  placeholder = '선택하세요',
  placeholderDisabled = true,
  required = false,
  error = '',
  helperText = '',
  className = '',
  wrapperClassName = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const selectId = id || generatedId;

  const describedBy = [
    props['aria-describedby'],
    error ? `${selectId}-error` : '',
    helperText ? `${selectId}-helper` : '',
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div
      className={`
        flex min-w-0 flex-col gap-2
        ${wrapperClassName}
      `}
    >
      {label && (
        <FieldLabel
          htmlFor={selectId}
          required={required}
        >
          {label}
        </FieldLabel>
      )}

      <select
        {...props}
        id={selectId}
        required={required}
        aria-invalid={
          error ? true : props['aria-invalid']
        }
        aria-describedby={describedBy}
        className={`
          ${controlStyle}
          ${error ? errorStyle : normalStyle}
          ${className}
        `}
      >
        {placeholder && (
          <option
            value=""
            disabled={placeholderDisabled}
          >
            {placeholder}
          </option>
        )}

        {/* 일반 선택 목록 */}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}

        {/* 그룹별 선택 목록 */}
        {groups.map((group) => (
          <optgroup
            key={group.label}
            label={group.label}
          >
            {group.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}

        {/* 직접 전달한 선택 목록 */}
        {children}
      </select>

      {error && (
        <p
          id={`${selectId}-error`}
          role="alert"
          className={errorTextStyle}
        >
          {error}
        </p>
      )}

      {helperText && (
        <p
          id={`${selectId}-helper`}
          className={helperTextStyle}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}


// ==================================================
// Checkbox
// 공통 체크박스 컴포넌트
// ==================================================

export function Checkbox({
  id,
  label,
  checked = false,
  disabled = false,
  className = '',
  inputClassName = '',
  ...props
}) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={`
        flex min-w-0 items-center gap-3
        text-sm font-medium text-gray-800
        ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer'
        }
        ${className}
      `}
    >
      <input
        {...props}
        id={checkboxId}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className={`
          h-5 w-5 shrink-0 rounded
          border-gray-400 accent-blue-700
          ${inputClassName}
        `}
      />

      <span>{label}</span>
    </label>
  );
}


// ==================================================
// RadioGroup
// 공통 단일 선택 컴포넌트
// ==================================================

export function RadioGroup({
  label,
  name,
  options = [],
  value = '',
  onChange,
  required = false,
  disabled = false,
  error = '',
  className = '',
}) {
  const generatedId = useId();
  const groupName = name || generatedId;

  return (
    <fieldset
      disabled={disabled}
      aria-describedby={
        error ? `${generatedId}-error` : undefined
      }
      className={`min-w-0 ${className}`}
    >
      {label && (
        <legend className={`mb-2 ${labelStyle}`}>
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </legend>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          const optionDisabled =
            disabled || option.disabled;

          return (
            <label
              key={option.value}
              className={`
                flex min-h-[46px] min-w-0 flex-1
                items-center justify-center gap-2
                rounded-lg border px-3 py-2.5
                text-sm font-medium
                ${
                  selected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-400 bg-white text-gray-700 hover:bg-gray-50'
                }
                ${
                  optionDisabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }
              `}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={selected}
                required={required}
                disabled={optionDisabled}
                aria-invalid={Boolean(error)}
                onChange={(event) =>
                  onChange?.(event)
                }
                className="h-4 w-4 shrink-0 accent-blue-700"
              />

              {option.label}
            </label>
          );
        })}
      </div>

      {error && (
        <p
          id={`${generatedId}-error`}
          role="alert"
          className={`mt-2 ${errorTextStyle}`}
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}