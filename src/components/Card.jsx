export default function Card({
  children,
  title,
  description,
  variant = 'default',
  padding = 'default',
  className = '',
  ...props
}) {
  const baseStyle = 'min-w-0 rounded-2xl border';

  const variants = {
    default:
      'border-gray-400 bg-white shadow-sm',

    subtle:
      'border-gray-300 bg-gray-50',

    blue:
      'border-blue-300 bg-blue-50',

    orange:
      'border-orange-300 bg-orange-50',

    gray:
      'border-gray-300 bg-gray-100',
  };

  const paddings = {
    none: 'p-0',
    small: 'p-4',
    default: 'p-6',
    large: 'p-6 sm:p-8',
  };

  return (
    <section
      {...props}
      className={`
        ${baseStyle}
        ${variants[variant] ?? variants.default}
        ${paddings[padding] ?? paddings.default}
        ${className}
      `}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}