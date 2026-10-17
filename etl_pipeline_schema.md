### 1. KELOMPOK: Manajemen Pengguna & Otoritas (Identity & Access)

* **`users`** (Identitas utama user)
* `user_id` (PK, UUID / Serial)
* `email` (Unique)
* `password_hash`
* `status` (active, suspended, deactivated)
* `created_at`, `updated_at`

---

* **`user_profiles`** (Detail personal, KYC ringan)
* `profile_id` (PK)
* `user_id` (FK ke users)
* `first_name`, `middle_name`, `last_name`
* `birth_date`, `phone_number`, `address`, `city`, `country`

---

* **`user_sessions`** (Tracking login & keamanan perangkat)
* `session_id` (PK)
* `user_id` (FK)
* `device_info`, `ip_address`
* `refresh_token`, `expires_at`, `is_active`

---

* **`user_roles` & `permissions**` (RBAC enterprise)
* `role_id`, `role_name` (Admin, Auditor, Regular User)
* `user_role_mapping` (`user_id`, `role_id`)

---

### 2. KELOMPOK: Manajemen Akun & Finansial (Accounts & Wallets)

* **`institutions`** (Bank atau penyedia dompet digital, misal: BCA, Jago, PayPal)
* `institution_id` (PK)
* `institution_name`, `institution_code`, `swift_code`

---

* **`accounts`** (Rekening/Dompet spesifik milik user)
* `account_id` (PK)
* `user_id` (FK)
* `institution_id` (FK)
* `account_name` (Contoh: "Jago Kantong Utama")
* `account_type` (Checking, Savings, Credit Card, Investment, Cash)
* `currency` (IDR, USD, etc.)
* `current_balance` (Cached balance for performance)
* `is_active`, `created_at`

---

* **`account_shares`** (Kalau akun/rekening bisa di-share ke partner/keluarga)
* `share_id` (PK), `account_id` (FK), `shared_with_user_id` (FK)
* `permission_level` (read-only, full-access)



---

### 3. KELOMPOK: Klasifikasi & Taksonomi (Categories & Tags)

* **`categories`** (Kategori transaksi hierarkis)
* `category_id` (PK)
* `user_id` (Nullable, kalau null berarti kategori global/default system)
* `parent_category_id` (Self-referencing untuk sub-kategori)
* `category_name`, `category_type` (Income, Expense, Transfer)
* `icon`, `color_code`

---

* **`tags`** (Label bebas untuk transaksi, misal #liburan, #kantor)
* `tag_id` (PK), `user_id` (FK), `tag_name`

---

* **`transaction_tags`** (Many-to-many relasi transaksi ke tag)
* `transaction_id` (FK), `tag_id` (FK)



---

### 4. KELOMPOK: Mesin Transaksi Inti / OLTP Ledger (Core Transactions)

* **`transactions`** (Tabel transaksional utama / *Journal Entries*)
* `transaction_id` (PK, UUID)
* `user_id` (FK)
* `source_account_id` (FK ke accounts - Dari mana uang keluar)
* `destination_account_id` (FK ke accounts - Ke mana uang masuk, penting buat transfer/pindahan dompet)
* `category_id` (FK)
* `amount` (Nominal transaksi)
* `currency`
* `exchange_rate` (Jika lintas mata uang)
* `transaction_type` (Income, Expense, Transfer)
* `transaction_date` (Tanggal kejadian transaksi oleh user)
* `status` (Pending, Cleared, Failed, Cancelled)
* `is_locked` (Boolean flag buat mekanisme 3 hari immutable lo)
* `notes` (Catatan bebas dari user)
* `created_at`, `updated_at`

---

* **`transaction_splits`** (Kalau satu struk belanja punya banyak kategori berbeda, misal Alfamart: makanan + pulsa)
* `split_id` (PK), `transaction_id` (FK)
* `category_id` (FK), `amount`, `notes`

---

* **`transaction_attachments`** (Bukti foto struk / nota / file PDF)
* `attachment_id` (PK), `transaction_id` (FK)
* `file_url` (Path ke Cloudflare R2), `file_type`, `file_size`

---

### 5. KELOMPOK: Otomasi & Fitur Pendukung (Automation & Utilities)

* **`budgets`** (Manajemen anggaran bulanan user)
* `budget_id` (PK), `user_id` (FK), `category_id` (FK)
* `amount_limit`, `period_start`, `period_end`
* `alert_threshold_percentage` (Notifikasi kalau sudah terpakai 80%)

---

* **`recurring_transactions`** (Transaksi berulang otomatis, misal langganan Netflix bulanan)
* `recurring_id` (PK), `user_id` (FK), `source_account_id` (FK)
* `amount`, `category_id`, `frequency` (Daily, Weekly, Monthly, Yearly)
* `next_run_date`, `status` (Active, Paused, Completed)

---

* **`audit_logs`** (Catatan sistem siapa yang akses/edit apa demi keamanan enterprise)
* `log_id` (PK), `user_id` (FK)
* `action_type` (INSERT, UPDATE, DELETE, LOGIN)
* `table_affected`, `record_id`, `old_values` (JSON), `new_values` (JSON)
* `ip_address`, `timestamp`

---

* **`notifications`** (Pusat notifikasi in-app / email)
* `notification_id` (PK), `user_id` (FK)
* `title`, `message`, `is_read`, `created_at`



---

di halaman aplikasi terdapat sebuah tombol yang mengantarkan user ke halaman daftar transaksi/event yang akan dimasukkan ke dalam database immutable. Hanya transaksi/event dengan umur lebih dari 3 hari yang diinsert ke database immutable. Selama data tersebut belum berumur lebih dari 3 hari, maka user bisa mengedit, menghapus atau mengubah data tersebut. Jika lebih dari 3 hari maka user harus membuat code RSN dan RVS. di halaman ini juga terdapat fitur search, di mana user bisa mencari data mana yang dia ingin ubah. User cukup mengetik deskripsi, nominal, atau apapun yang berhubungan dengan data yang user maksud.