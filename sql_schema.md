## Ledger Suci Financial Tracker Architecture

Arsitektur database dan pipeline data finansial enterprise-grade berbasis Double-Entry Bookkeeping (standar perbankan) dengan sistem Dual Database (OLTP dan OLAP) di PostgreSQL (Neon) serta integrasi LLM Agent bernama Archer.

--- 

# Overview Arsitektur dan Pipeline Flow

Alur data berjalan secara satu arah dari Frontend ke Database Operasional (OLTP), lalu diproses oleh ETL Python berdasarkan tenggat waktu untuk dibekukan ke Database Analitik (OLAP). Selanjutnya, data bersih di OLAP dimanfaatkan oleh Machine Learning dan LLM Agent Archer untuk memberikan insight finansial.

Frontend / Aplikasi: Tempat pengguna melakukan input dan melihat dashboard.

OLTP Database (Mutable Operations): Menampung data operasional harian yang masih bisa diedit dalam batas grace period.

ETL Python (Kurir Data): Menjalankan validasi dan pemindahan data dari OLTP ke OLAP secara berkala tiap 3 hari.

OLAP Database (Immutable Sacred Ledger): Gudang data utama yang terkunci rapat dan menyimpan seluruh sejarah transaksi mutlak.

Kotak Pintar (Smart Correction Box): Fitur khusus untuk mengoreksi transaksi di atas 3 hari menggunakan mekanisme RVS dan RSN.

Machine Learning dan Archer: Sistem analitik cerdas yang membaca data dari OLAP untuk menyajikan laporan dan insight.

Kunci Arsitektur dan Aturan Main
1. Dual Database Strategy (PostgreSQL to PostgreSQL)
OLTP (Operational Database)

Menampung seluruh tabel master atau parents seperti entry_user_detail, account_detail, category_detail, location_detail, dan sejenisnya.

Menampung transaksi harian secara fleksibel (INSERT, UPDATE, DELETE) demi kenyamanan User Experience (UX) pengguna.

OLAP (Data Warehouse / Ledger Suci)

Berisi tabel Fact dan Events seperti financial_events, trx_detail, rcm_detail, pkt_support, pkt_detail, serta Dimension Tables.

Sifat data bersifat Immutable dan Append-Only (dikunci ketat dengan Zero Trust Roles dan Triggers). Data di sini adalah sejarah absolut yang tidak boleh dimanipulasi.

2. Aturan Masa Tenggat 3 Hari (Grace Period Pipeline)
Zona Panas (Kurang dari 3 Hari)

Transaksi di OLTP masih bersifat cair. User bebas meng-edit atau menghapus transaksi jika terjadi kesalahan ketik harian.

Proses ETL (Jalan Tiap 3 Hari Sekali)

Kurir ETL Python akan menyapu data transaksi di OLTP yang umurnya sudah melewati 3 hari.

ETL melakukan validasi rumus seperti CAGR, Net Worth, dan Inflation Effect, lalu membekukan data tersebut menjadi Ledger Suci di OLAP.

Zona Dingin (Lebih dari 3 Hari)

Transaksi yang sudah masuk ke OLAP menjadi Read-Only di UI utama aplikasi dan tidak dapat di-edit atau di-delete secara mentah.

3. Kotak Pintar (Smart Correction Box) dan Audit Trail
Untuk transaksi di atas 3 hari yang terlanjur masuk ke Ledger Suci namun memiliki kesalahan baik salah nominal, salah tanggal, salah kategori, maupun salah akun:

Pencarian Canggih: Menggunakan Search Similarity (pg_trgm / trigram matching) pada deskripsi dan tanggal untuk menemukan transaksi lama.

Mekanisme Koreksi (RVS dan RSN):

RVS (Reversal): Event otomatis untuk menetralkan atau membatalkan transaksi lama.

RSN (Correction): Event otomatis untuk menuliskan transaksi baru yang benar.

Transaksi koreksi dimasukkan ke pipeline untuk dikirim ke OLAP pada siklus ETL berikutnya.

4. Integritas Garis Waktu (written_at vs event_date)
event_date: Tanggal saat transaksi terjadi di dunia nyata (digunakan untuk kalkulasi dan laporan keuangan).

written_at: Stamp waktu mutlak (clock_timestamp) saat event ditulis ke database.

Baris data di Ledger disusun berdasarkan urutan written_at, sehingga koreksi transaksi masa lalu akan selalu menempel di baris paling bawah sebagai catatan audit trail (bulletproof audit).

Machine Learning dan LLM Integration (Archer)
ML Pipeline: Membaca data bersih dari OLAP secara Read-Only untuk mengkurasi pola pengeluaran, estimasi cashflow, dan metrik kesehatan finansial.

Feedback Loop: Hasil olahan ML dikirim kembali ke tabel khusus di OLTP untuk disajikan dalam bentuk visualisasi UI.

Archer (LLM Agent): Berinteraksi langsung dengan database via query cerdas untuk menyajikan insights dan laporan natural kepada user berdasarkan riwayat Ledger Suci.
