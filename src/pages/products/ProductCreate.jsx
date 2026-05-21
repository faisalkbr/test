import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductForm from '../../components/products/ProductForm';
import { useCreateProduct } from '../../hooks/useProducts';

export default function ProductCreate() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateProduct();

  const handleSubmit = (data) => {
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
    <div className="bg-white shadow rounded-lg border border-gray-200">
      <header className="px-6 py-4 border-b border-gray-200">
        <Link to="/products" className="text-sm text-blue-600 hover:text-blue-700">
          ← Kembali ke daftar produk
        </Link>
        <h2 className="mt-1 text-lg font-semibold text-gray-900">Tambah Produk</h2>
      </header>

      <div className="px-6 py-6">
        <ProductForm
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel="Simpan Produk"
        />
      </div>
    </div>
  );
}
