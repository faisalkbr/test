import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import ProductForm from './ProductForm';
import { useProductDetail, useUpdateProduct } from '../../hooks/useProducts';

const formatError = (error) => {
  if (!error) return null;
  if (error.status === 403) return 'Anda bukan pemilik produk ini.';
  if (error.status === 404) return 'Produk tidak ditemukan.';
  return error.message || 'Gagal memperbarui produk.';
};

export default function EditProductModal({ productId, onClose }) {
  const open = productId != null;
  const detailQuery = useProductDetail(productId);
  const updateMutation = useUpdateProduct(productId);

  useEffect(() => {
    if (open) updateMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, open]);

  const handleSubmit = (data, { dirtyFields }) => {
    const patch = Object.fromEntries(
      Object.entries(data).filter(([key]) => dirtyFields[key]),
    );

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }

    updateMutation.mutate(patch, {
      onSuccess: () => {
        toast.success('Produk berhasil diperbarui');
        onClose();
      },
    });
  };

  const product = detailQuery.data;
  const errorMessage = formatError(updateMutation.error);

  return (
    <Modal open={open} onClose={onClose} title="Edit Produk">
      {detailQuery.isLoading && (
        <div className="text-gray-500 text-sm">Memuat data produk...</div>
      )}
      {detailQuery.isError && (
        <div className="text-red-600 text-sm">
          {detailQuery.error?.message || 'Gagal memuat data produk'}
        </div>
      )}
      {product && (
        <>
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}
          <ProductForm
            key={productId}
            defaultValues={{ name: product.name, price: product.price }}
            onSubmit={handleSubmit}
            isPending={updateMutation.isPending}
            submitLabel="Simpan Perubahan"
            onCancel={onClose}
          />
        </>
      )}
    </Modal>
  );
}
