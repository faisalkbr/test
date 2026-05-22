# 180DC UNAIR — Internal Portal

Portal internal untuk pengurus dan konsultan **180 Degrees Consulting UNAIR**, dipakai untuk mengelola katalog produk/layanan konsultasi.

Frontend ini terhubung ke backend Vercel `https://test-180dc.vercel.app` (di-proxy via `/api`).

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) dengan design tokens via `@theme` |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Client state | Zustand (persist middleware untuk auth) |
| Form | React Hook Form + Zod (via `@hookform/resolvers`) |
| Notifications | react-hot-toast |
| Fonts | Geist + Geist Mono + Instrument Serif (Google Fonts) |

---

## Setup

```powershell
# 1. Install dependencies
npm install

# 2. (Opsional) Override API base URL — default sudah cukup.
#    Buat .env di root kalau perlu:
#    VITE_API_BASE_URL=/api/v1

# 3. Dev server
npm run dev          # → http://localhost:5173

# 4. Build produksi
npm run build

# 5. Lint
npm run lint
```

### Konfigurasi proxy

Request ke `/api/*` di-proxy ke backend production di `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'https://test-180dc.vercel.app',
    changeOrigin: true,
  },
}
```

---

## Struktur Folder

```
src/
├── assets/style.css           # Tailwind v4 @theme tokens + base CSS
├── components/
│   ├── Avatar.jsx             # Avatar + ProductAvatar (hash-color)
│   ├── Button.jsx             # 6 varian × 3 size + loading + leading/trailing
│   ├── Input.jsx              # Leading/trailing/hint/password toggle
│   ├── Logo180.jsx            # Logo lockup
│   ├── Modal.jsx              # Native <dialog> + footer slot
│   ├── PageHeader.jsx         # Breadcrumb + title + actions
│   ├── Spinner.jsx
│   ├── icons.jsx              # Inline SVG icon set
│   └── products/
│       ├── DeleteProductDialog.jsx
│       └── EditProductModal.jsx
├── hooks/
│   ├── useAuthMutations.js    # useLoginMutation, useRegisterMutation
│   ├── useDebounce.js
│   └── useProducts.js         # list/detail/create/update/delete
├── layouts/
│   ├── AuthLayout.jsx         # Split-screen brand panel
│   └── DashboardLayout.jsx    # Dark sidebar + main area
├── lib/
│   ├── formatCurrency.js
│   ├── queryClient.js
│   └── queryKeys.js           # Query key factory
├── pages/
│   ├── NotFound.jsx
│   ├── auth/{Login,Register}.jsx
│   └── products/{ProductsList,ProductCreate,ProductDetail}.jsx
├── routes/ProtectedRoute.jsx
├── schemas/{authSchema,productSchema}.js
├── services/{api,products}.js
├── store/useAuthStore.js      # Zustand auth (persisted)
├── App.jsx                    # Router root
└── main.jsx                   # QueryClientProvider + StrictMode
```

---

## Fitur

### Auth
- **Login** (`/login`) & **Register** (`/register`)
- Token JWT disimpan di Zustand → persisted ke `localStorage` (key: `auth-storage`)
- Otomatis logout + clear cache pada response **401 Unauthorized**
- Backend register **wajib** menerima field `confirmPassword`

### Products (CRUD lengkap)
- **List** (`/products`) — pagination angka, search debounced 400ms, sort by `name`/`created_at`, order `asc`/`desc`, view toggle table/grid, skeleton loading, empty state search-aware
- **Create** (`/products/new`) — form 2-kolom + live preview + tips
- **Detail** (`/products/:id`) — hero card + side panel metadata + activity
- **Edit** — modal dengan **PATCH partial** (hanya field yang berubah lewat RHF `dirtyFields`)
- **Delete** — confirm dialog dengan inline error 403/404

### State management
- **URL sebagai source of truth** — `page`, `search`, `sort_by`, `sort_order`, `view` semua di `useSearchParams` (shareable & survive refresh)
- **Cache invalidation** — `queryClient.clear()` pada login/logout untuk mencegah data leak antar user

---

## Konvensi Kode

### TanStack Query
- **Query key factory** terpusat di `lib/queryKeys.js`:
  ```js
  queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
  ```
- **`placeholderData: keepPreviousData`** untuk pagination tanpa flicker
- **Hooks UI-agnostic** — `useCreateProduct`/`useUpdateProduct`/`useDeleteProduct` hanya invalidate cache; caller (page/modal) yang handle toast + navigation

### Form
- Validasi via **Zod schema** yang match constraint backend (mis. `name` 3–100 char, `price > 0`)
- **Partial update**: edit modal kirim hanya field dengan `dirtyFields[key]`
- Error 403/404 ditampilkan **inline** di dialog, bukan toast

### Styling
- Tailwind v4 dengan `@theme` directive — semua warna/font sebagai utility class (`bg-brand-500`, `text-ink-950`, `font-mono`)
- Custom helper class: `.eyebrow` untuk label kapital mono
- Native `<dialog>` untuk modal (ESC + focus trap + backdrop gratis)

### Routing
- `ProtectedRoute` membungkus `DashboardLayout` untuk semua route dashboard
- `AuthLayout` redirect ke `/products` jika user sudah punya token

---

## Endpoint Backend

Spec lengkap: [https://test-180dc.vercel.app/docs](https://test-180dc.vercel.app/docs)

| Method | Path | Deskripsi |
|---|---|---|
| POST | `/api/v1/auth/register` | Register akun baru |
| POST | `/api/v1/auth/login` | Login → return JWT |
| GET | `/api/v1/products/` | List paginated (`page`, `limit`, `search`, `sort_by`, `sort_order`) |
| GET | `/api/v1/products/{id}` | Detail produk |
| POST | `/api/v1/products/` | Create (auth required) |
| PATCH | `/api/v1/products/{id}` | Update partial (auth + owner) |
| DELETE | `/api/v1/products/{id}` | Delete (auth + owner) |

Field minimum produk: `name` (3–100 char) + `price` (> 0). Response selalu wrapped: `{ success, message, data, pagination?, error? }`.

---

## Design System

Visual identity mengacu pada brand 180DC UNAIR:

| Token | Value | Pemakaian |
|---|---|---|
| Brand green | `#5DBB2D` | Aksen, active state, CTA accent |
| Ink/dark | `#0A0B0A` | Sidebar, auth panel, primary button |
| Background | `#FAFAF7` | Surface utama (warm off-white) |
| Paper | `#FFFFFF` | Card surface |
| Danger | `#C73A2E` | Delete, error |
| Font sans | Geist | Body, heading |
| Font mono | Geist Mono | ID, harga, label kapital |
| Font serif | Instrument Serif | Aksen elegan (auth headline, 404) |

Logo asset: `public/assets/logo-180dc.jpg`.

---

## Troubleshooting

**Data pengguna lama muncul setelah login akun lain**
→ Sudah di-handle: `queryClient.clear()` dipanggil di `setCredentials` & `logout` ([useAuthStore.js](src/store/useAuthStore.js)).

**Response 500 saat create produk**
→ Token mungkin reference `owner_id` yang sudah di-reset di DB backend. Logout & register akun baru.

**Build error "Cannot resolve @tailwindcss/vite"**
→ `npm install` ulang. Tailwind v4 butuh `@tailwindcss/vite` (bukan PostCSS plugin gaya v3).

**Lint warning "Compilation Skipped: Use of incompatible library" pada `watch()`**
→ Aman diabaikan. React Compiler vs React Hook Form — false positive yang tidak mempengaruhi runtime.
