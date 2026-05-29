// cspell:disable
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(1, { message: 'Password wajib diisi' }),
});

// registerSchema menggunakan refine untuk mengecek kecocokan password secara client-side.
// Field `confirmPassword` juga harus dikirim ke backend — server mewajibkannya —
// sehingga field ini tidak boleh dihapus meski validasinya sudah ada di sini.
export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Nama minimal 3 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' }),
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Konfirmasi password wajib diisi' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan Konfirmasi Password tidak cocok",
  path: ["confirmPassword"],
});