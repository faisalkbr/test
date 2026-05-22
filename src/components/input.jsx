import { forwardRef, useId, useState } from 'react';
import { Icons } from './icons';

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    leading,
    trailing,
    type = 'text',
    id,
    optional,
    className = '',
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const reactId = useId();
  const inputId = id || reactId;
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === 'password';
  const realType = isPwd ? (showPwd ? 'text' : 'password') : type;

  const wrapperClass = [
    'flex items-center bg-paper rounded-lg h-10 transition-shadow',
    leading ? 'pl-2.5' : 'pl-3',
    trailing || isPwd ? 'pr-2.5' : 'pr-3',
    error
      ? 'border border-danger-600'
      : focused
        ? 'border border-ink-900'
        : 'border border-ink-200',
    focused ? 'shadow-[0_0_0_3px_rgba(93,187,45,0.18)]' : 'shadow-[0_1px_0_rgba(10,11,10,0.04)]',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="flex items-baseline justify-between text-[12.5px] font-medium text-ink-800"
        >
          <span>{label}</span>
          {optional && <span className="text-[11.5px] text-ink-400">Opsional</span>}
        </label>
      )}
      <div className={wrapperClass}>
        {leading && (
          <span className="inline-flex text-ink-400 mr-2">{leading}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={realType}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error || hint ? `${inputId}-msg` : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="flex-1 w-full border-0 outline-none bg-transparent text-sm text-ink-900 tracking-[-0.005em] placeholder:text-ink-400 disabled:cursor-not-allowed"
          {...props}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? 'Sembunyikan password' : 'Tampilkan password'}
            className="inline-flex p-1 text-ink-400 hover:text-ink-700 cursor-pointer"
          >
            {showPwd ? <Icons.eyeOff size={16} /> : <Icons.eye size={16} />}
          </button>
        )}
        {trailing && !isPwd && (
          <span className="inline-flex text-ink-400 ml-2">{trailing}</span>
        )}
      </div>
      {error ? (
        <span
          id={`${inputId}-msg`}
          className="flex items-center gap-1 text-xs text-danger-600"
          role="alert"
        >
          <Icons.alert size={13} />
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-msg`} className="text-xs text-ink-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
