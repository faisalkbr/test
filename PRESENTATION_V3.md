# Cheat Sheet Presentasi V3 — Frontend DeptCase 180DC

> Target durasi: **10 menit**
> Format: **Tanpa demo, fokus code & arsitektur**
> Audience: **Recruiter / Technical Interviewer**

---

## 🎯 Prinsip Komunikasi

- **Kalimat pendek.** Maksimal 15 kata. Pisahkan ide.
- **Bahasa sehari-hari.** Bayangkan ngobrol dengan teman, bukan baca makalah.
- **Selalu jawab "kenapa".** Setelah sebut apa yang dipakai, langsung jelaskan kenapa.
- **Pakai analogi.** Konsep teknis lebih mudah dipahami lewat analogi.

---

## ⏱️ Pembagian Waktu

| Waktu | Bagian |
|---|---|
| 0:00 – 1:00 | Pembukaan |
| 1:00 – 3:30 | Pilihan Arsitektur |
| 3:30 – 6:00 | Pola Kode |
| 6:00 – 8:30 | Fitur Production-Grade |
| 8:30 – 10:00 | Penutup |

---

## 📋 Persiapan

- [ ] VS Code zoom besar (Ctrl/Cmd + 2-3x)
- [ ] Buka tab VS Code sesuai urutan:
  1. `src/App.jsx`
  2. `src/services/api.js`
  3. `src/store/useAuthStore.js`
  4. `src/hooks/useProducts.js`
  5. `src/hooks/useProductsFilters.js`
  6. `vite.config.js`

---

## 🎤 1. Pembukaan (0:00 – 1:00)

### 📢 Narasi

> "Selamat pagi. Terima kasih sudah meluangkan waktu.
>
> Hari ini saya mau presentasi project frontend untuk **portal internal 180DC UNAIR**. Singkatnya — ini dashboard buat tim 180DC mengelola katalog layanan konsultasi yang ditawarkan ke mitra.
>
> Sebelum saya buka code, saya mau atur ekspektasi dulu. Presentasi ini **bukan demo fitur**. Saya lebih fokus ke **kenapa saya pilih cara tertentu**, bukan sekadar pamer 'lihat, saya bisa bikin ini'.
>
> Tiga prinsip yang saya pegang waktu bikin project ini:
>
> Pertama, **siap production dari awal**. Bukan tutorial app yang kalau dipakai banyak orang langsung berantakan.
>
> Kedua, **mudah dilanjutkan orang lain**. Kalau besok ada developer baru join, dia harus bisa paham strukturnya dengan cepat.
>
> Ketiga, **pakai cara yang relevan sekarang**. Bukan pattern lama yang sudah ditinggalkan industri.
>
> Stack-nya: React 19, Vite, TanStack Query, Zustand, React Hook Form plus Zod, dan Tailwind v4. Saya akan jelaskan kenapa pilih ini satu per satu.
>
> Oke, mari masuk ke bagian pertama — pilihan arsitektur."

---

## 🏗️ 2. Pilihan Arsitektur (1:00 – 3:30)

### 📢 Narasi Pembuka

> "Ada empat keputusan arsitektur yang menurut saya paling fundamental di project ini. Saya bahas satu per satu."

---

### Decision 1 — State: Zustand + TanStack Query

**Buka:** `src/store/useAuthStore.js`

### 📢 Narasi

> "Yang pertama soal state management. Saya pakai **dua library berbeda**, untuk **dua jenis state berbeda**.
>
> Zustand untuk **state yang dimiliki frontend** — kayak token login, info user. Ini file Zustand-nya, kira-kira 20 baris saja.
>
> TanStack Query untuk **state yang asalnya dari server** — kayak daftar produk, detail produk.
>
> **Kenapa harus dipisah?** Karena sifatnya beda jauh. State server itu bisa kadaluarsa, perlu di-cache, perlu di-refetch. State client kayak token, simpan saja, jarang berubah.
>
> Banyak project React lama pakai Redux untuk **semua state**. Sekarang sudah dianggap kuno. Terlalu rumit untuk state sederhana, dan kurang canggih untuk handle data server.
>
> **Dampak praktisnya:** kode jadi jauh lebih sedikit. Cache, refetch, optimistic update — semua otomatis. Saya tinggal pakai.
>
> Stack ini juga dipakai Vercel dan Linear. Bukan eksperimen — sudah terbukti di production."

