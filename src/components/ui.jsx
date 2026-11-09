export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyle =
    'inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    neutral: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  variant = 'success',
  className = '',
}) {
  const baseStyle =
    'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';

  const variants = {
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-800',
    neutral: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant] ?? variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  id,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  className = '',
  ...props
}) {
  const inputStyle =
    'w-full rounded-lg border bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2';

  const stateStyle = error
    ? 'border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100';

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputStyle} ${stateStyle} ${className}`}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  options = [],
  placeholder = '선택하세요',
  required = false,
  error = '',
  className = '',
  ...props
}) {
  const selectStyle =
    'w-full rounded-lg border bg-white px-4 py-2 text-gray-900 outline-none focus:ring-2';

  const stateStyle = error
    ? 'border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100';

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${selectStyle} ${stateStyle} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkbox({
  id,
  label,
  checked = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 text-sm text-gray-700 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
        {...props}
      />

      <span>{label}</span>
    </label>
  );
}