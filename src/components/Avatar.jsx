// cspell:disable

// Avatar menampilkan inisial nama pengguna (maksimal 2 huruf pertama dari setiap kata).
export default function Avatar({ name = '', size = 32 }) {
  const initials =
    (name || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0])
      .join('')
      .toUpperCase() || '·';

  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-ink-900 text-brand-500 font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        letterSpacing: '0.02em',
      }}
    >
      {initials}
    </span>
  );
}

// ProductAvatar menampilkan huruf pertama nama produk dengan warna yang ditentukan
// secara deterministik dari nama — hash sederhana (polynomial rolling) menghasilkan hue
// yang konsisten untuk nama yang sama tanpa perlu menyimpan warna di database.
export function ProductAvatar({ name = '', size = 30 }) {
  const letter = (name || '?')[0]?.toUpperCase() || '?';
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return (
    <span
      className="inline-flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: `oklch(0.94 0.04 ${hue})`,
        color: `oklch(0.38 0.12 ${hue})`,
        fontSize: size * 0.43,
      }}
    >
      {letter}
    </span>
  );
}