---

### Decision 2 — Routing: Lazy Loading

**Buka:** `src/App.jsx`

```jsx
const Login = lazy(() => import('./pages/auth/Login'));
const ProductsList = lazy(() => import('./pages/products/ProductsList'));
```

### 📢 Narasi

> "Yang kedua, routing. Pakai React Router. Tapi yang menarik di file ini bukan library-nya, tapi **dua pola yang saya terapkan**.
>
> **Pertama, code splitting.** Setiap halaman dibungkus `lazy()`. Artinya kode halaman cuma di-download **kalau halaman itu dibuka**.
>
> Analoginya seperti buku — daripada beli buku 1000 halaman padahal cuma baca bab 1, kita beli per bab. Lebih hemat, lebih cepat sampai.
>
> Hasilnya, ukuran download awal cuma sekitar **73 KB** terkompresi. Halaman lain menyusul sesuai kebutuhan.
>
> **Kedua, route guard via composition.** Lihat sini —"

```jsx
<Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
```

> "Saya tidak menulis cek token di **setiap halaman**. Cukup bungkus sekali di sini. Semua halaman di dalam grup ini otomatis terproteksi.
>
> Tambah halaman baru? Tinggal masukkan ke dalam grup. Tidak perlu ingat-ingat untuk tambah pengecekan auth."

---

### Decision 3 — Validation: React Hook Form + Zod

**Buka File Explorer ke folder `src/schemas/`.**

### 📢 Narasi

> "Yang ketiga, validasi form. Saya pakai React Hook Form dipadukan dengan Zod.
>
> Zod itu library untuk **mendeskripsikan bentuk data**. Misalnya: 'nama produk harus string, panjang 3 sampai 100 karakter, harga harus angka positif'.
>
> **Kenapa Zod, bukan validasi manual?** Karena **satu schema bisa dipakai untuk banyak hal**:
>
> - Validasi form sebelum submit
> - Parsing data dari server
>
> Jadi kalau besok backend tambah field baru, saya update **satu file schema**. Validasi di form dan parsing response langsung ikut update. Tidak perlu cari-cari di banyak tempat."

---

### Decision 4 — Styling: Tailwind v4

**Buka:** `src/assets/style.css`, scroll ke `@theme`

### 📢 Narasi

> "Yang keempat, styling. Tailwind v4. Yang ingin saya tunjukkan **bukan utility class-nya** — itu sudah biasa. Yang menarik adalah cara saya simpan **warna dan token desain**.
>
> Semua warna brand, warna teks, ukuran font — saya simpan di sini, di file CSS. Bukan di file JavaScript config seperti versi sebelumnya.
>
> **Kenapa lebih bagus?** Karena CSS itu native browser. Lebih portable. Kalau besok mau ganti warna brand atau implementasi dark mode, cukup ubah variabel di sini.
>
> Bonus: v4 dua sampai tiga kali lebih cepat compile dibanding v3. Pengalaman development jauh lebih nyaman."

---

## 🧩 3. Pola Kode (3:30 – 6:00)

### 📢 Narasi Pembuka

> "Selanjutnya, tiga pola kode yang menurut saya paling menunjukkan **kematangan engineering** di project ini."

---

### Pattern 1 — HTTP Layer Terpusat ⭐

**Buka:** `src/services/api.js`

### 📢 Narasi

