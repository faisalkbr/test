import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, error, id, className = '', type = 'text', ...props },
  ref,
) {
  const reactId = useId();
  const inputId = id || reactId;

  const inputClasses = [
    'block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400',
    'shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
    error ? 'border-red-500' : 'border-gray-300',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
