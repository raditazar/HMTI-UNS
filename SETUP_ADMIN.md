# Panduan Setup Admin Panel

## 1. Membuat User Admin di Supabase

Untuk bisa login ke admin panel, Anda perlu membuat user admin terlebih dahulu.

### Cara 1: Via Supabase Dashboard (Paling Mudah)

1. Buka Supabase Dashboard → Authentication → Users
2. Klik "Add user" → "Create new user"
3. Isi form:
   - **Email**: `admin@hmti.uns.ac.id` (atau email lain)
   - **Password**: Buat password yang kuat (min 6 karakter)
   - **Auto Confirm User**: ✅ Centang
4. Klik "Create user"
5. User admin berhasil dibuat!

### Cara 2: Via SQL Editor

```sql
-- Buat user admin dengan email dan password
-- Ganti dengan email dan password yang Anda inginkan
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@hmti.uns.ac.id',  -- Email admin
  crypt('admin123', gen_salt('bf')),  -- Password: admin123 (GANTI INI!)
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**PENTING**: Ganti password 'admin123' dengan password yang lebih kuat!

## 2. Struktur Halaman Admin

Setelah login, Anda akan memiliki akses ke:

### Dashboard (`/admin`)
- Melihat statistik: total bidang, divisi, anggota
- Quick actions untuk manage data

### Kelola Anggota (`/admin/anggota`)
- **CRUD Lengkap**: Create, Read, Update, Delete
- **Upload Foto**: Upload foto profil langsung dari browser
- **Validasi Foto**:
  - Maksimal 500 KB
  - Format: JPG, PNG, WebP
- **Hapus Foto**: Hapus foto anggota
- **Form Lengkap**:
  - Nama
  - Jabatan
  - Angkatan
  - Divisi (pilih dari dropdown, kosongkan untuk Pengurus Inti)
  - Email
  - Telepon
  - Bio
  - Urutan tampilan

### Kelola Bidang (`/admin/bidang`) - Belum dibuat
- CRUD untuk bidang
- Urutan tampilan

### Kelola Divisi (`/admin/divisi`) - Belum dibuat
- CRUD untuk divisi
- Pilih bidang
- Urutan tampilan

## 3. Cara Login

1. Buka browser: `http://localhost:3000/login`
2. Masukkan email dan password admin yang sudah dibuat
3. Klik "Masuk"
4. Anda akan diarahkan ke `/admin`

## 4. Cara Menggunakan Admin Panel

### Menambah Anggota

1. Login ke admin panel
2. Klik menu "Anggota" di sidebar
3. Klik tombol "Tambah Anggota"
4. Isi form:
   - Nama: Ahmad Faisal
   - Jabatan: Ketua Umum
   - Angkatan: 2022
   - Divisi: (kosongkan untuk Pengurus Inti, atau pilih divisi)
   - Email: ahmad@hmti.uns.ac.id
   - Telepon: 08123456789
   - Bio: Deskripsi singkat
   - Urutan: 1 (semakin kecil, semakin di atas)
5. Klik "Simpan"
6. Anggota berhasil ditambahkan!

### Upload Foto Anggota

Setelah anggota dibuat:

1. Di card anggota, klik icon **Upload** (icon upload di pojok kanan atas foto)
2. Pilih file foto (max 500 KB)
3. Foto akan otomatis ter-upload dan langsung tampil
4. Foto tersimpan di Supabase Storage bucket `profile-photos`

### Edit Anggota

1. Di card anggota, klik tombol "Edit"
2. Ubah data yang ingin diubah
3. Klik "Simpan"

### Hapus Anggota

1. Di card anggota, klik tombol "Hapus"
2. Konfirmasi penghapusan
3. Anggota dan foto profilnya akan terhapus

### Hapus Foto

1. Di card anggota yang punya foto, klik icon **Trash** (icon tempat sampah di pojok kanan atas foto)
2. Konfirmasi penghapusan
3. Foto akan terhapus, tapi data anggota tetap ada

