// cspell:disable
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Spinner from './components/Spinner';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ProductsList = lazy(() => import('./pages/products/ProductsList'));
const ProductCreate = lazy(() => import('./pages/products/ProductCreate'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Spinner yang muncul saat halaman lazy-loaded belum selesai diunduh.
// min-h mencegah layout collapse — konten tidak langsung bergeser saat chunk datang.
function RouteFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-ink-500">
      <Spinner size={20} />
    </div>
  );
}

// Root routing aplikasi. Semua halaman di-lazy load (code splitting) — hanya diunduh saat dibutuhkan.
// Dua grup route: AuthLayout (login/register) dan ProtectedRoute+DashboardLayout (semua halaman dashboard).
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/new" element={<ProductCreate />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
