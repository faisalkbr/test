import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema } from '../../schemas/authSchema';
import { useRegisterMutation } from '../../hooks/useAuthMutations';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Register() {
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (data) => {
    registerUser(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Daftar Akun Baru
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nama Lengkap"
          autoComplete="name"
          placeholder="Masukkan nama lengkap"
          disabled={isPending}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="contoh@mail.com"
          disabled={isPending}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          disabled={isPending}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Konfirmasi Password"
          type="password"
          autoComplete="new-password"
          placeholder="Ulangi password"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
