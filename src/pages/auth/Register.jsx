// cspell:disable
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema } from '@/schemas/authSchema';
import { useRegisterMutation } from '@/hooks/useAuthMutations';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { cn } from '@/lib/cn';

const STRENGTH_LABEL = ['Terlalu lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat kuat'];

// computeStrength adalah fungsi yang menghitung skor kekuatan password dari 0 hingga 4,
// berdasarkan empat kriteria: panjang ≥8, ada huruf besar, ada angka, ada karakter spesial.
function computeStrength(password) {
  let s = 0;
  if (!password) return 0;
  if (password.length >= 8) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  return s;
}

export default function Register() {
  const { mutate: registerUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password') ?? '';
  const strength = computeStrength(password);
  const strengthBarColor =
    strength >= 3 ? 'bg-brand-500' : 'bg-amber-700';

  return (
    <div>
      <span className="eyebrow">New account</span>
      <h2 className="mt-1.5 text-[28px] font-medium tracking-[-0.02em]">
        Register Akun Anda
      </h2>
      <p className="text-ink-500 text-sm mt-1.5 mb-6">
        Isi data berikut dengan lengkap dan valid.
      </p>

      <form
        onSubmit={handleSubmit(registerUser)}
        className="flex flex-col gap-3.5"
      >
        <Input
          label="Nama lengkap"
          placeholder="Nama Lengkap"
          autoComplete="name"
          disabled={isPending}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="nama@student.com"
          autoComplete="email"
          disabled={isPending}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            disabled={isPending}
            error={errors.password?.message}
            {...register('password')}
          />
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 grid grid-cols-4 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-colors',
                      i < strength ? strengthBarColor : 'bg-ink-150',
                    )}
                  />
                ))}
              </div>
              <span className="text-[11.5px] text-ink-500 min-w-[90px] text-right">
                {STRENGTH_LABEL[strength]}
              </span>
            </div>
          )}
        </div>

        <Input
          label="Konfirmasi password"
          type="password"
          placeholder="Ulangi password"
          autoComplete="new-password"
          disabled={isPending}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <label className="flex gap-2.5 items-start text-[12.5px] text-ink-700 mt-1">
          <input
            type="checkbox"
            defaultChecked
            className="mt-0.5 accent-brand-600"
          />
          <span>
            Saya menyetujui{' '}
            <button
              type="button"
              className="text-ink-900 bg-transparent p-0 cursor-pointer underline-offset-2"
            >
              Pedoman Pengurus
            </button>{' '}
            dan{' '}
            <button
              type="button"
              className="text-ink-900 bg-transparent p-0 cursor-pointer underline-offset-2"
            >
              Kebijakan Privasi
            </button>{' '}
            180DC UNAIR.
          </span>
        </label>

        <Button type="submit" size="lg" fullWidth loading={isPending} className="mt-1">
          {isPending ? 'Mengirim permintaan…' : 'Register Akun'}
        </Button>
      </form>

      <div className="mt-[18px] text-[13.5px] text-ink-500 text-center">
        Sudah punya akun?{' '}
        <Link
          to="/login"
          className="font-medium text-ink-900 no-underline border-b border-ink-300"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
