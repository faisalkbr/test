import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import Button from '../Button';
import { Icons } from '../icons';
import { useDeleteProduct } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/formatCurrency';

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

  const errorMessage = formatError(deleteMutation.error);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title=""
      width={440}
      dismissible={!deleteMutation.isPending}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Batal
          </Button>
          <Button
            variant="dangerSolid"
            onClick={handleConfirm}
            loading={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Menghapus…' : 'Ya, Hapus Produk'}
          </Button>
        </>
      }
    >
      <div className="flex gap-3.5">
        <div className="w-10 h-10 shrink-0 rounded-[10px] bg-danger-50 text-danger-600 inline-flex items-center justify-center">
          <Icons.alert size={20} />
        </div>
        <div className="flex-1">
          <div className="text-[15.5px] font-semibold text-ink-950">
            Hapus produk ini?
          </div>
          <p className="text-[13.5px] text-ink-700 mt-1.5 mb-3 leading-[1.5]">
            Tindakan ini akan menghapus{' '}
            <strong className="text-ink-900">
              &ldquo;{product?.name}&rdquo;
            </strong>{' '}
            secara permanen dari katalog. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="bg-ink-50 border border-ink-150 rounded-lg px-2.5 py-2 flex justify-between items-center text-[12.5px]">
            <span className="font-mono text-ink-500">{product?.id}</span>
            <span className="font-mono font-medium text-ink-900">
              {formatCurrency(product?.price)}
            </span>
          </div>
          {errorMessage && (
            <div
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-lg bg-danger-50 border border-danger-600/30 px-3 py-2 text-[13px] text-danger-700"
            >
              <span className="text-danger-600 mt-0.5">
                <Icons.alert size={14} />
              </span>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
