export default function Spinner({ size = 14, className = '' }) {
  return (
    <span
      role="status"
      aria-label="Memuat"
      className={`inline-block rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size, animation: 'spin .7s linear infinite' }}
    />
  );
}
