// cspell:disable
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// Guard route: redirect ke /login kalau belum ada token.
// `state={{ from: location }}` menyimpan halaman asal supaya setelah login berhasil
// bisa redirect balik — pattern ini sudah siap, tapi belum diimplementasi di halaman Login.
export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
