// cspell:disable
import { z } from 'zod';

// z.coerce.number() perlu karena semua nilai dari input HTML native selalu berupa string,
// termasuk input type="number". Tanpa coerce, angka "5000" tidak lulus validasi z.number().
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Nama minimal 3 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' }),
  price: z.coerce
    .number({ message: 'Harga harus berupa angka' })
    .gt(0, { message: 'Harga harus lebih dari 0' }),
});
