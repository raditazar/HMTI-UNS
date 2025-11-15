# Dokumentasi Fitur Struktur Organisasi

## Struktur Folder

```
HMTI-UNS/
├── backend/
│   ├── config/
│   │   └── supabase.ts          # Konfigurasi Supabase dan type definitions
│   └── api/
│       └── organisasi/
│           └── get-struktur.ts  # API functions untuk fetch data
│
├── app/
│   └── organisasi/
│       └── page.tsx             # Halaman utama struktur organisasi
│
└── components/
    └── organisasi/
        ├── anggota-card.tsx           # Komponen card untuk anggota
        ├── divisi-section.tsx         # Komponen section divisi
        ├── bidang-section.tsx         # Komponen section bidang
        └── pengurus-inti-section.tsx  # Komponen section pengurus inti
```

## Setup Database & Storage

### 1. Setup Database Tables

Ikuti langkah-langkah di file `SETUP_DATABASE.md`:

1. Buka Supabase Dashboard → SQL Editor
2. Copy dan jalankan query untuk membuat 3 tabel:
   - `bidang` - untuk level tertinggi (seperti Menko)
   - `divisi` - untuk level menengah (seperti Kementerian)
   - `anggota` - untuk data anggota organisasi
3. Jalankan query untuk membuat RLS policies
4. (Opsional) Insert data dummy untuk testing

### 2. Setup Storage Bucket

1. Buka Supabase Dashboard → Storage
2. Buat bucket baru dengan nama: `profile-photos`
3. Set sebagai public bucket
4. Set file size limit: 500 KB
5. Set allowed MIME types: `image/jpeg,image/png,image/jpg,image/webp`
6. Jalankan SQL policy untuk storage (ada di SETUP_DATABASE.md)

## Cara Upload Foto Profil

### Via Supabase Dashboard

1. Buka Storage → profile-photos
2. Click "Upload file"
3. Pilih foto (maksimal 500 KB)
4. Setelah upload, copy path file (contoh: `member-1.jpg`)
5. Saat insert anggota, gunakan path tersebut di kolom `foto_url`

### Via Code (untuk fitur upload nanti)

```typescript
import { supabase } from '@/backend/config/supabase';

async function uploadFoto(file: File, anggotaId: string) {
  // Validasi ukuran
  if (file.size > 500 * 1024) {
    throw new Error('File size must be less than 500 KB');
  }

  // Upload ke storage
  const fileName = `${anggotaId}-${Date.now()}.${file.name.split('.').pop()}`;
  const { data, error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);

  if (error) throw error;

  return fileName; // Simpan ini di kolom foto_url
}
```

## Cara Mengakses Halaman

Setelah semua setup selesai:

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka browser dan akses:
   ```
   http://localhost:3000/organisasi
   ```

## Hierarki Data

```
Bidang (Level 1)
  └── Divisi (Level 2)
        └── Anggota (Level 3)

Pengurus Inti (Tanpa divisi)
  └── Anggota yang divisi_id = null
```

## Fitur-fitur

### 1. Pengurus Inti
- Menampilkan anggota dengan `divisi_id = null`
- Biasanya untuk Ketua, Wakil Ketua, dll
- Ditampilkan di bagian paling atas dengan badge khusus

### 2. Struktur per Bidang
- Dikelompokkan berdasarkan bidang
- Setiap bidang berisi divisi-divisi
- Setiap divisi berisi anggota-anggota

### 3. Card Anggota
Menampilkan:
- Foto profil (jika ada, jika tidak ada tampilkan icon)
- Nama
- Jabatan
- Angkatan (di badge)
- Divisi dan Bidang (jika ada)
- Bio (jika ada)
- Email (jika ada)
- Telepon (jika ada)

### 4. Responsive Design
- Mobile: 1 kolom
- Tablet: 2 kolom
- Desktop: 3-4 kolom

### 5. Loading & Error States
- Loading spinner saat fetch data
- Error message jika gagal
- Empty state jika belum ada data

## API Functions

### `getStrukturOrganisasi()`
Mengambil seluruh struktur organisasi lengkap dengan hierarki Bidang → Divisi → Anggota

**Returns:**
```typescript
{
  success: boolean;
  data?: StrukturOrganisasi[];
  error?: string;
}
```

### `getAllAnggota()`
Mengambil semua anggota termasuk yang tidak punya divisi

**Returns:**
```typescript
{
  success: boolean;
  data?: Anggota[];
  error?: string;
}
```

### `getAnggotaByDivisi(divisiId: string)`
Mengambil anggota berdasarkan divisi tertentu

### `getAnggotaById(anggotaId: string)`
Mengambil detail anggota berdasarkan ID

### `getFotoUrl(fotoPath: string | null)`
Helper function untuk mendapatkan URL lengkap foto profil

## Contoh Data Insert

```sql
-- Insert Bidang
INSERT INTO bidang (nama, deskripsi, urutan) VALUES
  ('Bidang Kesekjenan', 'Bidang kesekretariatan', 1);

-- Insert Divisi
INSERT INTO divisi (bidang_id, nama, deskripsi, urutan) VALUES
  ('uuid-bidang-kesekjenan', 'Sekretaris', 'Divisi kesekretariatan', 1);

-- Insert Anggota (Pengurus Inti)
INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, foto_url, email, urutan) VALUES
  ('Ahmad Faisal', 'Ketua Umum', 2022, NULL, 'ketua.jpg', 'ketua@hmti.uns.ac.id', 1);

-- Insert Anggota (Dengan Divisi)
INSERT INTO anggota (nama, jabatan, angkatan, divisi_id, foto_url, email, urutan) VALUES
  ('Budi Santoso', 'Sekretaris 1', 2023, 'uuid-divisi-sekretaris', 'budi.jpg', 'budi@hmti.uns.ac.id', 3);
```

## Tips Optimasi

1. **Foto Profil:**
   - Compress foto sebelum upload
   - Gunakan format WebP untuk ukuran lebih kecil
   - Maksimal 500 KB per foto

2. **Urutan Tampilan:**
   - Set kolom `urutan` untuk mengatur urutan tampilan
   - Semakin kecil angka, semakin di atas

3. **Performance:**
   - API sudah di-optimize dengan join minimal
   - Data di-cache di client side
   - Lazy loading untuk foto profil (otomatis oleh browser)

## Troubleshooting

### Foto tidak muncul
- Pastikan bucket `profile-photos` sudah dibuat dan set sebagai public
- Pastikan RLS policy storage sudah dijalankan
- Cek apakah path foto di database benar

### Data tidak muncul
- Pastikan RLS policy untuk table sudah dijalankan
- Cek network tab di browser console
- Cek apakah Supabase credentials sudah benar

### Error CORS
- Pastikan menggunakan Supabase URL yang benar
- Pastikan API key valid dan belum expired

## Next Steps (Fitur Tambahan yang bisa dibuat)

1. Admin dashboard untuk CRUD data
2. Filter dan search anggota
3. Export struktur ke PDF
4. Detail page per anggota
5. Statistik organisasi
6. Arsip kepengurusan periode lama
