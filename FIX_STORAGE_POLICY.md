# Fix Storage Policy untuk Upload Foto

## Masalah
Bucket `profile-photos` sudah dibuat tapi **policy masih 0**, jadi tidak bisa upload foto.

## Solusi: Buat Storage Policies

Buka Supabase Dashboard → SQL Editor, lalu jalankan SQL berikut:

### Opsi 1: Policy Paling Sederhana (Recommended untuk Development)

```sql
-- Hapus semua policy lama (jika ada)
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

### Opsi 2: Policy dengan Owner Check (Lebih Aman untuk Production)

```sql
-- Policy 1: Public Read
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Policy 2: Authenticated Upload dengan owner
CREATE POLICY "Authenticated users can upload their photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: User hanya bisa update foto mereka sendiri
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: User hanya bisa delete foto mereka sendiri
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Opsi 3: Policy Paling Permissive (Untuk Testing/Demo)

```sql
-- Hapus semua policy
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations" ON storage.objects;

-- Satu policy untuk semua operasi (HANYA UNTUK TESTING!)
CREATE POLICY "Allow all operations on profile photos"
ON storage.objects
TO public
USING (bucket_id = 'profile-photos')
WITH CHECK (bucket_id = 'profile-photos');
```

## Rekomendasi

**Untuk sekarang (development/testing):**
→ Gunakan **Opsi 1** atau **Opsi 3**

**Untuk production nanti:**
→ Gunakan **Opsi 2** (lebih aman)

## Verifikasi Policy Berhasil

Setelah menjalankan SQL:

1. **Via Supabase Dashboard:**
   - Buka Storage → profile-photos
   - Klik tab "Policies"
   - Harus ada 1-4 policies tergantung opsi yang dipilih

2. **Test Upload:**
   - Login ke `/admin/anggota`
   - Coba upload foto
   - Jika berhasil → ✅ Policy sudah benar!

## Troubleshooting

### Error: "new row violates row-level security policy"
→ Policy belum dibuat atau salah config
→ Coba jalankan **Opsi 3** dulu untuk testing

### Error: "permission denied for table objects"
→ Gunakan `TO public` atau `TO authenticated` dengan benar

### Foto bisa diupload tapi tidak bisa dilihat
→ Policy SELECT belum ada
→ Pastikan ada policy `FOR SELECT TO public`

### Foto tidak bisa dihapus
→ Policy DELETE belum ada atau terlalu ketat
→ Gunakan Opsi 1 untuk testing

## Quick Test

Setelah setup policy, test dengan:

```sql
-- Cek policy yang aktif
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage';
```

Harus muncul minimal 1-4 policies untuk bucket profile-photos.

## Alternative: Setup via Supabase Dashboard

Jika tidak mau pakai SQL, bisa via UI:

1. Storage → profile-photos → Policies tab
2. Klik "New Policy"
3. Pilih template: "Allow public read access"
4. Klik "Review"
5. Klik "Save Policy"
6. Ulangi untuk INSERT, UPDATE, DELETE

Tapi **SQL lebih cepat dan akurat**!

---

**Pilih Opsi 1, jalankan SQL-nya, dan upload foto akan langsung bisa!** ✅
