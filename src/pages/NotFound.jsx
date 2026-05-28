import { Link } from 'react-router-dom';
import Logo180 from '@/components/Logo180';
import Button from '@/components/Button';
import { Icons } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center relative">
      <div className="absolute top-7 left-8">
        <Logo180 size={26} />
      </div>

      <div className="flex flex-col items-center max-w-[640px]">
        <div className="font-mono text-[13px] text-brand-700 mb-4 tracking-[0.12em]">
          ERROR · 404
        </div>
        <h1 className="m-0 text-ink-950 text-[64px] font-medium tracking-[-0.03em] leading-[1.05]">
          Halaman <span className="font-serif font-normal">tidak ditemukan</span>
        </h1>
        <p className="text-[15px] text-ink-500 max-w-[460px] mt-[18px] mb-7 leading-[1.55]">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak pernah
          ada. Kembali ke portal untuk melanjutkan.
        </p>
        <Link to="/">
          <Button size="lg" variant="primary" leading={<Icons.arrowLeft size={16} />}>
            Kembali ke Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