> "Pola pertama — **semua request HTTP lewat satu pintu**.
>
> Lihat file ini, namanya `apiFetch`. Ini satu-satunya tempat di project yang **boleh memanggil `fetch()` ke backend**. Tidak ada komponen yang fetch langsung.
>
> **Tiga hal yang dia urus otomatis:**
>
> Satu, **pasang token login** ke setiap request. Saya nulis kode fitur baru — tidak perlu ingat 'oh iya harus tambah header Authorization'. Sudah otomatis.
>
> Dua, **kalau token expired** — server balas 401 — fungsi ini otomatis logout user. User langsung balik ke halaman login.
>
> Tiga, **error dibungkus rapi**. Ada class custom `ApiError` yang carry kode status dan data error. Jadi di komponen, saya bisa cek 'kalau error 403 tampilkan pesan ini, kalau 404 pesan itu' — clean, tanpa parsing teks.
>
> **Kenapa pola ini penting?** Bayangkan besok backend ubah cara auth — misalnya pindah dari token ke cookie, atau tambah CSRF. **Saya cukup ubah file ini saja.** Tidak perlu sentuh 50 komponen.
>
> Analoginya kayak resepsionis hotel — semua tamu yang masuk lewat dia. Kalau aturan masuk berubah, cukup update SOP resepsionis."

---

### Pattern 2 — Custom Hooks Sebagai Lapisan Data ⭐⭐

**Buka:** `src/hooks/useProducts.js`

### 📢 Narasi — Overview

> "Pola kedua, yang paling saya sukai dari project ini — **semua urusan data produk ada di satu file**.
>
> Lihat strukturnya: ambil daftar produk, ambil detail, buat baru, update, hapus, plus satu prefetch. Semua di sini.
>
> **Komponen tidak pernah tahu** soal HTTP, cache, atau invalidasi. Komponen cuma panggil hook, dapat `data`, `isLoading`, `error`. Selesai."

### 📢 Narasi — Optimistic Update

**Scroll ke `useUpdateProduct`, expand bagian `onMutate`/`onError`/`onSettled`**

> "Yang ingin saya highlight di sini — **cara update produk**. Saya pakai pola namanya **optimistic update**.
>
> Cara kerjanya begini. Pas user klik 'Simpan':
>
> **UI langsung berubah** — tanpa nunggu server jawab. Tapi saya simpan data lama dulu sebagai **cadangan**.
>
> Kalau server **berhasil** — perfect, data baru tetap di sana, user tidak merasa apa-apa.
>
> Kalau server **gagal** — saya kembalikan ke data lama. User lihat data 'kembali' seperti semula, plus dapat notif error.
>
> **Kenapa repot-repot begini?** Karena pengalaman pengguna jadi terasa **instant**. Tidak ada loading 500 milidetik yang bikin app terasa 'lambat'.
>
> Banyak developer junior cuma pakai pola standar — submit, spinner, tunggu, render. Itu **kerja**, tapi terasa lambat. Optimistic update bikin app terasa **enak dipakai**.
>
> Trade-off-nya: ada 5% kasus rollback yang user lihat data 'berkedip'. Tapi saya tambahkan toast error yang jelas, jadi user paham apa yang terjadi."

### 📢 Narasi — Prefetch

**Scroll ke `usePrefetchProductDetail`**

> "Satu lagi di file ini — **prefetch on hover**.
>
> Konsepnya: pas user **arahkan mouse** ke row produk, saya sudah mulai download detailnya **di background**.
>
> Pas user akhirnya klik — detail langsung muncul. **Tanpa loading.**
>
> Saya pasang juga di event `focus` — biar pengguna keyboard juga dapat manfaatnya. Kecil, tapi penting untuk aksesibilitas."

---

### Pattern 3 — URL Sebagai Sumber Kebenaran

**Buka:** `src/hooks/useProductsFilters.js`

### 📢 Narasi

> "Pola ketiga — **URL adalah sumber kebenaran** untuk state daftar produk.
>
> Maksudnya begini. Di banyak app React, state seperti 'halaman berapa', 'sedang search apa', 'sort by apa' — itu disimpan di state React (`useState`).
>
> **Saya sengaja tidak melakukan itu.** Semua state itu saya simpan di **URL**.
>
> Empat keuntungan langsung:
>
> Satu, **user refresh halaman — state tetap**. Tidak balik ke halaman 1 ulang.
>
> Dua, **link bisa dishare**. Saya bisa kirim URL ke kolega: 'lihat ini, halaman 5 dengan filter ini'. Mereka klik, lihat persis yang saya lihat.
>
> Tiga, **tombol back/next browser bekerja natural**. User klik next page, lalu back — kembali ke page sebelumnya. Seperti expectation.
>
> Empat, **tidak ada prop drilling**. Komponen cukup panggil hook ini, langsung dapat semua filter state.
>
> Pola ini juga dipakai Next.js App Router, Linear, GitHub. Sudah jadi standar di web modern."

