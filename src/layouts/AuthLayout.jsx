// cspell:disable
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import Logo180 from '@/components/Logo180';

const STATS = [
  ['12', 'Engagements'],
  ['38', 'Konsultan'],
  ['7', 'Mitra UMKM'],
];

// Kalau user sudah punya token, langsung redirect ke /products — tidak perlu lihat login lagi.
// Teks intro di panel kiri berbeda antara login dan register karena audience-nya berbeda:
// login untuk pengguna yang sudah dikenal, register untuk anggota yang baru bergabung.
export default function AuthLayout() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (token) return <Navigate to="/products" replace />;

  const isRegister = location.pathname === '/register';
  const intro = isRegister
    ? 'Katalisator perubahan strategis. Kami memberdayakan organisasi nirlaba dan usaha sosial melalui layanan konsultasi bisnis yang presisi, inovatif, dan terukur.'
    : 'Portal internal untuk pengurus dan konsultan 180 Degrees Consulting UNAIR — kelola engagement, klien, dan produk secara real-time.';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg">
      {/* Left: dark brand panel */}
      <aside className="hidden lg:flex relative overflow-hidden bg-ink-950 text-white flex-col px-14 py-9">
        {/* Decorative sphere */}
        <div
          aria-hidden
          className="absolute pointer-events-none -right-40 -bottom-40 w-[560px] h-[560px] rounded-full blur-[2px]"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(93,187,45,0.85) 0%, rgba(93,187,45,0.05) 55%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none right-10 bottom-10 w-[360px] h-[360px] rounded-full border border-white/8"
          style={{
            boxShadow:
              'inset 0 0 0 60px rgba(255,255,255,0.025), inset 0 0 0 120px rgba(255,255,255,0.02)',
          }}
        />

        <div className="relative z-10">
          <Logo180 size={34} light />
        </div>

        <div className="relative z-10 mt-auto max-w-[420px]">
          <span className="eyebrow text-brand-500">Internal Portal</span>
          <h1 className="text-white text-[42px] leading-[1.08] font-medium tracking-[-0.025em] mt-[14px] mb-[18px]">
            Turning ideas{' '}
            <span className="font-serif text-brand-500">180°</span>{' '}
            into impact, together.
          </h1>
          <p className="text-white/65 text-[15px] leading-[1.55] m-0">{intro}</p>

          <div className="mt-9 grid grid-cols-3 gap-6">
            {STATS.map(([n, l]) => (
              <div key={l}>
                <div className="text-white text-[28px] font-medium tracking-[-0.02em]">
                  {n}
                </div>
                <div className="eyebrow mt-0.5 text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-8 flex justify-between text-xs text-white/40">
          <span>© 180 Degrees Consulting UNAIR · 2026</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px] animate-fadein">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
