// cspell:disable
const SKELETON_ROWS = 6;

export default function TableSkeleton() {
  return (
    <div className="bg-paper border border-ink-150 rounded-xl overflow-hidden">
      <div className="bg-ink-50 border-b border-ink-150 px-[18px] py-3 h-[42px]" />
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-[18px] py-3.5 border-b border-ink-100 last:border-b-0 animate-pulse"
        >
          <div className="h-4 bg-ink-100 rounded w-24" />
          <div className="h-7 w-7 bg-ink-100 rounded-md" />
          <div className="h-4 bg-ink-100 rounded flex-1 max-w-[280px]" />
          <div className="ml-auto h-4 bg-ink-100 rounded w-28" />
          <div className="h-7 bg-ink-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
}