---

## 🚀 4. Fitur Production-Grade (6:00 – 8:30)

### 📢 Narasi Pembuka

> "Sekarang lima fitur yang menurut saya membedakan project ini dari **tutorial app biasa**."

---

### Feature 1 — Prefetch on Hover ⭐

### 📢 Narasi

> "Pertama — tadi sudah saya singgung — **prefetch on hover**.
>
> Konsepnya simpel: pas user hover produk, detailnya sudah didownload di background. Pas user klik, langsung muncul **tanpa loading**.
>
> Hasilnya: kecepatan terasa **instant**. Bukan benar-benar instan, tapi user **persepsinya** instan. Itu yang penting.
>
> Trik ini dipakai Vercel, Linear, GitHub. Cheap win untuk UX."

---

### Feature 2 — React Compiler

**Buka:** `vite.config.js`

### 📢 Narasi

> "Kedua — **React Compiler**. Fitur baru React 19.
>
> Singkatnya: dia otomatis **mengoptimalkan kode React** waktu build. Komponen dan hook yang harusnya tidak perlu render ulang, otomatis di-skip.
>
> Tanpa dia, kita harus pakai `useMemo` dan `useCallback` manual di banyak tempat. Bertele-tele dan mudah lupa.
>
> Dengan compiler, kode lebih **bersih**, performa tetap optimal.
>
> Ini fitur baru — baru stabil akhir 2024. Saya enable di sini untuk menunjukkan saya **mengikuti perkembangan React**, dan **berani adopt fitur baru** di project nyata."

---

### Feature 3 — Security: Bersihkan Cache Saat Auth Berubah

**Buka:** `src/store/useAuthStore.js`

### 📢 Narasi

> "Ketiga — ini detail kecil, tapi **penting untuk keamanan**.
>
> Lihat dua fungsi di Zustand store ini — `setCredentials` dan `logout`. Keduanya panggil `queryClient.clear()` **sebelum** update state.
>
> **Skenarionya:**
>
> User A login di komputer kantor. Browsing produk. Logout. **Tutup browser? Tidak. Cuma logout.**
>
> User B datang, login. **Tanpa pembersihan cache** — data produk yang tadi dilihat user A masih ada di memori browser. Bisa muncul sebentar sebelum data baru di-fetch.
>
> Untuk app internal kayak gini — yang mungkin dipakai satu komputer rame-rame — **ini risiko nyata**.
>
> Dua baris kode kecil. Tapi menunjukkan **production thinking** — peduli sama kasus edge, bukan cuma happy path."

---

### Feature 4 — UX: Pagination Tanpa Flicker

**Buka:** `src/hooks/useProducts.js`, scroll ke `useProductsList`

### 📢 Narasi

> "Keempat — satu line code yang ngubah UX drastis. Lihat di sini, `keepPreviousData`.
>
> **Tanpa dia:** user klik halaman 2, list jadi kosong dulu, muncul skeleton loading, baru data halaman 2 muncul. Berkedip-kedip.
>
> **Dengan dia:** data halaman 1 tetap kelihatan sambil data halaman 2 di-fetch. Begitu siap, langsung ganti. **Mulus, tidak ada kedip.**
>
> Detail kecil. Tapi gabungan dengan optimistic update tadi, app ini terasa **seperti aplikasi native**, bukan web app yang lemot."

---

### Feature 5 — Error Handling: 3 Lapis

### 📢 Narasi

> "Yang terakhir — **strategi error handling tiga lapis**.
>
> **Lapis pertama**, di `apiFetch`. Semua error dibungkus jadi class `ApiError` standar. Tidak ada error mentah yang bocor ke atas.
>
> **Lapis kedua**, di custom hook. Hook expose `error` ke komponen. Komponen tinggal pakai, tidak perlu `try-catch`.
>
> **Lapis ketiga**, di UI. Saya bedakan **toast** dan **inline error** berdasarkan konteks.
>
> Error global — toast di pojok atas.
>
> Error 403 atau 404 di dalam modal — **inline di modal itu sendiri**. User tidak perlu pindah mata ke pojok untuk lihat pesan error. Konteks tetap.
>
> Error handling **bukan tempelan**. Dipikirkan dari layer paling bawah sampai UI."

