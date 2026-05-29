# Cheat Sheet Presentasi — Frontend DeptCase 180DC

> Target durasi: **10 menit**
> Format: **Jelasin code dulu, lalu demo singkat**
> Audience: tim/mentor 180DC UNAIR

---

## ⏱️ Timing Cheat Sheet

| Waktu | Bagian | Yang ditampilkan |
|---|---|---|
| 0:00 – 1:00 | Intro | Slide / VS Code idle |
| 1:00 – 7:30 | **Code walkthrough** | VS Code (4 file) |
| 7:30 – 9:00 | **Demo singkat** | Browser + DevTools |
| 9:00 – 10:00 | Closing & Q&A | Slide |

---

## 📋 Persiapan Sebelum Mulai

- [ ] `npm run dev` sudah jalan di port 5173 (di background tab)
- [ ] Browser sudah login di `http://localhost:5173/products` (tab terpisah)
- [ ] **DevTools terbuka, tab Network aktif, "Preserve log" ON**
- [ ] VS Code zoom level cukup besar (Ctrl/Cmd + 2-3 kali)
- [ ] Buka 4 file walkthrough sebagai **tab terpisah** di VS Code agar cepat switch
- [ ] Akun test sudah siap (untuk demo logout/login kalau perlu)
- [ ] Tutup notifikasi (Slack, Discord, dll)
- [ ] Sidebar VS Code minimize agar code area lebar

**File yang harus pre-open di VS Code tabs:**
1. `src/App.jsx`
2. `src/services/api.js`
3. `src/hooks/useProducts.js`
4. `src/hooks/useProductsFilters.js`

---

## 🎤 1. Intro (0:00 – 1:00)

> "Selamat pagi/siang. Hari ini saya akan presentasi frontend untuk **internal portal 180DC UNAIR** — sebuah dashboard untuk mengelola katalog produk dan layanan konsultasi yang ditawarkan ke mitra.
>
> Project ini dibangun dengan **React 19, Vite, TanStack Query untuk data fetching, Zustand untuk auth state, React Hook Form + Zod untuk form validation, dan Tailwind v4 untuk styling**. Backend terpisah, kita berkomunikasi via REST API.
>
> Saya akan langsung masuk ke code untuk menjelaskan arsitekturnya, lalu di akhir saya tunjukkan demo singkat di browser."

**Kata kunci:** internal portal, katalog, REST API

---

## 💻 2. Code Walkthrough (1:00 – 7:30)

### 📁 File 1 — `src/App.jsx` (1.5 menit)

**Apa yang ditunjukkan:** struktur routing, `lazy()`, `ProtectedRoute`

```jsx
const Login = lazy(() => import('./pages/auth/Login'));
const ProductsList = lazy(() => import('./pages/products/ProductsList'));

<Route element={<AuthLayout />}>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Route>

<Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  <Route path="/products" element={<ProductsList />} />
  <Route path="/products/new" element={<ProductCreate />} />
  <Route path="/products/:id" element={<ProductDetail />} />
</Route>
```

**Bicarakan:**
- "Saya pakai **React Router v7** untuk navigasi"
- "Setiap halaman dibungkus `lazy()` → **code splitting otomatis** — initial bundle kecil, halaman di-load sesuai kebutuhan"
- "Routes dibagi 2 grup berdasarkan layout:"
  - `<AuthLayout>` — Login, Register. Auto-redirect ke `/products` kalau sudah login
  - `<ProtectedRoute><DashboardLayout>` — semua halaman dashboard. Auto-redirect ke `/login` kalau belum login

> 💡 Pesan kunci: "**Separation of concerns** — routing, auth guard, dan layout dipisahkan rapi."

---

### 📁 File 2 — `src/services/api.js` (1.5 menit)

**Apa yang ditunjukkan:** `apiFetch()` function dan `ApiError` class

```js
export const apiFetch = async (endpoint, { signal, ...options } = {}) => {
  const { token } = useAuthStore.getState();

  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers, signal });
  const data = await parseBody(response);

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    useAuthStore.getState().logout();
  }

  if (!response.ok) {
    throw new ApiError(data?.message || 'Server error', { status: response.status, data });
  }

  return data;
};
```

**Bicarakan:**
- "Ini **satu utility** untuk semua HTTP request — tidak ada `fetch()` langsung di komponen"
- "Token Bearer **auto-attached** dari Zustand store"
- "Error di-throw sebagai **typed `ApiError`** dengan `.status` dan `.data` — memudahkan handling spesifik per status code"
- "**Auto-logout pada response 401** — kecuali endpoint login (supaya error login tidak men-trigger logout loop)"

