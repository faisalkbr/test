import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { productSchema } from '../../schemas/productSchema';
import Input from '../Input';
import Button from '../Button';

export default function ProductForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = 'Simpan',
  onCancel,
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: '', ...defaultValues },
  });

  const handleCancel = onCancel ?? (() => navigate('/products'));

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, { dirtyFields }))}
      className="space-y-5"
    >
      <Input
        label="Nama Produk"
        placeholder="Contoh: Kemeja Polos"
        autoComplete="off"
        disabled={isPending}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Harga"
        type="number"
        min="1"
        step="1"
        inputMode="numeric"
        placeholder="50000"
        disabled={isPending}
        error={errors.price?.message}
        {...register('price')}
      />

      <div className="flex gap-3 justify-end pt-2">
        <Button
          variant="secondary"
          type="button"
          disabled={isPending}
          onClick={handleCancel}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
