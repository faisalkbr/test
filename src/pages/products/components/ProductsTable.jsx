// cspell:disable
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/formatCurrency';
import { ProductAvatar } from '@/components/Avatar';
import { Icons } from '@/components/icons';
import { usePrefetchProductDetail } from '@/hooks/useProducts';

// ProductRow adalah baris tabel yang memicu prefetch data detail produk
// saat cursor masuk atau baris di-focus via keyboard — hasilnya halaman detail muncul instan.
function ProductRow({ product, onEdit, onDelete, onPrefetch }) {
  const prefetch = () => onPrefetch(product.id);
  return (
    <tr
      className="hover:bg-ink-50 transition-colors group cursor-pointer"
      onMouseEnter={prefetch}
      onFocus={prefetch}
    >
      <td className="px-[18px] py-3.5 align-middle">
        <Link
          to={`/products/${product.id}`}
          className="font-mono text-xs text-ink-500 no-underline hover:text-ink-900"
        >
          {String(product.id).slice(0, 12)}
        </Link>
      </td>
      <td className="px-[18px] py-3.5 align-middle">
        <Link
          to={`/products/${product.id}`}
          className="flex items-center gap-3 no-underline"
        >
          <ProductAvatar name={product.name} />
          <span className="font-medium text-ink-950">{product.name}</span>
        </Link>
      </td>
      <td className="px-[18px] py-3.5 align-middle text-right">
        <span className="font-mono font-medium text-ink-950">
          {formatCurrency(product.price)}
        </span>
      </td>
      <td className="px-[18px] py-3.5 align-middle text-right">
        <div className="inline-flex gap-1 opacity-45 group-hover:opacity-100 transition-opacity">
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
      </td>
    </tr>
  );
}

const COLUMNS = [
  { label: 'ID', align: 'left', width: 'w-[140px]' },
  { label: 'Nama Produk', align: 'left', width: '' },
  { label: 'Harga', align: 'right', width: '' },
  { label: 'Aksi', align: 'right', width: 'w-[140px]' },
];

export default function ProductsTable({ items, onEdit, onDelete }) {
  const prefetch = usePrefetchProductDetail();
  return (
    <div className="bg-paper border border-ink-150 rounded-xl overflow-hidden shadow-card">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-ink-50 border-b border-ink-150">
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                className={`px-[18px] py-3 text-${col.align} text-[11.5px] font-medium tracking-[0.06em] uppercase text-ink-500 ${col.width}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onEdit={onEdit}
              onDelete={onDelete}
              onPrefetch={prefetch}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
