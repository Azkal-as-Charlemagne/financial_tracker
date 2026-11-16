# ARCHER — Financial Management & Intelligence Platform (Frontend)

Antarmuka pengguna lintas-platform untuk ekosistem **Ledger Suci — Financial Events Ledger** (`financial_tracker`), dibangun dengan **React 19**, **TypeScript 5.7**, **Vite 6**, **Tailwind CSS 4**, **Zustand**, dan **i18next**.

Dirancang dengan filosofi **High Information Density, Low Cognitive Load** (*Sharp Corporate + Subtle Sporty*) untuk mendukung pencatatan keuangan akurasi tinggi baik bagi pengguna **Individu (Pribadi)** maupun **Organisasi (UMKM/Korporasi)**.

---

## 1. Prasyarat & Cara Menjalankan (Lokal)

Pastikan **Node.js LTS (v20+ / v26+)** dan **npm** telah terpasang di perangkat Anda.

```bash
# 1. Masuk ke direktori frontend dari root monorepo
cd frontend

# 2. Salin konfigurasi environment variable
cp .env.example .env

# 3. Instal seluruh dependensi
npm install

# 4. Jalankan server pengembangan (Hot Module Replacement di port 3000)
npm run dev

# 5. Jalankan pemeriksaan tipe TypeScript & Unit Test (Vitest)
npm run typecheck
npm test

# 6. Buat bundle produksi (output ke folder dist/)
npm run build
```

---

## 2. Daftar Environment Variables

Konfigurasi environment variable didefinisikan di dalam file `.env` atau `.env.local` (lihat template di [`.env.example`](./.env.example)):

| Variabel | Nilai Default / Fallback | Deskripsi |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Base URL utama untuk berkomunikasi dengan REST API Backend Kotlin Spring Boot (`src/lib/api/client.ts`). |

---

## 3. Struktur Arsitektur Modul (`frontend/src`)

```text
frontend/
├── public/
├── src/
│   ├── __tests__/               # Unit tests (Vitest) untuk logika buku besar & lokalisasi
│   ├── app/
│   │   ├── App.tsx              # Root routing dengan React.lazy() code-splitting per modul
│   │   └── main.tsx             # Entry point React 19 & inisialisasi i18n
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx     # Hybrid Contextual Navigation (Sidebar, Breadcrumb, Period Pill)
│   │   │   └── CommandPalette.tsx # Pencarian & aksi cepat lintas modul (Ctrl+K)
│   │   └── ui/                  # Komponen Design System (Button, Badge, Card, Input, Modal)
│   ├── features/
│   │   ├── dashboard/           # Assisted Adaptive Dashboard (3 lapisan informasi & kustomisasi widget)
│   │   ├── transactions/        # Jurnal Transaksi & Buku Besar Double-Entry + Modal Input + Ekspor CSV
│   │   ├── accounts/            # Manajemen Akun Internal vs Eksternal & Rekonsiliasi MTM
│   │   ├── budgets/             # Manajemen Anggaran Bulanan & Batas Asisten AI (Advisory Only)
│   │   ├── analytics/           # Analitik MTM Bulanan, Pertumbuhan Kekayaan Tahunan (PKT) & Inflasi BI/US CPI
│   │   ├── investments/         # Alokasi Portofolio (SSSF, Equity, Explore) & Penilaian Daya Penghasilan
│   │   ├── organization/        # Manajemen Keuangan Organisasi, Cost Center, dan Otorisasi Peran Anggota
│   │   └── settings/            # Pengaturan Bahasa (id-ID/en-US), Tema, Simulator Entitlement & Tabel Pengawas ETL
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts        # HTTP Client ke Backend Kotlin (VITE_API_BASE_URL)
│   │   │   └── mock-excel-dataset.ts # Dataset simulasi berlabel eksplisit dari skema Excel asli
│   │   ├── i18n/                # Kamus bahasa terpusat: Bahasa Indonesia (default) & English
│   │   └── utils.ts             # Formatter mata uang (IDR/USD), tanggal, dan batas bulan kalender
│   ├── stores/
│   │   ├── app-store.ts         # State UI, Tema (Light/Dark/System), Bahasa, dan Entitlements Backend
│   │   └── financial-data-store.ts # State reaktif buku besar double-entry & rekonsiliasi MTM
│   ├── styles/
│   │   ├── design-tokens.css    # Token warna CSS Custom Properties (Light & Dark Mode)
│   │   └── globals.css          # Aturan dasar Tailwind CSS 4 & font-variant-numeric: tabular-nums
│   └── types/
│       └── financial.ts         # Kontrak TypeScript yang selaras dengan tabel relasional database/Excel
├── .env.example                 # Template environment variables
├── DESIGN_SYSTEM.md             # Dokumentasi spesifikasi Design System
├── index.html                   # Entry HTML5 dengan pencegah flash tema (FOUC)
├── package.json                 # Skrip npm dan daftar dependensi
├── tsconfig.json                # Konfigurasi TypeScript strict mode
└── vite.config.ts               # Konfigurasi bundler Vite 6 & manualChunks optimasi performa
```

---

## 4. Prinsip Desain & Kepatuhan Arsitektur

1. **Integrasi Backend Kotlin**: Seluruh komunikasi API terpusat di `src/lib/api/client.ts` menggunakan `import.meta.env.VITE_API_BASE_URL`. Selama pengembangan ketika endpoint belum aktif, data simulasi ditandai secara transparan di antarmuka.
2. **Periode Kalender Bulanan Tegas**: Laporan bulanan dihitung mulai tanggal `01` pukul `00:00` hingga hari terakhir bulan kalender pukul `23:59` (bukan *rolling* 30 hari), serta memisahkan saldo akun titik-waktu dari agregat transaksi bulanan.
3. **Independensi Bahasa (`id-ID` / `en-US`) & Mata Uang (`IDR` / `USD`)**: Mengganti bahasa antarmuka hanya menerjemahkan label dan format tanggal tanpa pernah mengubah mata uang transaksi, kurs, atau perhitungan akuntansi.
4. **Batas Kendali AI**: Fitur AI bertindak murni sebagai asisten pendukung (rekomendasi anggaran, rasio kewajiban/piutang, dan alokasi portofolio) dan tidak pernah mengeksekusi transaksi secara otonom tanpa persetujuan pengguna.
