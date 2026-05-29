# Cheat Sheet Presentasi V2 — Frontend DeptCase 180DC

> Target durasi: **10 menit**
> Alur: **Handle Code → Management File → Fitur**
> Audience: tim/mentor 180DC UNAIR

---

## ⏱️ Timing Cheat Sheet

| Waktu | Bagian | Yang ditampilkan |
|---|---|---|
| 0:00 – 0:45 | Intro singkat | VS Code idle |
| 0:45 – 4:30 | **Handle Code** | VS Code (4 file pattern) |
| 4:30 – 6:30 | **Management File** | VS Code File Explorer |
| 6:30 – 10:00 | **Fitur** | Browser + DevTools |

---

## 📋 Persiapan Sebelum Mulai

- [ ] `npm run dev` jalan di port 5173 (browser tab terpisah, sudah login)
- [ ] **DevTools Network tab terbuka, "Preserve log" ON**
- [ ] VS Code zoom besar (Ctrl/Cmd + 2-3 kali)
- [ ] Pre-open VS Code tabs:
  1. `src/services/api.js`
  2. `src/store/useAuthStore.js`
  3. `src/hooks/useProducts.js`
  4. `src/schemas/productSchema.js` *(atau loginSchema)*
- [ ] File Explorer VS Code expand sampai folder `src/`

---

## 🎤 1. Intro Singkat (0:00 – 0:45)

> "Selamat pagi/siang. Saya akan presentasi frontend internal portal 180DC UNAIR — dashboard manajemen katalog produk konsultasi.
>
> Stack: **React 19, Vite, TanStack Query, Zustand, React Hook Form + Zod, Tailwind v4**.
>
> Saya bagi presentasi ke tiga bagian: **bagaimana code di-handle**, **bagaimana file diorganisir**, dan **fitur apa yang sudah jalan**."

---

## 💻 2. Handle Code (0:45 – 4:30)

> "Saya mulai dari pola/pattern code yang dipakai di project ini."

### 🔹 Pattern 1 — Centralized HTTP Layer

**Buka:** `src/services/api.js`

```js
export const apiFetch = async (endpoint, options = {}) => {
  const { token } = useAuthStore.getState();
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    useAuthStore.getState().logout();
  }
  if (!response.ok) {
    throw new ApiError(data?.message, { status: response.status, data });
  }
  return data;
};
```

**Bicarakan (60 detik):**
- "**Satu fungsi** untuk semua HTTP request — tidak ada `fetch()` mentah di komponen"
- "Token Bearer **auto-attached** dari Zustand"
- "Error dilempar sebagai **typed `ApiError`** dengan `.status` dan `.data`"
- "Pada **401 → auto logout**, kecuali endpoint login"

> 💡 **Pesan kunci:** "Kalau backend ubah auth scheme, cuma satu file yang diubah."

---

### 🔹 Pattern 2 — Client State vs Server State

**Buka:** `src/store/useAuthStore.js`

```js
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setCredentials: (token, user) => {
        queryClient.clear();
        set({ token, user });
      },
      logout: () => {
        queryClient.clear();
        set({ token: null, user: null });
      },
    }),
    { name: 'auth-storage' },
  ),
);
```

**Bicarakan (45 detik):**
- "**Pemisahan tegas** antara client state dan server state:"
  - **Zustand** → auth token & user (jarang berubah, di-persist ke localStorage)
  - **TanStack Query** → semua data dari server (cache, refetch, invalidate)
- "Setiap `setCredentials` dan `logout` **clear TanStack Query cache** — mencegah data user A bocor ke user B"

> 💡 **Pesan kunci:** "Best practice React modern — jangan campur client state dan server state."

---

### 🔹 Pattern 3 — Custom Hooks untuk Data Layer

**Buka:** `src/hooks/useProducts.js`

**Tunjukkan struktur file:** scroll dari atas ke bawah cepat — list, detail, create, update, delete, prefetch.

```js
export const useProductsList = (params) => useQuery({ ... });
export const useProductDetail = (id) => useQuery({ ... });
export const useCreateProduct = () => useMutation({ ... });
export const useUpdateProduct = () => useMutation({ ... });  // ⭐ optimistic
export const useDeleteProduct = () => useMutation({ ... });
export const usePrefetchProductDetail = () => { ... };       // ⭐ prefetch
```

