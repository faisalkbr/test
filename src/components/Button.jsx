const VARIANTS = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed',
  danger:
    'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 disabled:opacity-60 disabled:cursor-not-allowed',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center rounded-md font-medium shadow-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer',
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
