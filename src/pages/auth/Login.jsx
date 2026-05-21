import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema } from '../../schemas/authSchema';
import { useLoginMutation } from '../../hooks/useAuthMutations';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Masuk ke Akun Anda
      </h2>

      <form onSubmit={handleSubmit((data) => login(data))} className="space-y-5">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="admin@180dc.com"
          disabled={isPending}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={isPending}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? 'Memverifikasi...' : 'Masuk'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Daftar sekarang
        </Link>
      </div>
    </div>
  );
}
