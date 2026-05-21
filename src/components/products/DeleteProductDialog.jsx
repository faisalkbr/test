import { useEffect } from 'react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../ConfirmDialog';
import { useDeleteProduct } from '../../hooks/useProducts';

const formatError = (error) => {
  if (!error) return null;
  if (error.status === 403) return 'Anda bukan pemilik produk ini.';
  if (error.status === 404) return 'Produk tidak ditemukan.';
  return error.message || 'Gagal menghapus produk.';
};

export default function DeleteProductDialog({ product, onClose, onSuccess }) {
  const open = product != null;
  const deleteMutation = useDeleteProduct();

  useEffect(() => {
    if (open) deleteMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, open]);

  const handleConfirm = () => {
    deleteMutation.mutate(product.id, {
      onSuccess: () => {
        toast.success('Produk berhasil dihapus');
        onSuccess?.();
        onClose();
      },
    });
  };

  return (
    <ConfirmDialog
      open={open}
      onCancel={onClose}
      onConfirm={handleConfirm}
      title="Hapus Produk"
      message={
        product
          ? `Yakin ingin menghapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`
          : ''
      }
      confirmLabel="Hapus"
      variant="danger"
      isPending={deleteMutation.isPending}
      errorMessage={formatError(deleteMutation.error)}
    />
  );
}