> 💡 Pesan kunci: "**Centralized HTTP layer** — kalau backend ubah authentication scheme, cuma satu file yang perlu diubah."

---

### 📁 File 3 — `src/hooks/useProducts.js` (2.5 menit) ⭐ **Highlight utama**

**Bagian A — `useProductsList` & `useProductDetail`** (30 detik)

```js
export const useProductsList = (params = {}) =>
  useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.list(params),
    placeholderData: keepPreviousData,
  });
```

**Bicarakan:**
- "**TanStack Query** handle semua server state — cache, refetch, loading, error"
- "`keepPreviousData` → saat user ganti halaman/filter, data lama tetap tampil sampai data baru siap. **Tidak flicker**."

**Bagian B — `useUpdateProduct` (Optimistic Update)** (1 menit)

```js
onMutate: async ({ id, data }) => {
  await queryClient.cancelQueries({ queryKey: detailKey });
  const previousDetail = queryClient.getQueryData(detailKey);
  queryClient.setQueryData(detailKey, /* merge with new data */);
  return { previousDetail };
},
onError: (_err, { id }, context) => {
  queryClient.setQueryData(detailKey, context.previousDetail);
},
onSettled: (_res, _err, { id }) => {
  queryClient.invalidateQueries({ queryKey: detailKey });
},
```

**Bicarakan:**
- "Ini **optimistic update** — UI langsung berubah **sebelum** server confirm"
- "Tiga lifecycle:"
  - `onMutate` → cancel pending fetch, simpan snapshot, update cache lokal
  - `onError` → rollback ke snapshot kalau server gagal
  - `onSettled` → invalidate cache, force refetch dari server untuk sync

> 💡 Pesan kunci: "**UX terasa instant** — user tidak perlu menunggu round-trip ke server untuk lihat perubahan."

**Bagian C — `usePrefetchProductDetail`** (1 menit) ⭐

```js
export const usePrefetchProductDetail = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => productsApi.detail(id),
    });
  };
};
```

**Bicarakan:**
- "Hook ini di-trigger di `onMouseEnter` dan `onFocus` di tabel/grid produk"
- "Saat user **hover** produk → data detail di-fetch ke cache **di background**"
- "Saat user klik → halaman detail langsung tampil, **tanpa loading spinner**"

> 💡 Pesan kunci: "**Prefetch on hover** — perceived load time = instant. Trick yang dipakai Vercel, Linear, GitHub."

---

### 📁 File 4 — `src/hooks/useProductsFilters.js` (1 menit)

**Apa yang ditunjukkan:** custom hook untuk filter state

**Bicarakan:**
- "Semua state filter — **page, search, sort, view** — saya simpan di **URL search params**, bukan di React state"
- "Keuntungan:"
  - ✅ **Refresh aman** — state tidak hilang
  - ✅ **Link bisa di-share** — mitra bisa kirim URL ke kolega dengan filter sama
  - ✅ **Back/forward browser bekerja** — natural navigation
  - ✅ **No prop drilling** — komponen tinggal panggil hook ini

> 💡 Pesan kunci: "**URL as single source of truth** — pattern ini di-adopsi Next.js App Router juga."

---

## 🖱️ 3. Demo Singkat (7:30 – 9:00)

> "Sekarang saya tunjukkan hasil dari semua yang tadi dijelaskan — singkat saja."

### Demo 1 — Prefetch on hover ⭐ (45 detik)
- Pindah ke browser, sudah di `/products`
- Buka DevTools Network tab di samping
- **Hover** beberapa row tanpa klik
- **Bicarakan:** "Lihat — setiap hover memicu fetch detail di Network tab. Data masuk cache."
- Klik salah satu produk
- **Bicarakan:** "Detail tampil instant, tidak ada loading state."

### Demo 2 — URL state (15 detik)
- Kembali ke list, ketik search, ubah sort
- **Tunjukkan URL bar berubah** sesuai filter
- **Bicarakan:** "Refresh halaman ini — state tetap. Bisa dishare juga."

### Demo 3 — Optimistic update (30 detik)
- Klik tombol Edit di salah satu produk
- Ubah harga, klik Simpan
- **Bicarakan:** "Modal langsung tutup, harga di list langsung berubah, tanpa tunggu server."

