// cspell:disable
import { cn } from '@/lib/cn';
import { getPageWindow, ELLIPSIS } from '@/lib/pagination';
import Button from '@/components/Button';
import { Icons } from '@/components/icons';

// Tombol prev/next dan semua nomor halaman di-disable saat isFetching
// supaya tidak ada dua request pagination yang berjalan bersamaan dan saling menimpa.
export default function Pagination({
  currentPage,
  totalPages,
  total,
  isFetching,
  onPageChange,
}) {
  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav
      className="flex justify-between items-center text-[13px] text-ink-500"
      aria-label="Navigasi halaman"
    >
      <span>
        Halaman <strong className="text-ink-900">{currentPage}</strong> dari{' '}
        <strong className="text-ink-900">{totalPages}</strong> · {total} produk
        {isFetching && ' · memuat…'}
      </span>
      <div className="flex gap-1.5 items-center">
        <Button
          size="sm"
          variant="secondary"
          leading={<Icons.chevLeft size={14} />}
          disabled={currentPage <= 1 || isFetching}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          Sebelumnya
        </Button>
        <ul className="flex gap-1">
          {pages.map((n, i) =>
            n === ELLIPSIS ? (
              <li
                key={`ellipsis-${i}`}
                className="w-8 h-8 inline-flex items-center justify-center text-ink-400"
                aria-hidden="true"
              >
                {ELLIPSIS}
              </li>
            ) : (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => onPageChange(n)}
                  aria-current={n === currentPage ? 'page' : undefined}
                  aria-label={`Halaman ${n}`}
                  className={cn(
                    'w-8 h-8 rounded-lg text-[13px] font-medium cursor-pointer',
                    n === currentPage
                      ? 'bg-ink-950 text-white'
                      : 'bg-transparent text-ink-700 hover:bg-ink-100',
                  )}
                >
                  {n}
                </button>
              </li>
            ),
          )}
        </ul>
        <Button
          size="sm"
          variant="secondary"
          trailing={<Icons.chevRight size={14} />}
          disabled={currentPage >= totalPages || isFetching}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman selanjutnya"
        >
          Berikutnya
        </Button>
      </div>
    </nav>
  );
}
