import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProductDetail, useDeleteProduct } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/formatCurrency';
import Button from '../../components/Button';
import EditProductModal from '../../components/products/EditProductModal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const { data: product, isLoading, isError, error } = useProductDetail(id);
  const deleteMutation = useDeleteProduct();

  const handleDelete = () => {
    if (!window.confirm(`Hapus produk "${product?.name}"?`)) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Produk berhasil dihapus');
        navigate('/products');
      },
      onError: (err) =>
        toast.error(err.message || 'Gagal menghapus produk'),
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 text-gray-500">
        Memuat data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 text-red-600">
        {error?.message || 'Produk tidak ditemukan'}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg border border-gray-200">
        <header className="px-6 py-4 border-b border-gray-200">
          <Link to="/products" className="text-sm text-blue-600 hover:text-blue-700">
            ← Kembali ke daftar produk
          </Link>
          <div className="mt-1 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Detail Produk</h2>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </div>
        </header>

        <dl className="px-6 py-6 space-y-4">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase">ID</dt>
            <dd className="mt-1 text-sm text-gray-900">{product?.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase">Nama</dt>
            <dd className="mt-1 text-sm text-gray-900">{product?.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase">Harga</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatCurrency(product?.price)}</dd>
          </div>
        </dl>
      </div>

      <EditProductModal
        productId={editOpen ? Number(id) : null}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}
