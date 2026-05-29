// cspell:disable
import { Spinner } from './icons';
import { cn } from '@/lib/cn';

const SIZE = {
  sm: 'h-[30px] px-2.5 text-[12.5px] gap-1.5 rounded-md',
  md: 'h-9 px-3.5 text-[13.5px] gap-2 rounded-lg',
  lg: 'h-11 px-[18px] text-[14.5px] gap-2 rounded-[10px]',
};

const VARIANT = {
  primary:
    'bg-ink-950 text-white border border-ink-950 hover:bg-ink-800 shadow-[0_1px_0_rgba(10,11,10,0.04)]',
  accent:
    'bg-brand-500 text-ink-950 border border-brand-600 hover:bg-brand-600 shadow-[0_1px_0_rgba(10,11,10,0.04)]',
  secondary:
    'bg-paper text-ink-900 border border-ink-200 hover:bg-ink-50 shadow-[0_1px_0_rgba(10,11,10,0.04)]',
  ghost:
    'bg-transparent text-ink-700 border border-transparent hover:bg-ink-100',
  danger:
    'bg-paper text-danger-600 border border-ink-200 hover:bg-danger-50 shadow-[0_1px_0_rgba(10,11,10,0.04)]',
  dangerSolid:
    'bg-danger-600 text-white border border-danger-600 hover:bg-danger-700 shadow-[0_1px_0_rgba(10,11,10,0.04)]',
};

// Tombol utama aplikasi — 6 variant × 3 ukuran, semua terpusat di sini.
// Saat `loading=true`, ikon leading otomatis diganti spinner dan tombol di-disable —
// tidak perlu mengatur disabled dari komponen pemanggil.
// Trailing icon disembunyikan saat loading supaya spinner tidak tampil bersisian dengan ikon lain.
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  leading,
  trailing,
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) {
  const isDisabled = disabled || loading;
  const classes = cn(
    'inline-flex items-center justify-center font-medium whitespace-nowrap',
    'transition-colors duration-150 cursor-pointer select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:cursor-not-allowed disabled:opacity-55',
    SIZE[size],
    VARIANT[variant],
    fullWidth && 'w-full',
    className,
  );

  return (
    <button type={type} disabled={isDisabled} className={classes} {...props}>
      {loading ? <Spinner size={14} /> : leading}
      <span>{children}</span>
      {!loading && trailing}
    </button>
  );
}