**Bicarakan (90 detik):**
- "Semua interaksi data produk di-encapsulate di **satu file hooks**"
- "Komponen tidak tahu detail HTTP — cuma panggil hook, dapat `data`, `isLoading`, `error`"
- **Highlight `useUpdateProduct`:** scroll ke `onMutate`/`onError`/`onSettled`
  - "Optimistic update — UI berubah dulu, server confirm kemudian. Kalau gagal, rollback otomatis."
- **Highlight `usePrefetchProductDetail`:**
  - "Di-trigger saat hover row/card → detail di-fetch ke cache **sebelum user klik**"

> 💡 **Pesan kunci:** "Hooks adalah abstraksi data layer — komponen fokus ke presentation, tidak peduli soal cache & HTTP."

---

### 🔹 Pattern 4 — Schema Validation dengan Zod

**Buka:** `src/schemas/productSchema.js`

```js
export const productSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.coerce.number().positive(),
});
```

**Bicarakan (45 detik):**
- "Validasi form pakai **Zod schema** + React Hook Form via `zodResolver`"
- "Schema bisa di-reuse — untuk form input, untuk parsing response, untuk inferensi tipe"
- "**Single source of truth** untuk constraint data"

> 💡 **Pesan kunci:** "Validation logic terpusat — tidak tersebar di tiap form."

---

## 📁 3. Management File (4:30 – 6:30)

> "Sekarang struktur folder — bagaimana file diorganisir."

**Buka VS Code File Explorer**, expand `src/`:

```
src/
├── assets/          # CSS global + design tokens (@theme)
├── components/      # Komponen UI generik (Button, Input, Modal, ...)
│   └── products/    # Komponen khusus produk (EditModal, DeleteDialog)
├── hooks/           # Custom hooks (data + UI state)
├── layouts/         # AuthLayout, DashboardLayout
├── lib/             # Utility murni (cn, pagination, queryClient, queryKeys)
├── pages/           # Halaman berbasis route
│   ├── auth/        # Login, Register
│   └── products/    # ProductsList, ProductCreate, ProductDetail
│       └── components/  # Sub-komponen khusus halaman list
├── routes/          # ProtectedRoute
├── schemas/         # Zod schemas
├── services/        # API layer (api.js + per-entity service)
├── store/           # Zustand stores
├── App.jsx          # Root routing
└── main.jsx         # Entry point
```

**Bicarakan (90 detik):**

### Prinsip 1 — Feature-by-Entity, Bukan Type-by-Type

> "Folder `pages/products/` punya sub-folder `components/` sendiri untuk komponen yang **cuma dipakai halaman itu**. Komponen shareable seperti Button, Modal, ada di `components/`."

### Prinsip 2 — Layer Pemisahan Jelas

| Folder | Tanggung jawab |
|---|---|
| `services/` | HTTP & API contract |
| `hooks/` | Data fetching & business logic |
| `components/` & `pages/` | Presentation |
| `store/` | Client state |
| `schemas/` | Validation |

> "Data flow selalu **searah**: `Component → Hook → Service → API`. Tidak ada komponen yang langsung pakai `fetch()`."

### Prinsip 3 — Path Alias `@/`

**Buka:** `jsconfig.json` cepat, tunjukkan paths

```json
"paths": { "@/*": ["./src/*"] }
```

> "Import pakai `@/components/Button` bukan `../../../components/Button`. Lebih bersih, lebih mudah di-refactor."

### Prinsip 4 — File Naming Convention

> "Komponen pakai **PascalCase** (`Button.jsx`, `ProductsTable.jsx`). Hook & utility pakai **camelCase** (`useProducts.js`, `cn.js`). Sederhana dan konsisten."

---

## 🚀 4. Fitur (6:30 – 10:00)

> "Sekarang yang terakhir — fitur apa yang sudah jalan. Pindah ke browser."

### 🔸 Fitur 1 — Authentication (30 detik)

- Tunjukkan URL `/login` (atau click logout dulu kalau sempat)
- **Bicarakan:** "Login form dengan validation Zod. Token disimpan ke localStorage via Zustand persist."
- Login → masuk dashboard
- **Bicarakan:** "Route `/products` dibungkus `ProtectedRoute` — kalau tidak ada token, auto redirect ke login."

### 🔸 Fitur 2 — Products List dengan Filter, Sort, Pagination (45 detik)

- Di `/products`, tunjukkan:
  - **Search** — ketik nama produk
  - **Sort** — ubah ke "Harga ↓"
  - **View toggle** — Table ↔ Grid
  - **Pagination** — klik halaman 2
- **Tunjukkan URL bar berubah** mengikuti filter
- **Bicarakan:** "Semua state filter di URL — **single source of truth**. Refresh tidak hilang, link bisa dishare."

