export default function Alert({
  type = 'info',
  title,
  message,
  children,
  className = '',
  ...props
}) {
  const variants = {
    info:
      'border-blue-300 bg-blue-50 text-blue-800',

    success:
      'border-green-300 bg-green-50 text-green-800',

    error:
      'border-red-300 bg-red-50 text-red-700',

    warning:
      'border-orange-300 bg-orange-50 text-orange-700',

    neutral:
      'border-gray-300 bg-gray-100 text-gray-700',
  };

  if (!title && !message && !children) {
    return null;
  }

  return (
    <div
      {...props}
      role={
        type === 'error' || type === 'warning'
          ? 'alert'
          : 'status'
      }
      className={`
        rounded-lg border px-4 py-3
        ${variants[type] ?? variants.info}
        ${className}
      `}
    >
      {title && (
        <p className="mb-1 text-sm font-bold">
          {title}
        </p>
      )}

      {message && (
        <p className="text-sm font-medium leading-relaxed">
          {message}
        </p>
      )}

      {children}
    </div>
  );
}