// cspell:disable
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { loginSchema } from '@/schemas/authSchema';
import { useLoginMutation } from '@/hooks/useAuthMutations';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Icons } from '@/components/icons';

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
      <span className="eyebrow">Sign in</span>
      <h2 className="mt-1.5 text-[28px] font-medium tracking-[-0.02em]">
        Masuk ke akun Anda
      </h2>
      <p className="text-ink-500 text-sm mt-1.5 mb-7">
        Gunakan Akun yang sudah diregister untuk melanjutkan.
      </p>

      <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="nama@180dc.com"
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

        <div className="flex items-center justify-between -mt-1">
          <label className="inline-flex items-center gap-2 text-[13px] text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="accent-brand-600"
            />
            Ingat saya
          </label>
          <button
            type="button"
            className="text-[13px] text-ink-700 border-b border-dotted border-ink-300 cursor-pointer bg-transparent p-0"
          >
            Lupa password?
          </button>
        </div>

        <Button type="submit" size="lg" fullWidth loading={isPending} className="mt-1">
          {isPending ? 'Memverifikasi…' : 'Masuk ke portal'}
        </Button>
      </form>

      <div className="mt-[18px] text-[13.5px] text-ink-500 text-center">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="font-medium text-ink-900 no-underline border-b border-ink-300"
        >
          Register
        </Link>
      </div>

      <div className="mt-9 pt-[18px] border-t border-ink-100 flex justify-between items-center text-xs text-ink-400">
        <span>Butuh bantuan?</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-ink-700 cursor-pointer bg-transparent p-0"
        >
          <Icons.help size={14} /> Hubungi admin
        </button>
      </div>
    </div>
  );
}