## 5. Perbedaan Tampilan User Biasa vs Admin

### User Biasa (Belum Login)
- Hanya bisa lihat halaman `/organisasi`
- Tidak ada tombol edit/delete
- Tidak bisa upload foto
- Tidak bisa akses `/admin`

### User Admin (Sudah Login)
- Bisa akses semua halaman admin
- Bisa CRUD semua data
- Bisa upload/delete foto
- Ada menu admin di navigation (future feature)

## 6. Logout

1. Klik tombol "Keluar" di pojok kanan atas admin panel
2. Anda akan diarahkan kembali ke halaman login
3. Session akan di-clear

## 7. Security & Best Practices

### Row Level Security (RLS) sudah aktif

**Public Access (Read-Only)**:
- Siapa saja bisa melihat data bidang, divisi, anggota
- Siapa saja bisa melihat foto di storage

**Authenticated Access (Write)**:
- Hanya user yang login bisa create/update/delete
- Hanya user yang login bisa upload/delete foto

### Tips Keamanan

1. **Gunakan password yang kuat** untuk admin
2. **Jangan share credentials** admin
3. **Backup data** secara berkala via Supabase Dashboard
4. **Monitor logs** di Supabase untuk aktivitas mencurigakan

## 8. Testing Admin Panel

### Test Login
```
Email: admin@hmti.uns.ac.id
Password: (password yang Anda buat)
```

### Test Upload Foto
1. Siapkan foto test (< 500 KB)
2. Upload via admin panel
3. Cek di halaman `/organisasi` apakah foto muncul
4. Cek di Supabase Storage → profile-photos

### Test CRUD Anggota
1. Tambah anggota dummy
2. Edit data anggota
3. Upload foto
4. Hapus foto
5. Hapus anggota

## 9. Troubleshooting

### Tidak bisa login
- Cek apakah user sudah dibuat di Supabase Auth
- Cek email dan password benar
- Cek browser console untuk error

### Upload foto gagal
- Cek ukuran file < 500 KB
- Cek format file: JPG, PNG, WebP
- Cek Storage bucket `profile-photos` sudah dibuat
- Cek RLS policy storage sudah dijalankan

### Foto tidak muncul di halaman publik
- Cek bucket `profile-photos` adalah public bucket
- Cek RLS policy `Public Access` sudah ada
- Hard refresh browser (Ctrl+F5)

### Error 403 saat CRUD
- Cek RLS policy untuk insert/update/delete sudah dibuat
- Cek user sudah login
- Cek session masih valid

## 10. File-file Admin yang Sudah Dibuat

```
app/
├── login/
│   └── page.tsx                    # Halaman login
├── admin/
│   ├── page.tsx                    # Dashboard admin
│   └── anggota/
│       └── page.tsx                # CRUD Anggota + Upload Foto

components/
└── admin/
    └── admin-layout.tsx            # Layout admin dengan sidebar

lib/
└── auth/
    └── auth-context.tsx            # Auth context & hooks

hooks/
└── use-protected-route.tsx         # Protected route hook

backend/
└── api/
    └── organisasi/
        └── admin-crud.ts           # API CRUD functions
```

## 11. Next Steps

Setelah setup admin selesai, Anda bisa:

1. ✅ Login sebagai admin
2. ✅ Tambah/edit/hapus anggota
3. ✅ Upload foto profil anggota
4. 📝 Buat halaman admin untuk Bidang (optional)
5. 📝 Buat halaman admin untuk Divisi (optional)
6. 📝 Tambah fitur search & filter di admin
7. 📝 Tambah fitur export data ke Excel/PDF
8. 📝 Tambah role-based access (Super Admin vs Admin Biasa)

## 12. Demo Credentials

Untuk testing, buat user dengan:
- Email: `admin@hmti.uns.ac.id`
- Password: `admin123` (atau password kuat lainnya)

**Jangan lupa ganti password setelah testing!**

---

Selamat menggunakan Admin Panel! 🎉
