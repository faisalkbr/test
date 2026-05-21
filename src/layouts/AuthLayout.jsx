// src/layouts/AuthLayout.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthLayout() {
  const token = useAuthStore((state) => state.token);

  // Guard: Jika user sudah punya token, langsung lempar ke /products
  if (token) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          180DC Portal
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* <Outlet /> adalah tempat di mana komponen <Login /> atau <Register /> akan dirender */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}