import { useEffect, useId, useRef } from 'react';
import { Icons } from './icons';

/**
 * Modal berbasis native `<dialog>` (ESC untuk tutup, focus trap built-in).
 *
 * @param {object} props
 * @param {boolean} props.open - Terbuka/tertutup. Komponen mengontrol dialog via `showModal()`/`close()`.
 * @param {() => void} props.onClose - Dipanggil saat dialog `onClose` ter-trigger (ESC/backdrop/programmatic).
 * @param {React.ReactNode} [props.title]
 * @param {React.ReactNode} [props.subtitle]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer] - Slot footer; biasanya berisi tombol aksi.
 * @param {number} [props.width=480] - Lebar dialog dalam pixel.
 * @param {boolean} [props.dismissible=true] - Jika false, ESC & klik backdrop diabaikan.
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 480,
  dismissible = true,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleBackdropClick = (event) => {
    if (!dismissible) return;
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleCancel = (event) => {
    if (!dismissible) event.preventDefault();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      aria-labelledby={title ? titleId : undefined}
      className="p-0 m-auto rounded-[14px] border border-ink-150 bg-paper shadow-pop max-w-[calc(100vw-32px)] open:animate-pop"
      style={{ width }}
    >
      {(title || subtitle || dismissible) && (
        <header className="flex items-start gap-3 px-5 py-4 border-b border-ink-100">
          <div className="flex-1">
            {title && (
              <div id={titleId} className="text-[15.5px] font-semibold text-ink-900">
                {title}
              </div>
            )}
            {subtitle && (
              <div className="text-[13px] text-ink-500 mt-0.5">{subtitle}</div>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Tutup"
              className="inline-flex p-1 rounded text-ink-500 hover:bg-ink-100 hover:text-ink-900 cursor-pointer"
            >
              <Icons.close size={18} />
            </button>
          )}
        </header>
      )}
      <div className="px-5 py-5">{children}</div>
      {footer && (
        <footer className="flex justify-end gap-2 px-5 py-3.5 border-t border-ink-100 bg-ink-50">
          {footer}
        </footer>
      )}
    </dialog>
  );
}
