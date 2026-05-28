import { cn } from '@/lib/cn';
import { Icons, Spinner } from '@/components/icons';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Tanggal Dibuat' },
  { value: 'name', label: 'Nama' },
];

const VIEW_OPTIONS = [
  { value: 'table', icon: <Icons.list size={15} />, label: 'Tabel' },
  { value: 'grid', icon: <Icons.grid size={15} />, label: 'Kartu' },
];

export default function FilterBar({
  searchInput,
  onSearchInput,
  sortBy,
  onSortBy,
  sortOrder,
  onSortOrder,
  view,
  onView,
  total,
  isFetching,
}) {
  return (
    <div className="bg-paper border border-ink-150 rounded-xl p-3 flex gap-2.5 items-center flex-wrap shadow-card">
      <div className="flex-1 min-w-[240px] flex items-center gap-2 bg-ink-50 rounded-lg px-3 h-[38px]">
        <span className="inline-flex text-ink-400">
          <Icons.search size={16} />
        </span>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => onSearchInput(e.target.value)}
          placeholder="Cari produk berdasarkan nama…"
          className="flex-1 border-0 outline-none bg-transparent text-[13.5px] text-ink-900 placeholder:text-ink-400"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => onSearchInput('')}
            aria-label="Hapus pencarian"
            className="inline-flex p-0.5 text-ink-500 hover:text-ink-900 cursor-pointer"
          >
            <Icons.close size={14} />
          </button>
        )}
      </div>

      <div className="w-px h-6 bg-ink-150" />

      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value)}
          aria-label="Urutkan berdasarkan"
          className="appearance-none h-[38px] pl-9 pr-9 rounded-lg bg-paper border border-ink-200 text-ink-700 text-[13px] cursor-pointer focus:outline-none focus:border-ink-900"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Urut: {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          <Icons.sort size={14} />
        </span>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400">
          <Icons.chevDown size={14} />
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        title={sortOrder === 'desc' ? 'Terbaru ke terlama' : 'Terlama ke terbaru'}
        className="h-[38px] px-3 rounded-lg bg-paper border border-ink-200 text-ink-700 text-[13px] cursor-pointer inline-flex items-center gap-1.5 hover:bg-ink-50"
      >
        <span
          className={cn(
            'inline-flex transition-transform duration-200',
            sortOrder === 'desc' ? 'rotate-0' : 'rotate-180',
          )}
        >
          <Icons.sort size={14} />
        </span>
        {sortOrder === 'desc' ? 'Desc' : 'Asc'}
      </button>

      <div className="flex-1" />

      <div className="inline-flex bg-ink-50 rounded-lg p-0.5">
        {VIEW_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onView(o.value)}
            aria-pressed={view === o.value}
            title={o.label}
            className={cn(
              'px-2.5 py-1.5 rounded-md inline-flex items-center gap-1.5 text-[12.5px] font-medium cursor-pointer',
              view === o.value
                ? 'bg-paper shadow-card text-ink-900'
                : 'bg-transparent text-ink-500 hover:text-ink-700',
            )}
          >
            {o.icon}
          </button>
        ))}
      </div>

      <div className="inline-flex items-center gap-1.5 text-ink-500 text-xs pl-1.5">
        {isFetching && <Spinner size={12} />}
        <span className="font-mono">{total} item</span>
      </div>
    </div>
  );
}
