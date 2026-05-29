// cspell:disable
import { QueryClient } from '@tanstack/react-query';

// Konfigurasi global untuk semua query dan mutation di aplikasi ini.
//
// staleTime 60 detik: data dianggap masih segar selama 1 menit — tidak perlu fetch ulang
// kalau baru saja diambil. Ini mengurangi request berulang yang tidak perlu.
//
// refetchOnWindowFocus dimatikan: secara default TanStack Query akan refetch
// setiap kali user kembali ke tab browser. Di aplikasi internal ini perilaku itu
// lebih mengganggu daripada berguna, jadi dinonaktifkan.
//
// retry dilewati untuk 401 dan 403: kalau server bilang tidak punya akses,
// tidak ada gunanya coba lagi — hasilnya akan sama. Untuk error lain, boleh coba 2 kali.
//
// mutation tidak di-retry: kalau create/update/delete gagal, jangan otomatis ulang
// karena bisa menyebabkan duplikasi data.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
