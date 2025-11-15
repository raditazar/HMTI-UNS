# Fix RLS Update Policy untuk Anggota Table

## Masalah
Upload foto berhasil ke storage bucket, tapi kolom `foto_url` di table `anggota` tidak terupdate.

**Root Cause:** RLS policies pada table `anggota` hanya ada untuk SELECT dan INSERT. **Tidak ada policy untuk UPDATE dan DELETE**, jadi authenticated user tidak bisa update data anggota.

## Solusi: Tambahkan UPDATE & DELETE Policies

Buka Supabase Dashboard → SQL Editor, lalu jalankan SQL berikut:

```sql
-- Policy UPDATE untuk authenticated users (semua table)
CREATE POLICY "Enable update for authenticated users only" ON bidang
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON divisi
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON anggota
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy DELETE untuk authenticated users (semua table)
CREATE POLICY "Enable delete for authenticated users only" ON bidang
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON divisi
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON anggota
  FOR DELETE USING (auth.role() = 'authenticated');
```

## Penjelasan

Sebelum fix ini:
- ✅ SELECT: Public bisa baca (untuk tampilan web)
- ✅ INSERT: Authenticated user bisa tambah data
- ❌ UPDATE: **TIDAK ADA POLICY** → Gagal update!
- ❌ DELETE: **TIDAK ADA POLICY** → Gagal delete!

Setelah fix ini:
- ✅ SELECT: Public bisa baca
- ✅ INSERT: Authenticated user bisa tambah
- ✅ UPDATE: **Authenticated user bisa update** → Upload foto jadi berhasil!
- ✅ DELETE: **Authenticated user bisa delete**

## Verifikasi Policy Berhasil

1. **Via Supabase Dashboard:**
   - Buka Table Editor → anggota → Policies tab
   - Harus ada **6 policies total** (SELECT, INSERT, UPDATE, DELETE + 2 lainnya dari bidang/divisi)

2. **Via SQL Editor:**
   ```sql
   SELECT tablename, policyname, cmd
   FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename IN ('bidang', 'divisi', 'anggota')
   ORDER BY tablename, cmd;
   ```

   Harus muncul:
   - bidang: SELECT, INSERT, UPDATE, DELETE
   - divisi: SELECT, INSERT, UPDATE, DELETE
   - anggota: SELECT, INSERT, UPDATE, DELETE

3. **Test Upload Foto:**
   - Login ke `/admin/anggota`
   - Upload foto pada anggota
   - Cek di Table Editor → anggota
   - Kolom `foto_url` harus terisi dengan nama file (contoh: `abc123-1234567890.jpg`)

## Troubleshooting

### Foto masih tidak terupdate setelah jalankan SQL
1. Cek apakah policy sudah benar-benar dibuat:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'anggota';
   ```
2. Pastikan user sudah login (authenticated)
3. Coba logout dan login lagi
4. Clear browser cache

### Error: "policy already exists"
Policy sudah dibuat sebelumnya, skip saja error ini atau hapus dulu:
```sql
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON anggota;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON anggota;
```
Lalu jalankan lagi CREATE POLICY di atas.

---

**Setelah jalankan SQL ini, upload foto akan langsung bisa update foto_url!** ✅
