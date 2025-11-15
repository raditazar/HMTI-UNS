# Panduan Setup Database & Storage untuk Struktur Organisasi

## 1. Membuat Table di Supabase

Buka Supabase Dashboard → SQL Editor → New Query, lalu jalankan SQL berikut:

```sql
-- Tabel untuk Bidang (seperti Menko)
CREATE TABLE bidang (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  urutan INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk Divisi (seperti Kementerian)
CREATE TABLE divisi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bidang_id UUID REFERENCES bidang(id) ON DELETE CASCADE,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  urutan INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk Anggota
CREATE TABLE anggota (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  angkatan INT NOT NULL,
  divisi_id UUID REFERENCES divisi(id) ON DELETE SET NULL,
  foto_url TEXT,
  email VARCHAR(100),
  telepon VARCHAR(20),
  bio TEXT,
  urutan INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_divisi_bidang ON divisi(bidang_id);
CREATE INDEX idx_anggota_divisi ON anggota(divisi_id);
CREATE INDEX idx_bidang_urutan ON bidang(urutan);
CREATE INDEX idx_divisi_urutan ON divisi(urutan);
CREATE INDEX idx_anggota_urutan ON anggota(urutan);

-- Enable Row Level Security (RLS)
ALTER TABLE bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggota ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca data (public read)
CREATE POLICY "Enable read access for all users" ON bidang
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON divisi
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON anggota
  FOR SELECT USING (true);

-- Policy untuk insert/update/delete (hanya authenticated users)
-- Nanti bisa disesuaikan dengan kebutuhan admin
CREATE POLICY "Enable insert for authenticated users only" ON bidang
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON divisi
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON anggota
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 2. Insert Data Dummy (Opsional untuk Testing)

```sql
-- Insert Bidang
INSERT INTO bidang (nama, deskripsi, urutan) VALUES
  ('Bidang Kesekjenan', 'Bidang yang mengurusi kesekretariatan dan koordinasi umum', 1),
  ('Bidang Internal', 'Bidang yang mengurusi hubungan internal organisasi', 2),
  ('Bidang Eksternal', 'Bidang yang mengurusi hubungan eksternal dan kerjasama', 3),
  ('Bidang Pengembangan', 'Bidang yang mengurusi pengembangan SDM dan organisasi', 4);

-- Insert Divisi (gunakan ID bidang yang sesuai)
INSERT INTO divisi (bidang_id, nama, deskripsi, urutan) VALUES
  ((SELECT id FROM bidang WHERE nama = 'Bidang Kesekjenan'), 'Sekretaris', 'Divisi kesekretariatan', 1),
  ((SELECT id FROM bidang WHERE nama = 'Bidang Kesekjenan'), 'Bendahara', 'Divisi keuangan', 2),
  ((SELECT id FROM bidang WHERE nama = 'Bidang Internal'), 'Pengabdian Masyarakat', 'Divisi pengabdian masyarakat', 1),
  ((SELECT id FROM bidang WHERE nama = 'Bidang Eksternal'), 'Humas', 'Divisi hubungan masyarakat', 1),
  ((SELECT id FROM bidang WHERE nama = 'Bidang Pengembangan'), 'Riset & Teknologi', 'Divisi riset dan pengembangan teknologi', 1);

-- Insert Anggota Dummy (Pengurus Inti - tanpa divisi)
INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan) VALUES
  ('Ahmad Faisal', 'Ketua Umum', 2022, NULL, 'ahmad@hmti.uns.ac.id', 1),
  ('Siti Nur Aisyah', 'Wakil Ketua', 2022, NULL, 'siti@hmti.uns.ac.id', 2);

-- Insert Anggota dengan Divisi (harus terpisah karena subquery)
INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan)
SELECT 'Budi Santoso', 'Sekretaris 1', 2023, id, 'budi@hmti.uns.ac.id', 3
FROM divisi WHERE nama = 'Sekretaris' LIMIT 1;

INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan)
SELECT 'Dewi Lestari', 'Bendahara 1', 2023, id, 'dewi@hmti.uns.ac.id', 4
FROM divisi WHERE nama = 'Bendahara' LIMIT 1;

INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, email, urutan)
SELECT 'Rudi Hermawan', 'Kepala Divisi Humas', 2022, id, 'rudi@hmti.uns.ac.id', 5
FROM divisi WHERE nama = 'Humas' LIMIT 1;
```

## 3. Setup Storage Bucket

1. Buka Supabase Dashboard → Storage
2. Klik "New bucket"
3. Masukkan detail berikut:
   - Name: `profile-photos`
   - Public bucket: ✓ (centang, agar foto bisa diakses public)
   - File size limit: 500 KB
   - Allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp`
4. Klik "Create bucket"

## 4. Setup Storage Policy ⚠️ PENTING!

**WAJIB DIJALANKAN** agar bisa upload foto!

Buka SQL Editor dan jalankan:

```sql
-- Hapus policy lama jika ada (opsional, untuk mencegah duplikat)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON storage.objects;

-- Policy 1: Public Read (Semua orang bisa lihat foto)
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Policy 2: Authenticated Upload (User login bisa upload)
CREATE POLICY "Authenticated users can upload profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Policy 3: Authenticated Update (User login bisa update)
CREATE POLICY "Authenticated users can update profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos');

-- Policy 4: Authenticated Delete (User login bisa delete)
CREATE POLICY "Authenticated users can delete profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos');
```

**Verifikasi:** Setelah jalankan SQL, cek Storage → profile-photos → Policies tab. Harus ada 4 policies!

## 5. Verifikasi Setup

Setelah semua setup:
1. Cek di Table Editor apakah 3 tabel sudah ada: `bidang`, `divisi`, `anggota`
2. Cek di Storage apakah bucket `profile-photos` sudah ada
3. Coba akses API endpoint yang akan dibuat

## 6. Supabase Project URL

Berdasarkan API key yang diberikan, project URL adalah:
```
https://xiwcvwgvkpqvtncxqxrv.supabase.co
```

Selesai! Database dan storage sudah siap digunakan.
