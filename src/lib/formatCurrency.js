const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return '-';
  return formatter.format(num);
};
