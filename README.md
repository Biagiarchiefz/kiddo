# Kiddo — Platform Belajar Interaktif untuk Anak Indonesia

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)

**Kiddo** adalah platform belajar interaktif yang dirancang khusus untuk anak usia **7–12 tahun**. Anak-anak dapat menjelajahi modul materi, mengerjakan kuis singkat, mengumpulkan XP & lencana, dan bersaing di papan peringkat — semuanya dalam antarmuka yang menyenangkan.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Materi Interaktif** | Modul belajar terstruktur per unit dengan konten teks & gambar |
| **Kuis Kilat** | Kuis pilihan ganda, benar/salah, isi jawaban, setelah setiap unit untuk mengumpulkan XP |
| **Sistem XP & Level** | Poin pengalaman bertambah setiap menyelesaikan kuis |
| **Papan Peringkat** | Ranking pengguna berdasarkan total XP |
| **Lencana (Badges)** | Pencapaian khusus yang dapat dikumpulkan |
| **Tantangan (Challenges)** | Soal-soal tantangan lintas modul |
| **Admin Panel** | Kelola modul, unit, soal, dan pengguna |

---

## Demo Akun

> Akun berikut tersedia untuk keperluan penilaian / demo.

### Admin
| Field | Value |
|---|---|
| Email | `admin@gmail.com` |
| Password | `123456` |

Setelah login sebagai admin, akses panel admin di: `/admin`

### User Biasa
| Field | Value |
|---|---|
| Email | `asep@gmail.com` |
| Password | `123456` |

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion
- **State Management:** Zustand, TanStack Query v5
- **Routing:** React Router v7
- **Backend & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **UI Components:** Radix UI primitives via shadcn, Lucide React icons

---

## Struktur Proyek

```
kiddo/
├── public/
├── src/
│   ├── assets/
│   │   └── images/          # Aset gambar (WebP)
│   ├── components/
│   │   ├── common/          # Komponen shared lintas fitur
│   │   │   ├── AuthGuard.tsx      # Guard: redirect ke / jika belum login
│   │   │   ├── AdminGuard.tsx     # Guard: redirect ke /dashboard jika bukan admin
│   │   │   ├── GuestGuard.tsx     # Guard: redirect ke /dashboard jika sudah login
│   │   │   ├── Pagination.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── layouts/
│   │   │   ├── LandingPageLayout/ # Layout publik (Navbar + Footer)
│   │   │   ├── AppLayout/         # Layout app siswa (Sidebar + Navbar)
│   │   │   └── AdminLayout/       # Layout panel admin
│   │   ├── ui/              # Komponen shadcn/ui (jangan diedit manual)
│   │   └── views/           # Komponen halaman per route
│   │       ├── Home/              # Landing page
│   │       ├── Login/
│   │       ├── Register/
│   │       ├── Dashboard/
│   │       ├── Materi/            # Daftar unit dalam satu modul
│   │       ├── UnitDetail/        # Konten unit belajar
│   │       ├── QuizKilat/         # Kuis setelah unit
│   │       ├── Challenge/
│   │       ├── Leaderboard/
│   │       ├── Badges/
│   │       └── Admin/             # Halaman-halaman admin
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Context autentikasi global
│   │   └── BreadcrumbContext.tsx
│   ├── features/            # Route definitions per fitur
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── materi/
│   │   ├── challenges/
│   │   ├── leaderboard/
│   │   ├── badges/
│   │   └── admin/
│   ├── hooks/               # Utility hooks shared (useDebounce, use-mobile)
│   ├── lib/
│   │   └── utils.ts         # Helper cn() untuk merge Tailwind classes
│   ├── routes/
│   │   └── index.tsx        # Router utama (createBrowserRouter)
│   ├── types/
│   │   └── database.ts      # TypeScript types hasil generate Supabase
│   ├── utils/
│   │   └── supabase.ts      # Supabase client instance
│   ├── index.css            # Tailwind v4 + CSS variables (design tokens)
│   └── main.tsx             # Entry point
├── .env.example
├── package.json
├── tsconfig.app.json
└── vite.config.ts
```

### Pola Arsitektur

- **Route guards:** Tiga jenis guard melindungi halaman sesuai status autentikasi dan role.
- **View hooks:** Setiap halaman memiliki custom hook co-located (misal `useLogin.tsx`) yang mengelola semua state & data — komponen view hanya bertugas merender.
- **Features folder:** Setiap fitur mendefinisikan route-nya sendiri di `<feature>.routes.tsx` dan di-spread ke router utama di `src/routes/index.tsx`.

---

## Alur Navigasi

```
/                          → Landing page (publik)
/login                     → Halaman login
/daftar                    → Halaman registrasi

/dashboard                 → Dashboard siswa (perlu login)
/materi/:id                → Daftar unit dalam satu modul
/materi/:id/unit/:uid      → Konten unit belajar
/materi/:id/unit/:uid/kuis → Kuis kilat
/challenges                → Tantangan
/leaderboard               → Papan peringkat
/badges                    → Koleksi lencana

/admin                     → Dashboard admin (perlu role admin)
/admin/modules             → Kelola modul
/admin/modules/:id/units   → Kelola unit per modul
/admin/units/:id/questions → Kelola soal per unit
/admin/users               → Kelola pengguna
```

---

## Menjalankan Secara Lokal

### Prasyarat

- Node.js 18+
- npm
- Akun [Supabase](https://supabase.com)

### Langkah Instalasi

```bash
# 1. Clone repo
git clone https://github.com/<username>/kiddo.git
cd kiddo

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env
```

### Konfigurasi Environment

Isi file `.env` dengan kredensial Supabase project Anda:

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

### Jalankan Dev Server

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

### Perintah Tersedia

```bash
npm run dev       # Dev server dengan Vite HMR
npm run build     # Type-check + build produksi
npm run lint      # Jalankan ESLint
npm run preview   # Preview build produksi
```

## Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan kompetisi.
