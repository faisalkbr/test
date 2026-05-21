import { z } from 'zod';

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