> ⚠️ **Hindari demo logout/login** — buang waktu untuk auth flow yang tidak unik.

---

## 🎯 4. Closing (9:00 – 10:00)

> "Ringkasnya — project ini mendemonstrasikan beberapa hal:
>
> 1. **Arsitektur modern React 19** dengan code splitting, lazy loading, dan React Compiler untuk auto-memoization.
> 2. **Data layer yang clean** — TanStack Query untuk server state, Zustand untuk auth state. Pemisahan ini sudah jadi best practice.
> 3. **UX optimizations** — prefetch on hover, optimistic update, dan keepPreviousData yang membuat interaksi terasa instant.
> 4. **Maintainability** — single source of truth via URL, typed errors, centralized HTTP layer.
>
> Mudah di-extend untuk fitur seperti user management, roles, atau analytics. Terima kasih, saya buka untuk pertanyaan."

---

## 🆘 Backup Q&A — Antisipasi Pertanyaan

**Q: Kenapa Zustand bukan Redux/Context?**
> Zustand untuk auth state global yang jarang berubah — lightweight, no boilerplate. Untuk server state pakai TanStack Query, bukan Redux. Pemisahan client state vs server state ini best practice React modern.

**Q: Kenapa TanStack Query bukan Redux Toolkit Query?**
> TanStack Query lebih ringan, tidak butuh setup store. Cache invalidation, optimistic update, prefetch — semuanya built-in. Komunitas React mostly pakai ini.

**Q: Bagaimana handle error?**
> Tiga layer: (1) `apiFetch` throw typed `ApiError` dengan `.status`. (2) Mutation hooks expose `error` ke component. (3) UI tampilkan toast untuk error global, atau inline error untuk 403/404 di dalam modal.

**Q: Apakah ada testing?**
> Belum di-setup untuk project ini, tapi stack sudah siap untuk Vitest + React Testing Library.

**Q: Kenapa Tailwind v4 bukan v3?**
> v4 lebih cepat (Lightning CSS engine), config via `@theme` di CSS lebih portable, tidak butuh `tailwind.config.js` JavaScript.

**Q: React Compiler statusnya stabil belum?**
> Stable per React 19. Di project ini sudah aktif via `babel-plugin-react-compiler`, target React 19. Otomatis memoize component/hook tanpa perlu `useMemo`/`useCallback` manual.

**Q: Bagaimana kalau token Bearer expired di tengah jalan?**
> Backend akan return 401. `apiFetch` deteksi 401 → auto-trigger `logout()` di Zustand → user di-redirect ke `/login` (karena `ProtectedRoute` cek token).

**Q: Kenapa pisah `useProductsList` dan `useProductDetail`?**
> Cache granularity. List dan detail punya query key berbeda → bisa di-invalidate independent. Saat update produk, hanya detail dan list yang affected yang di-refetch.

**Q: Apa risiko optimistic update?**
> Kalau server gagal, ada flash visual (UI berubah lalu rollback). Untuk mitigasi: tampilkan error toast saat rollback. Tradeoff yang acceptable demi UX yang lebih responsif.

**Q: Berapa lama development?**
> *(jawab sesuai realita Anda)*

---

## ⚠️ Hal yang HARUS dihindari

- ❌ **Jangan live coding** — terlalu risk untuk 10 menit
- ❌ **Jangan baca code baris per baris** — jelaskan **konsep dan kenapa**
- ❌ **Jangan terlalu detail di styling** — fokus arsitektur dan data flow
- ❌ **Jangan over-promise** fitur yang belum ada — jujur saja
- ❌ **Jangan panic kalau demo gagal** — siapkan screenshot Network tab sebagai backup, atau skip ke closing

---

## 🎬 Flow Singkat (untuk dihafalkan)

```
1. Intro (1 min)
   └─ Project apa, stack apa, agenda apa

2. App.jsx (1.5 min)
   └─ Routing, lazy, protected route

3. api.js (1.5 min)
   └─ Centralized fetch, auto token, auto logout

4. useProducts.js (2.5 min) ⭐
   ├─ TanStack Query basics
   ├─ Optimistic update
   └─ Prefetch on hover

5. useProductsFilters.js (1 min)
   └─ URL as source of truth

6. Demo (1.5 min)
   ├─ Prefetch (Network tab)
   ├─ URL state
   └─ Optimistic update

7. Closing (1 min)
   └─ Rangkuman 4 poin + Q&A
```
