import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-sm font-semibold text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-gray-600">
        Maaf, halaman yang Anda cari tidak tersedia.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Kembali ke beranda
      </Link>
    </div>
  );
}
