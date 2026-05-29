// cspell:disable
import { QueryClient } from '@tanstack/react-query';

// queryClient adalah instance QueryClient dengan konfigurasi global untuk semua query dan mutation.
//
// staleTime 60 detik: data dianggap masih segar selama 1 menit — tidak perlu fetch ulang
// kalau baru saja diambil. Ini mengurangi request berulang yang tidak perlu.
//
// refetchOnWindowFocus dimatikan: secara default TanStack Query akan refetch
// setiap kali user kembali ke tab browser. Di aplikasi internal ini perilaku itu
// lebih mengganggu daripada berguna, jadi dinonaktifkan.
//
// retry dilewati untuk 401 dan 403 karena kalau server menolak akses,
// mencoba ulang tidak akan mengubah hasilnya. Untuk error lain, boleh coba 2 kali.
//
// mutation tidak di-retry: retry otomatis untuk create/update/delete berisiko duplikasi data,
// sehingga lebih aman membiarkan komponen yang menangani kegagalan secara eksplisit.
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
