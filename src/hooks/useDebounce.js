// cspell:disable
import { useEffect, useState } from 'react';

// Menunda update nilai sampai tidak ada perubahan selama `delay` ms.
// clearTimeout di cleanup penting: kalau value berubah lagi sebelum timer habis,
// timer sebelumnya dibatalkan — hanya ketikan terakhir yang menghasilkan update.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
