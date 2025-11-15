# Setup Program Kerja (Proker)

## 1. SQL Schema untuk Tabel Proker

Buka Supabase Dashboard → SQL Editor, lalu jalankan query berikut:

```sql
-- Tabel untuk Program Kerja
CREATE TABLE proker (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  divisi_id UUID REFERENCES divisi(id) ON DELETE CASCADE,
  penanggung_jawab_id UUID REFERENCES anggota(id) ON DELETE SET NULL,
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  status VARCHAR(50) DEFAULT 'planned',
  urutan INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX idx_proker_divisi ON proker(divisi_id);
CREATE INDEX idx_proker_penanggung_jawab ON proker(penanggung_jawab_id);
CREATE INDEX idx_proker_status ON proker(status);
CREATE INDEX idx_proker_urutan ON proker(urutan);

-- Enable Row Level Security (RLS)
ALTER TABLE proker ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca data (public read)
CREATE POLICY "Enable read access for all users" ON proker
  FOR SELECT USING (true);

-- Policy untuk insert/update/delete (authenticated users only)
CREATE POLICY "Enable insert for authenticated users only" ON proker
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON proker
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON proker
  FOR DELETE USING (auth.role() = 'authenticated');

-- Trigger untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_proker_updated_at
  BEFORE UPDATE ON proker
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 2. Insert Data Dummy Proker (Opsional)

```sql
-- Pastikan sudah ada divisi dan anggota terlebih dahulu

-- Insert Proker 1
INSERT INTO proker (
  nama,
  deskripsi,
  divisi_id,
  penanggung_jawab_id,
  tanggal_mulai,
  tanggal_selesai,
  status,
  urutan
)
SELECT
  'Open Recruitment Anggota Baru',
  'Program rekrutmen untuk menjaring anggota baru periode 2024/2025',
  div.id,
  ang.id,
  '2024-08-01',
  '2024-08-31',
  'ongoing',
  1
FROM divisi div
CROSS JOIN anggota ang
WHERE div.nama = 'Humas'
  AND ang.nama = 'Rudi Hermawan'
LIMIT 1;

-- Insert Proker 2
INSERT INTO proker (
  nama,
  deskripsi,
  divisi_id,
  penanggung_jawab_id,
  tanggal_mulai,
  tanggal_selesai,
  status,
  urutan
)
SELECT
  'Seminar Teknologi Industri 4.0',
  'Seminar nasional tentang perkembangan teknologi di era industri 4.0',
  div.id,
  ang.id,
  '2024-09-15',
  '2024-09-15',
  'planned',
  2
FROM divisi div
CROSS JOIN anggota ang
WHERE div.nama = 'Humas'
  AND ang.jabatan LIKE '%Humas%'
LIMIT 1;

-- Insert Proker 3
INSERT INTO proker (
  nama,
  deskripsi,
  divisi_id,
  penanggung_jawab_id,
  tanggal_mulai,
  tanggal_selesai,
  status,
  urutan
)
SELECT
  'Bakti Sosial Ramadhan',
  'Program bakti sosial kepada masyarakat sekitar kampus di bulan Ramadhan',
  div.id,
  ang.id,
  '2025-03-01',
  '2025-03-15',
  'planned',
  3
FROM divisi div
CROSS JOIN anggota ang
WHERE div.nama = 'Pengabdian Masyarakat'
  AND ang.divisi_id = div.id
LIMIT 1;

-- Insert Proker 4 (tanpa penanggung jawab)
INSERT INTO proker (
  nama,
  deskripsi,
  divisi_id,
  tanggal_mulai,
  tanggal_selesai,
  status,
  urutan
)
SELECT
  'Pelatihan Microsoft Excel untuk Anggota',
  'Pelatihan internal untuk meningkatkan skill Microsoft Excel anggota',
  id,
  '2024-10-01',
  '2024-10-03',
  'planned',
  4
FROM divisi
WHERE nama = 'Riset & Teknologi'
LIMIT 1;
```

## 3. Penjelasan Kolom

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | UUID | Primary key (auto-generated) |
| `nama` | VARCHAR(200) | Nama program kerja |
| `deskripsi` | TEXT | Deskripsi lengkap proker |
| `divisi_id` | UUID | Foreign key ke tabel divisi |
| `penanggung_jawab_id` | UUID | Foreign key ke tabel anggota (nullable) |
| `tanggal_mulai` | DATE | Tanggal mulai proker (nullable) |
| `tanggal_selesai` | DATE | Tanggal selesai proker (nullable) |
| `status` | VARCHAR(50) | Status: 'planned', 'ongoing', 'completed', 'cancelled' |
| `urutan` | INT | Urutan tampilan (default 0) |
| `created_at` | TIMESTAMP | Waktu dibuat (auto) |
| `updated_at` | TIMESTAMP | Waktu diupdate (auto) |

## 4. Status Proker

- `planned` - Direncanakan (belum dimulai)
- `ongoing` - Sedang berjalan
- `completed` - Selesai
- `cancelled` - Dibatalkan

## 5. Relasi Database

```
proker
  ├── divisi_id → divisi.id (many-to-one)
  │     └── Satu divisi bisa punya banyak proker
  │
  └── penanggung_jawab_id → anggota.id (many-to-one, nullable)
        └── Satu anggota bisa jadi PJ banyak proker
        └── Boleh kosong (proker belum ada PJ)
```

## 6. Cascade Behavior

- **DELETE Divisi** → Proker di divisi tersebut TERHAPUS (CASCADE)
- **DELETE Anggota PJ** → Field penanggung_jawab_id jadi NULL (SET NULL)

## 7. Query Contoh

### Get semua proker dengan relasi lengkap
```sql
SELECT
  p.*,
  d.nama as divisi_nama,
  d.bidang_id,
  a.nama as penanggung_jawab_nama,
  a.jabatan as penanggung_jawab_jabatan
FROM proker p
LEFT JOIN divisi d ON p.divisi_id = d.id
LEFT JOIN anggota a ON p.penanggung_jawab_id = a.id
ORDER BY p.urutan ASC, p.tanggal_mulai ASC;
```

### Get proker per divisi
```sql
SELECT p.*
FROM proker p
WHERE p.divisi_id = 'uuid-divisi-here'
ORDER BY p.urutan ASC;
```

### Get proker yang ditangani anggota tertentu
```sql
SELECT p.*, d.nama as divisi_nama
FROM proker p
LEFT JOIN divisi d ON p.divisi_id = d.id
WHERE p.penanggung_jawab_id = 'uuid-anggota-here'
ORDER BY p.status, p.tanggal_mulai;
```

### Get proker by status
```sql
SELECT p.*, d.nama as divisi_nama
FROM proker p
LEFT JOIN divisi d ON p.divisi_id = d.id
WHERE p.status = 'ongoing'
ORDER BY p.tanggal_mulai;
```

## 8. Verifikasi

Setelah menjalankan SQL:
1. Cek di Table Editor → Tabel `proker` sudah ada
2. Cek kolom-kolom sudah sesuai
3. Cek RLS policies sudah aktif
4. Cek index sudah dibuat
5. Test insert data dummy

---

Database untuk fitur Proker sudah siap! 🎉