### 🔸 Fitur 3 — Prefetch on Hover ⭐ (45 detik)

- Buka DevTools Network tab di samping browser
- **Hover** beberapa row/card tanpa klik
- **Bicarakan:** "Lihat — setiap hover trigger fetch detail di Network tab"
- Klik salah satu produk
- **Bicarakan:** "Detail tampil **instant** — tidak ada loading state, karena data sudah di cache"

### 🔸 Fitur 4 — CRUD Produk (60 detik)

- Klik tombol **"Tambah Produk"** → form create → submit → toast sukses
- Kembali ke list, klik tombol **Edit** pada salah satu produk
  - Ubah harga → Simpan
  - **Bicarakan:** "Lihat — modal langsung tutup, harga di list langsung berubah. Itu **optimistic update**. Kalau server gagal, otomatis rollback."
- Klik tombol **Delete** → confirm dialog → cancel
  - **Bicarakan:** "Delete pakai confirmation modal. Error 403/404 ditampilkan **inline** di modal, bukan toast — supaya konteks tidak hilang."

### 🔸 Fitur 5 — Performance Optimization (30 detik)

> "Behind the scenes, ada beberapa optimization yang sudah aktif:"

- ✅ **React Compiler** — auto-memoization
- ✅ **Code splitting** — setiap halaman lazy load
- ✅ **TanStack Query `staleTime: 60s`** — minimize refetch
- ✅ **`keepPreviousData`** — pagination tidak flicker
- ✅ **Prefetch on hover** + **Optimistic update**

*(Opsional, kalau ada waktu)* Buka terminal → `npm run build` → tunjukkan output ukuran bundle.

---

## 🆘 Backup Q&A — Antisipasi Pertanyaan

**Q: Kenapa Zustand bukan Redux?**
> Zustand lightweight, no boilerplate. Untuk auth state global yang jarang berubah, cukup. Server state pakai TanStack Query, bukan Redux.

**Q: Kenapa TanStack Query?**
> Built-in cache, refetch, optimistic update, prefetch. Tidak perlu setup store untuk server data.

**Q: Handle error gimana?**
> 3 layer: `apiFetch` throw typed `ApiError`, mutation hooks expose error ke component, UI tampilkan toast atau inline error tergantung konteks.

**Q: Ada testing?**
> Belum di-setup, tapi stack siap untuk Vitest + React Testing Library.

**Q: Kenapa Tailwind v4?**
> Lightning CSS engine lebih cepat. Config via `@theme` di CSS lebih portable, no `tailwind.config.js`.

**Q: React Compiler stable?**
> Stable per React 19. Di project ini sudah aktif via `babel-plugin-react-compiler`.

**Q: Kenapa pisah `components/` dan `pages/`?**
> `components/` = reusable di mana saja. `pages/` = route-bound. `pages/X/components/` = komponen khusus halaman tersebut, tidak di-share.

**Q: Optimistic update apakah aman?**
> Ada risk flash visual saat rollback. Mitigasi: error toast. Tradeoff acceptable demi UX responsif.

**Q: Apakah ada role-based access?**
> Belum, tapi mudah ditambahkan — `ProtectedRoute` tinggal di-extend untuk cek `user.role`.

---

## ⚠️ Hal yang HARUS dihindari

- ❌ **Jangan live coding** — risk tinggi untuk 10 menit
- ❌ **Jangan baca code baris per baris** — jelaskan konsep & kenapa
- ❌ **Jangan over-detail di styling/Tailwind** — bukan fokus presentasi
- ❌ **Jangan demo register flow** — sama dengan login, buang waktu
- ❌ **Jangan panic kalau demo gagal** — skip ke fitur berikutnya

---

## 🎬 Flow Singkat (untuk dihafalkan)

```
1. Intro (45 detik)
   └─ Project + stack + agenda 3 bagian

2. Handle Code (3:45)
   ├─ Centralized HTTP (api.js)
   ├─ Client vs Server state (useAuthStore)
   ├─ Custom hooks (useProducts) ⭐
   └─ Schema validation (Zod)

3. Management File (2:00)
   ├─ Struktur folder src/
   ├─ Feature-by-entity
   ├─ Layer separation
   ├─ Path alias @/
   └─ Naming convention

4. Fitur (3:30)
   ├─ Auth
   ├─ List + filter/sort/pagination
   ├─ Prefetch on hover ⭐ (Network tab)
   ├─ CRUD + optimistic update
   └─ Performance recap
```
