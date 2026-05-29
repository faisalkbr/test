// cspell:disable
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Icons } from '@/components/icons';
import { productSchema } from '@/schemas/productSchema';
import { useProductDetail, useUpdateProduct } from '@/hooks/useProducts';
import { formatCurrency } from '@/lib/formatCurrency';

// Error dari server diterjemahkan ke pesan yang lebih manusiawi.
// Ditampilkan inline di dalam modal — bukan toast — supaya user tidak kehilangan konteks.
const formatError = (error) => {
  if (!error) return null;
  if (error.status === 403) return 'Anda bukan pemilik produk ini.';
  if (error.status === 404) return 'Produk tidak ditemukan.';
  return error.message || 'Gagal memperbarui produk.';
};

// Komponen form dipisah dari modal supaya logika form tidak campur dengan logika fetching data.
// Setiap kali productId berubah, komponen ini di-remount sepenuhnya (lihat key={productId} di bawah)
// sehingga state form selalu bersih untuk produk yang berbeda.
function EditForm({ product, onClose, mutation }) {
  const productId = product?.id;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: product?.name ?? '', price: product?.price ?? '' },
  });

  // Sinkronisasi ulang nilai form kalau data produk berubah dari luar (misalnya setelah refetch).
  useEffect(() => {
    if (product) reset({ name: product.name, price: product.price });
  }, [product?.id, product?.name, product?.price, reset]);

  const priceValue = watch('price');

  const onSubmit = (data) => {
    // patch berisi hanya field yang benar-benar diubah user — sesuai PATCH, bukan PUT.
    // Kalau tidak ada field yang berubah, modal langsung ditutup tanpa request ke server.
    const patch = Object.fromEntries(
      Object.entries(data).filter(([key]) => dirtyFields[key]),
    );
    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }
    mutation.mutate(
      { id: productId, data: patch },
      {
        onSuccess: () => {
          toast.success('Perubahan tersimpan');
          onClose();
        },
      },
    );
  };

  const errorMessage = formatError(mutation.error);
  const isPending = mutation.isPending;

  return (
    <form
      id="edit-product-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3.5"
    >
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-danger-50 border border-danger-600/30 px-3 py-2 text-[13px] text-danger-700"
        >
          <span className="text-danger-600 mt-0.5">
            <Icons.alert size={14} />
          </span>
          {errorMessage}
        </div>
      )}
      <Input
        label="Nama Produk"
        disabled={isPending}
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Harga"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        disabled={isPending}
        leading={<span className="font-mono text-[13px] text-ink-500">Rp</span>}
        hint={priceValue ? `Setara ${formatCurrency(priceValue)}` : null}
        error={errors.price?.message}
        {...register('price')}
      />
    </form>
  );
}

// Modal shell yang mengurus fetching data dan setup mutation.
// productId dikontrol dari luar: kalau null berarti modal tertutup, kalau ada berarti modal terbuka.
// Setiap kali modal dibuka dengan produk baru, error dari mutation sebelumnya direset
// supaya tidak muncul pesan error dari sesi edit yang lalu.
export default function EditProductModal({ productId, onClose }) {
  const open = productId != null;
  const detailQuery = useProductDetail(productId);
  const updateMutation = useUpdateProduct();
  const { reset: resetMutation } = updateMutation;

  useEffect(() => {
    if (open) resetMutation();
  }, [productId, open, resetMutation]);

  const product = detailQuery.data;
  const subtitle = product ? `${product.id}` : '';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Produk"
      subtitle={subtitle}
      width={520}
      dismissible={!updateMutation.isPending}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="edit-product-form"
            variant="accent"
            loading={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Menyimpan…' : 'Simpan Perubahan'}
          </Button>
        </>
      }
    >
      {detailQuery.isLoading && (
        <div className="text-sm text-ink-500">Memuat data produk…</div>
      )}
      {detailQuery.isError && (
        <div className="text-sm text-danger-600">
          {detailQuery.error?.message || 'Gagal memuat data produk'}
        </div>
      )}
      {/* key={productId} memaksa EditForm di-remount sepenuhnya saat berpindah produk,
          sehingga state form selalu bersih dan tidak tercampur antar produk. */}
      {product && (
        <EditForm
          key={productId}
          product={product}
          onClose={onClose}
          mutation={updateMutation}
        />
      )}
    </Modal>
  );
}
