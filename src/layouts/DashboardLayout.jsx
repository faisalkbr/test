// cspell:disable
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/cn';
import Logo180 from '@/components/Logo180';
import Avatar from '@/components/Avatar';
import { Icons } from '@/components/icons';

// NavItem menangani dua keadaan: aktif (bisa diklik) dan disabled (fitur belum tersedia).
// Kalau disabled, dirender sebagai <div> biasa — bukan <NavLink> — supaya tidak ada href
// dan tidak bisa diklik maupun di-tab. Prop `hint` dipakai untuk tooltip "Segera".
// Kalau aktif, NavLink otomatis mendeteksi apakah route-nya cocok lewat prop `end`:
// tanpa `end`, /products dianggap aktif juga saat user ada di /products/new.
function NavItem({ to, icon, label, badge, disabled, hint }) {
  if (disabled) {
    return (
      <div
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] text-white/35 cursor-not-allowed"
        title={hint}
      >
        <span className="inline-flex opacity-60">{icon}</span>
        <span className="flex-1">{label}</span>
        {hint && <span className="text-[10px] text-white/35">{hint}</span>}
      </div>
    );
  }
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] tracking-[-0.005em] transition-colors border-l-2',
          isActive
            ? 'bg-brand-500/12 text-brand-500 border-brand-500 font-medium'
            : 'border-transparent text-white/75 hover:bg-white/5',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="inline-flex">{icon}</span>
          <span className="flex-1">{label}</span>
          {badge && (
            <span
              className={cn(
                'font-mono text-[10.5px] px-1.5 py-0.5 rounded-md',
                isActive
                  ? 'bg-brand-500/18 text-brand-500'
                  : 'bg-white/8 text-white/70',
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// Layout utama untuk semua halaman dashboard. Sidebar di kiri, konten di kanan.
// Sidebar pakai `sticky top-0 h-screen` supaya tetap terlihat saat konten di-scroll ke bawah.
// Konten halaman dirender via <Outlet> — React Router yang mengisi bagian ini sesuai route aktif.
// Data user (nama untuk Avatar) dan fungsi logout diambil langsung dari Zustand store.
export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen grid grid-cols-[248px_1fr]">
      <aside className="sticky top-0 h-screen bg-ink-950 text-white/85 px-3.5 pt-5 pb-4 flex flex-col border-r border-black">
        <div className="px-2 pb-4">
          <Logo180 size={26} light />
        </div>

        <div className="border-t border-white/8 -mx-1.5 mb-3.5" />

        <span
          className="eyebrow px-2 pb-2 text-white/40"
        >
          Workspace
        </span>
        <nav className="flex flex-col gap-0.5">
          <NavItem
            to="/products"
            icon={<Icons.box size={16} />}
            label="Produk & Layanan"
          />
          <NavItem
            disabled
            icon={<Icons.briefcase size={16} />}
            label="Engagement"
            hint="Segera"
          />
          <NavItem
            disabled
            icon={<Icons.team size={16} />}
            label="Klien"
            hint="Segera"
          />
          <NavItem
            disabled
            icon={<Icons.dashboard size={16} />}
            label="Laporan"
            hint="Segera"
          />
        </nav>

        <div className="mt-7">
          <span className="eyebrow px-2 pb-2 text-white/40">Akun</span>
          <nav className="flex flex-col gap-0.5">
            <NavItem disabled icon={<Icons.bell size={16} />} label="Notifikasi" />
            <NavItem disabled icon={<Icons.settings size={16} />} label="Pengaturan" />
          </nav>
        </div>

        <div className="mt-auto pt-3 flex items-center gap-2.5 border-t border-white/8">
          <Avatar name={user?.name} size={34} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-white truncate">
              {user?.name || 'Pengguna'}
            </div>
            <div className="font-mono text-[10.5px] text-white/50 tracking-[0.04em]">
              Users · UNAIR
            </div>
          </div>
          <button
            onClick={logout}
            aria-label="Keluar"
            title="Keluar"
            className="inline-flex p-1.5 rounded-lg border border-white/10 text-white/60 hover:bg-white/6 hover:text-white cursor-pointer transition-colors"
          >
            <Icons.logout size={16} />
          </button>
        </div>
      </aside>

      <main className="bg-bg min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