---

## ✨ 5. Penutup (8:30 – 10:00)

### 📢 Narasi — Apa yang Project Ini Tunjukkan

> "Sebelum tutup, saya mau ringkas **kemampuan teknis yang ditunjukkan** lewat project ini.
>
> **Dari sisi tools dan library** — saya nyaman dengan React 19 dan fitur barunya, paham bedanya client state dan server state, bisa pakai optimistic update dan prefetch, bisa setup form validation modern, bisa konfigurasi build tool sendiri.
>
> Tapi itu bagian gampang. Yang lebih penting:
>
> **Saya bisa mengambil keputusan teknis dengan alasan yang jelas.** Setiap pattern di project ini punya rationale — bukan ikut-ikutan tutorial.
>
> **Saya peduli production reality.** Auth yang aman, error handling yang konsisten, performa yang terukur. Bukan cuma 'yang penting jalan'.
>
> **Saya pikirin pengalaman developer berikutnya.** Folder rapi, abstraksi yang jelas, pola yang bisa ditiru.
>
> **Saya pikirin pengalaman user.** Prefetch, optimistic update, no flicker — UX dipikirkan, bukan afterthought."

### 📢 Closing Statement

> "Singkatnya — saya bikin project ini dengan mindset: kalau besok ada developer baru join, dia harus bisa **paham struktur dalam beberapa jam**, dan **tambah fitur dalam beberapa hari** — tanpa takut merusak fondasi.
>
> Itu yang ingin saya tunjukkan hari ini. Terima kasih. Saya siap untuk pertanyaan."

---

## 🆘 Backup Q&A — Jawaban Siap Pakai

### Q: "Kenapa tidak pakai TypeScript?"

> "Project ini saya pilih JavaScript dulu untuk iterasi cepat. Tapi strukturnya **siap pindah ke TypeScript**.
>
> Schema Zod yang sudah ada bisa otomatis di-generate jadi tipe. Path alias sudah set. Tinggal rename file `.jsx` ke `.tsx` dan tambah annotation di props.
>
> Kalau ini project skala besar dari awal, saya pakai TypeScript dari hari pertama."

---

### Q: "Apa kelebihan project ini dibanding tutorial app?"

> "Tiga hal yang saya rasa beda.
>
> **Pertama, soal keamanan.** Saya handle auto-logout pas token expired, dan bersihkan cache pas login-logout. Tutorial biasanya cuma simpan token, selesai.
>
> **Kedua, soal UX.** Ada prefetch, optimistic update, no flicker. Tutorial pakai `useQuery` polos — submit, spinner, tunggu, render.
>
> **Ketiga, soal arsitektur.** Saya pisahkan client state dan server state. HTTP terpusat. State pakai URL. Tutorial biasanya semua di `useState` dan `fetch` mentah."

---

### Q: "Apa challenge terbesar di project ini?"

> "Yang paling menarik buat saya — **mutusin optimistic update atau pessimistic untuk edit produk.**
>
> Pessimistic itu lebih aman. Tunggu server, dapat konfirmasi, baru update UI. Tidak ada risiko rollback.
>
> Optimistic itu lebih cepat dirasakan user, tapi kalau gagal, ada flash visual yang membingungkan.
>
> Saya akhirnya pilih optimistic. Alasannya — **95% kasus akan berhasil**. User edit produk mereka sendiri, server hampir pasti accept. Untuk 5% kasus gagal, saya tambah toast error yang jelas.
>
> Trade-off-nya saya pilih: UX lebih penting daripada cover edge case yang jarang."

---

### Q: "Kalau ada waktu lebih, apa yang akan ditambah?"

