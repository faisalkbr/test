import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Icons } from '@/components/icons';

export default function EmptyState({ search, onClear }) {
  const isSearchEmpty = Boolean(search);

  return (
    <div className="bg-paper border border-dashed border-ink-200 rounded-xl py-16 px-6 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-[14px] bg-ink-50 text-ink-500 mb-4">
        {isSearchEmpty ? <Icons.search size={22} /> : <Icons.box size={22} />}
      </div>
      <h3 className="m-0 text-[17px] font-medium text-ink-950">
        {isSearchEmpty
          ? `Tidak ada hasil untuk "${search}"`
          : 'Belum ada produk dalam katalog'}
      </h3>
      <p className="text-[13.5px] text-ink-500 mt-1.5 mb-[18px]">
        {isSearchEmpty
          ? 'Coba kata kunci lain atau periksa ejaan.'
          : 'Tambahkan produk pertama untuk mulai menjual layanan konsultasi.'}
      </p>
      {isSearchEmpty ? (
        <Button variant="secondary" onClick={onClear}>
          Hapus pencarian
        </Button>
      ) : (
        <Link to="/products/new">
          <Button variant="accent" leading={<Icons.plus size={14} />}>
            Tambah produk pertama
          </Button>
        </Link>
      )}
    </div>
  );
}
