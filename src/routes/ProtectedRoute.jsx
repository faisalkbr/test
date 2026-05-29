// cspell:disable
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// ProtectedRoute adalah route guard yang redirect ke /login kalau token belum ada.
// `state={{ from: location }}` menyimpan halaman asal supaya setelah login berhasil
// bisa redirect balik — pattern-nya sudah siap, belum diimplementasi di halaman Login.
export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
