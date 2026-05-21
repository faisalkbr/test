import { useEffect, useId, useRef } from 'react';

export default function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      dialogRef.current.close();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={title ? titleId : undefined}
      className="rounded-lg shadow-xl p-0 backdrop:bg-black/50 w-full max-w-md m-auto open:flex open:flex-col"
    >
      <div className="bg-white rounded-lg">
        {title && (
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 id={titleId} className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Tutup"
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
            >
              &times;
            </button>
          </header>
        )}
        <div className="px-6 py-6">{children}</div>
      </div>
    </dialog>
  );
}
