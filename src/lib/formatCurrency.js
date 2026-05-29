// cspell:disable

// formatter adalah instance Intl.NumberFormat yang dibuat sekali saat modul di-import.
// Pola singleton ini menghindari pembuatan objek Intl berulang setiap kali fungsi dipanggil.
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

// formatCurrency menerima nilai apapun dan mengembalikan '-' kalau nilainya tidak valid.
// Guard isFinite menangani semua kasus: undefined → NaN, string kosong → 0 (tidak isFinite).
export const formatCurrency = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '-';
  return formatter.format(num);
};