> "Tiga prioritas, urutannya:
>
> **Pertama, testing.** Vitest plus React Testing Library. Fokus di custom hooks dulu — di situ business logic-nya.
>
> **Kedua, migrasi ke TypeScript.** Untuk safety dari schema sampai komponen.
>
> **Ketiga, monitoring.** Sentry untuk error tracking, analytics untuk perilaku user. Saat ini saya buta kalau ada error di production.
>
> Stack-nya sudah siap untuk ketiganya. Tinggal eksekusi."

---

### Q: "Bagaimana scale ke tim besar?"

> "Beberapa hal sudah disiapkan untuk skala:
>
> **Struktur folder per-fitur.** Developer baru bisa cari file dengan cepat.
>
> **HTTP layer terpusat dan custom hooks.** Mencegah inkonsistensi — tidak ada developer yang tiba-tiba fetch mentah dengan format berbeda.
>
> **URL-based state.** PM atau designer bisa share link untuk diskusi spesifik.
>
> Yang perlu ditambah: **lint rules** untuk enforce konvensi, dan **PR template** untuk standarisasi review."

---

### Q: "Solo atau team?"

> "Solo project. Justru yang saya rasa berharga dari solo — saya **terpaksa pikirin end-to-end**. Dari API contract, data layer, UI, sampai deployment.
>
> Saya tetap apply disiplin seperti tim — commit message yang rapi, code review sendiri, dokumentasi keputusan teknis. Kebiasaan yang akan saya bawa kalau nanti join tim."

---

## 💡 Tips Komunikasi

### ✅ DO

- **Pendekkan kalimat.** Maksimal 15 kata. Pisahkan ide.
- **Sebut "kenapa" sebelum lanjut.** Setiap kali bilang "saya pakai X", langsung diikuti "karena Y".
- **Pakai analogi.** "Seperti resepsionis hotel" lebih nempel daripada "centralized layer".
- **Pause setelah poin penting.** Beri waktu 1-2 detik. Bikin recruiter cerna.
- **Tunjuk code dengan kursor** saat menjelaskan baris spesifik.

### ❌ DON'T

- **Jangan baca code.** Recruiter bisa baca sendiri. Anda jelaskan **konsep**.
- **Jangan campur Inggris-Indo terlalu banyak.** "Saya implement pattern centralized HTTP layer untuk maintain consistency" — ribet. Pakai satu bahasa dominan.
- **Jangan minder.** Kalau ditanya hal yang belum dicoba: "Belum pernah pakai di production, tapi familiar konsepnya. Bisa belajar cepat."
- **Jangan dogmatis.** "X selalu lebih baik" terdengar junior. Pakai trade-off language.
- **Jangan terburu-buru.** Pelan tapi yakin lebih baik daripada cepat tapi gugup.

### Phrase Powerful

> "Trade-off yang saya pilih di sini..."
> "Saya sengaja pilih X daripada Y karena..."
> "Detail kecil, tapi penting untuk production..."
> "Dampaknya konkret di sini..."
> "Pola ini juga dipakai [Vercel/Linear/dst]..."
> "Yang bedain dari tutorial app..."

---

## 🎬 Cheat Card untuk Dihafal

```
1. PEMBUKAAN (1 menit)
   "Bukan demo. Fokus ke kenapa."
   3 prinsip: production-ready, mudah dilanjut, modern

2. PILIHAN ARSITEKTUR (2.5 menit)
   ├─ State: Zustand + TanStack Query (pisah client vs server)
   ├─ Routing: Lazy + ProtectedRoute (analoginya: beli buku per bab)
   ├─ Validation: Zod schema (satu file, multi-pakai)
   └─ Styling: Tailwind v4 tokens (CSS native, portable)

3. POLA KODE (2.5 menit)
   ├─ HTTP layer terpusat ⭐ (analoginya: resepsionis hotel)
   ├─ Custom hooks ⭐⭐ (optimistic + prefetch)
   └─ URL as truth (link bisa dishare)

4. FITUR PRODUCTION (2.5 menit)
   ├─ Prefetch on hover (perceived = instant)
   ├─ React Compiler (auto-optimize)
   ├─ Cache clearing (security detail)
   ├─ keepPreviousData (no flicker)
   └─ Error 3 lapis (toast vs inline)

5. PENUTUP (1.5 menit)
   "Developer baru harus bisa paham dalam jam, extend dalam hari"
```
