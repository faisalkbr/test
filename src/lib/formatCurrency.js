// cspell:disable

// Singleton: dibuat sekali saat modul di-import, bukan setiap kali fungsi dipanggil.
// Membuat Intl.NumberFormat berulang itu mahal — pola ini mencegah alokasi objek yang tidak perlu.
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

// isFinite menangani semua input tidak valid (undefined, null, NaN, string kosong) sekaligus —
// Number(undefined) → NaN, Number('') → 0, keduanya tidak memenuhi isFinite.
export const formatCurrency = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '-';
  return formatter.format(num);
};
