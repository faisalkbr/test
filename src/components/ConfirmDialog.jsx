import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  title = 'Konfirmasi',
  message,
  confirmLabel = 'Ya',
  cancelLabel = 'Batal',
  variant = 'primary',
  isPending = false,
  errorMessage,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-gray-700">{message}</p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <div className="mt-6 flex gap-3 justify-end">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isPending}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant}
          type="button"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? 'Memproses...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
