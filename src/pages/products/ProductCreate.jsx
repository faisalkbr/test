// cspell:disable
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { productSchema } from '@/schemas/productSchema';
import { useCreateProduct } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/formatCurrency';
import PageHeader from '@/components/PageHeader';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Icons } from '@/components/icons';

const TIPS = [
  'Gunakan nama yang spesifik dan mudah dikenali.',
  'Harga disarankan kelipatan Rp 250.000.',
  'Cek pratinjau sebelum menyimpan untuk memastikan tampilan rapi.',
];

// FormSection adalah komponen layout dua kolom: label di kiri, input di kanan.
// Pola ini konsisten dengan layout admin dashboard yang sering pakai grid dua kolom.
function FormSection({ title, subtitle, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-8">
      <div>
        <div className="text-sm font-medium text-ink-900">{title}</div>
        <div className="text-[12.5px] text-ink-500 mt-1">{subtitle}</div>
      </div>
      <div className="flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

// PreviewCard adalah kartu pratinjau yang menampilkan tampilan produk secara real-time.
// Kontennya berasal dari watch() di parent, berubah setiap kali user mengetik di form. — nilainya dari watch() di parent.
function PreviewCard({ name, price }) {
  return (
    <div className="mt-3 border border-ink-150 rounded-[10px] overflow-hidden">
      <div className="h-20 relative bg-gradient-to-br from-brand-50 to-paper">
        <span className="font-mono absolute -right-2.5 -bottom-3.5 font-semibold text-brand-700 text-[64px] opacity-[0.22] tracking-[-0.05em]">
          •
        </span>
      </div>
      <div className="p-3.5">
        <div className="font-mono text-[10.5px] text-ink-400">PRD-NEW</div>
        <div className="text-sm font-medium text-ink-950 mt-0.5 min-h-[18px]">
          {name || <span className="text-ink-300">Nama produk…</span>}
        </div>
        <div className="flex justify-between items-end mt-3">
          <div>
            <div className="eyebrow">Harga</div>
            <div className="font-mono text-[15px] font-medium text-ink-950 mt-0.5">
              {price ? (
                formatCurrency(price)
              ) : (
                <span className="text-ink-300">Rp 0</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCreate() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateProduct();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: '' },
  });

  const name = watch('name');
  const price = watch('price');

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('Produk berhasil ditambahkan');
        navigate('/products');
      },
      onError: (error) => {
        toast.error(error.message || 'Gagal menambahkan produk');
      },
    });
  };

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: 'Produk', to: '/products' },
          { label: 'Tambah Produk' },
        ]}
        title="Tambah Produk"
        description="Daftarkan layanan konsultasi baru ke katalog 180DC UNAIR."
        actions={
          <Button
            variant="secondary"
            leading={<Icons.arrowLeft size={14} />}
            onClick={() => navigate('/products')}
          >
            Kembali
          </Button>
        }
      />

      <div className="px-10 pt-5 pb-10 grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-4 max-w-[1100px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-paper border border-ink-150 rounded-[14px] p-7 shadow-card flex flex-col gap-[18px]"
        >
          <FormSection
            title="Detail Produk"
            subtitle="Informasi dasar tentang layanan."
          >
            <Input
              label="Nama Produk"
              placeholder="Contoh: Brand Audit & Positioning"
              autoComplete="off"
              disabled={isPending}
              error={errors.name?.message}
              {...register('name')}
            />
          </FormSection>

          <div className="h-px bg-ink-100" />

          <FormSection
            title="Harga"
            subtitle="Tetapkan harga standar dalam Rupiah (IDR)."
          >
            <Input
              label="Harga"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="0"
              disabled={isPending}
              leading={<span className="font-mono text-[13px] text-ink-500">Rp</span>}
              hint={
                price
                  ? `Setara ${formatCurrency(price)}`
                  : 'Masukkan harga dalam Rupiah tanpa tanda titik/koma.'
              }
              error={errors.price?.message}
              {...register('price')}
            />
          </FormSection>

          <div className="flex justify-end gap-2 pt-2 border-t border-ink-100">
            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate('/products')}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" variant="accent" loading={isPending}>
              {isPending ? 'Menyimpan…' : 'Simpan Produk'}
            </Button>
          </div>
        </form>

        <aside className="flex flex-col gap-4">
          <div className="bg-paper border border-ink-150 rounded-[14px] p-[18px] shadow-card">
            <span className="eyebrow">Pratinjau</span>
            <PreviewCard name={name} price={price} />
          </div>

          <div className="bg-ink-950 text-white rounded-[14px] p-[18px]">
            <span className="eyebrow text-brand-500">Tips</span>
            <ul className="m-0 mt-2.5 p-0 list-none flex flex-col gap-2.5 text-[13px] text-white/75">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-2 items-start">
                  <span className="text-brand-500 mt-0.5">
                    <Icons.check size={14} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
