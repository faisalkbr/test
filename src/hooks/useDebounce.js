// cspell:disable
import { useEffect, useState } from 'react';

// useDebounce adalah hook yang menunggu jeda `delay` ms setelah perubahan terakhir
// sebelum mengupdate nilai yang dikembalikan.
// clearTimeout di cleanup memastikan hanya satu timer yang aktif pada satu waktu —
// perubahan value yang berurutan hanya menghasilkan satu update di akhir.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
