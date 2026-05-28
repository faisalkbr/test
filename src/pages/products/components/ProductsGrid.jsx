import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatCurrency';
import { Icons } from '@/components/icons';
import { usePrefetchProductDetail } from '@/hooks/useProducts';

function ProductCard({ product, onEdit, onDelete, onPrefetch }) {
  const idTail = String(product.id).slice(-2).toUpperCase();
  const prefetch = () => onPrefetch(product.id);

  return (
    <div
      className="relative bg-paper border border-ink-150 rounded-xl p-4 flex flex-col gap-3 transition-all shadow-card hover:shadow-pop hover:-translate-y-px"
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      <div className="h-[88px] rounded-lg border border-ink-100 relative overflow-hidden bg-gradient-to-br from-brand-50 to-paper">
        <span className="font-mono absolute -right-3 -bottom-4 font-semibold text-brand-700 text-[80px] opacity-[0.22] tracking-[-0.05em] leading-none">
          {idTail}
        </span>
      </div>
      <div>
        <span className="font-mono text-[11px] text-ink-400">
          {String(product.id).slice(0, 12)}
        </span>
        <Link
          to={`/products/${product.id}`}
          className="block text-[14.5px] font-medium text-ink-950 mt-0.5 leading-[1.3] no-underline after:absolute after:inset-0 after:content-['']"
        >
          {product.name}
        </Link>
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <div className="eyebrow">Harga</div>
          <div className="font-mono text-base font-medium text-ink-950 mt-0.5">
            {formatCurrency(product.price)}
          </div>
        </div>
        <div className="inline-flex gap-1 relative z-10">
          <button
            type="button"
            onClick={() => onEdit(product.id)}
            aria-label={`Edit ${product.name}`}
            className="inline-flex p-1.5 rounded-md text-ink-700 hover:bg-ink-100 cursor-pointer"
          >
            <Icons.edit size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            aria-label={`Hapus ${product.name}`}
            className="inline-flex p-1.5 rounded-md text-ink-700 hover:bg-danger-50 hover:text-danger-600 cursor-pointer"
          >
            <Icons.trash size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsGrid({ items, onEdit, onDelete }) {
  const prefetch = usePrefetchProductDetail();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
      {items.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onEdit={onEdit}
          onDelete={onDelete}
          onPrefetch={prefetch}
        />
      ))}
    </div>
  );
}
