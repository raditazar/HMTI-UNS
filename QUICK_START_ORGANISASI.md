# Quick Start - Fitur Struktur Organisasi

## Langkah-langkah Setup

### 1. Setup Database (5 menit)

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda (xiwcvwgvkpqvtncxqxrv)
3. Buka SQL Editor
4. Copy semua query dari file `SETUP_DATABASE.md` section "1. Membuat Table di Supabase"
5. Paste dan Execute
6. ✅ 3 tabel berhasil dibuat: `bidang`, `divisi`, `anggota`

### 2. Setup Storage Bucket (3 menit)

1. Di Supabase Dashboard, buka menu Storage
2. Klik "New bucket"
3. Isi:
   - Name: `profile-photos`
   - ✅ Public bucket (centang)
   - File size limit: 500 KB
   - Allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp`
4. Klik "Create bucket"
5. Kembali ke SQL Editor
6. Copy query dari `SETUP_DATABASE.md` section "4. Setup Storage Policy"
7. Execute query

### 3. Insert Data Dummy (Opsional - 5 menit)

Di SQL Editor, jalankan:

```sql
-- Insert Bidang
INSERT INTO bidang (nama, deskripsi, urutan) VALUES
  ('Bidang Kesekjenan', 'Koordinasi umum dan kesekretariatan', 1),
  ('Bidang Internal', 'Hubungan internal organisasi', 2),
  ('Bidang Eksternal', 'Hubungan eksternal dan kerjasama', 3);

-- Insert Divisi (ambil ID bidang dulu)
INSERT INTO divisi (bidang_id, nama, deskripsi, urutan)
SELECT id, 'Sekretaris', 'Divisi kesekretariatan', 1
FROM bidang WHERE nama = 'Bidang Kesekjenan';

INSERT INTO divisi (bidang_id, nama, deskripsi, urutan)
SELECT id, 'Bendahara', 'Divisi keuangan', 2
FROM bidang WHERE nama = 'Bidang Kesekjenan';

INSERT INTO divisi (bidang_id, nama, deskripsi, urutan)
SELECT id, 'Humas', 'Hubungan masyarakat', 1
FROM bidang WHERE nama = 'Bidang Eksternal';

-- Insert Pengurus Inti (tanpa divisi)
INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan) VALUES
  ('Ahmad Faisal Akmal', 'Ketua Umum', 2022, NULL, 'ketum@hmti.uns.ac.id', 1),
  ('Siti Nurhaliza', 'Wakil Ketua', 2022, NULL, 'waketum@hmti.uns.ac.id', 2);

-- Insert Anggota dengan Divisi
INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan)
SELECT 'Budi Santoso', 'Sekretaris 1', 2023, id, 'sekre1@hmti.uns.ac.id', 3
FROM divisi WHERE nama = 'Sekretaris' LIMIT 1;

INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan)
SELECT 'Dewi Lestari', 'Bendahara 1', 2023, id, 'bendahara1@hmti.uns.ac.id', 4
FROM divisi WHERE nama = 'Bendahara' LIMIT 1;

INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan)
SELECT 'Rudi Hermawan', 'Kepala Divisi Humas', 2022, id, 'humas@hmti.uns.ac.id', 5
FROM divisi WHERE nama = 'Humas' LIMIT 1;
```

### 4. Jalankan Development Server

```bash
cd /home/faisalakmal/Projects/webugok/HMTI-UNS
npm run dev
```

### 5. Buka di Browser

```
http://localhost:3000/organisasi
```

## Struktur Hierarki Data

```
PENGURUS INTI (divisi_id = null)
├── Ketua Umum
└── Wakil Ketua

BIDANG 1: Bidang Kesekjenan
├── DIVISI: Sekretaris
│   ├── Sekretaris 1
│   └── Sekretaris 2
└── DIVISI: Bendahara
    ├── Bendahara 1
    └── Bendahara 2

BIDANG 2: Bidang Eksternal
└── DIVISI: Humas
    ├── Kepala Divisi Humas
    ├── Anggota 1
    └── Anggota 2
```

## Cara Upload Foto Profil

### Method 1: Via Supabase Dashboard (Mudah)

1. Buka Storage → profile-photos
2. Upload foto (max 500 KB, format: jpg/png/webp)
3. Foto ter-upload dengan nama file (contoh: `ketua.jpg`)
4. Edit record di tabel `anggota`, set kolom `foto_url` = `ketua.jpg`
5. Refresh halaman organisasi

### Method 2: Via SQL (Jika sudah punya URL)

```sql
UPDATE anggota
SET foto_url = 'ketua.jpg'
WHERE nama = 'Ahmad Faisal Akmal';
```

## Tips Mengatur Urutan Tampilan

Kolom `urutan` mengatur urutan tampilan (ascending):

```sql
-- Ketua ditampilkan pertama
UPDATE anggota SET urutan = 1 WHERE jabatan = 'Ketua Umum';

-- Wakil Ketua kedua
UPDATE anggota SET urutan = 2 WHERE jabatan = 'Wakil Ketua';

-- Begitu seterusnya...
```

## Fitur-fitur Halaman

✅ Responsive design (mobile, tablet, desktop)
✅ Card dengan hover effect
✅ Loading state
✅ Error handling
✅ Empty state
✅ Automatic image loading
✅ Hierarki Bidang → Divisi → Anggota
✅ Badge angkatan
✅ Contact info (email, telepon)
✅ Bio anggota

## Files yang Dibuat

```
📁 backend/
  📁 config/
    📄 supabase.ts              # Konfigurasi + Type definitions
  📁 api/
    📁 organisasi/
      📄 get-struktur.ts        # API functions
      📄 test-api.ts            # Testing script (opsional)

📁 app/
  📁 organisasi/
    📄 page.tsx                 # Halaman utama

📁 components/
  📁 organisasi/
    📄 anggota-card.tsx         # Card component
    📄 divisi-section.tsx       # Divisi section
    📄 bidang-section.tsx       # Bidang section
    📄 pengurus-inti-section.tsx # Pengurus inti section

📁 docs/
  📄 SETUP_DATABASE.md          # Panduan lengkap SQL & Storage
  📄 ORGANISASI_README.md       # Dokumentasi lengkap
  📄 QUICK_START_ORGANISASI.md  # File ini
```

## Testing API (Opsional)

Jika ingin test API backend:

```bash
npx ts-node backend/api/organisasi/test-api.ts
```

## Troubleshooting

### ❌ Foto tidak muncul
- Cek apakah bucket `profile-photos` sudah public
- Cek RLS policy storage sudah dibuat
- Cek path foto di database benar

### ❌ Data tidak keluar
- Cek RLS policies table sudah dibuat (yang `FOR SELECT USING (true)`)
- Cek di Supabase Table Editor apakah data ada
- Cek browser console untuk error

### ❌ Build error
- Jalankan: `npm install @supabase/supabase-js`
- Restart development server

## Support

Jika ada masalah:
1. Cek file `ORGANISASI_README.md` untuk dokumentasi lengkap
2. Cek file `SETUP_DATABASE.md` untuk panduan database
3. Lihat browser console untuk error messages

## Next Steps

Setelah fitur berjalan, Anda bisa:
1. Tambah data anggota lengkap
2. Upload foto profil semua anggota
3. Buat fitur admin untuk CRUD (Create, Read, Update, Delete)
4. Tambah filter & search
5. Export ke PDF
6. Tambah arsip kepengurusan lama

---

**Selamat mencoba! 🚀**
