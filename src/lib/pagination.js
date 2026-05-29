// cspell:disable

const ELLIPSIS = '…';

// getPageWindow adalah fungsi yang menghasilkan daftar nomor halaman untuk navigasi pagination.
// Halaman 1 dan halaman terakhir selalu ada — window tengah bergeser mengikuti halaman aktif.
// ELLIPSIS ('…') disisipkan di antara ujung dan window kalau ada lompatan lebih dari satu halaman.
//
// Contoh: total=20, current=10, max=5 → [1, '…', 8, 9, 10, 11, 12, '…', 20]
export function getPageWindow(current, total, max = 5) {
  if (total <= max + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(max / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, current + half);

  if (current <= half + 1) {
    start = 2;
    end = max;
  } else if (current >= total - half) {
    start = total - max + 1;
    end = total - 1;
  }

  const pages = [1];
  if (start > 2) pages.push(ELLIPSIS);
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push(ELLIPSIS);
  pages.push(total);
  return pages;
}

export { ELLIPSIS };
