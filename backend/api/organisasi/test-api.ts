/**
 * Script untuk testing API Organisasi
 * Jalankan dengan: npx ts-node backend/api/organisasi/test-api.ts
 */

import {
  getStrukturOrganisasi,
  getAllAnggota,
  getAnggotaByDivisi,
  getFotoUrl
} from './get-struktur';

async function testAPI() {
  console.log('🧪 Testing Organisasi API...\n');

  // Test 1: Get Struktur Organisasi
  console.log('1️⃣ Testing getStrukturOrganisasi()...');
  const strukturResult = await getStrukturOrganisasi();

  if (strukturResult.success) {
    console.log('✅ Success!');
    console.log(`   Found ${strukturResult.data?.length || 0} bidang`);

    strukturResult.data?.forEach((str, idx) => {
      console.log(`\n   Bidang ${idx + 1}: ${str.bidang.nama}`);
      console.log(`   Divisi count: ${str.divisi.length}`);

      str.divisi.forEach((div) => {
        console.log(`     - ${div.nama}: ${div.anggota.length} anggota`);
      });
    });
  } else {
    console.log('❌ Error:', strukturResult.error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 2: Get All Anggota
  console.log('2️⃣ Testing getAllAnggota()...');
  const anggotaResult = await getAllAnggota();

  if (anggotaResult.success) {
    console.log('✅ Success!');
    console.log(`   Found ${anggotaResult.data?.length || 0} anggota`);

    // Group by divisi
    const pengurusInti = anggotaResult.data?.filter(a => a.divisi_id === null) || [];
    const denganDivisi = anggotaResult.data?.filter(a => a.divisi_id !== null) || [];

    console.log(`   - Pengurus Inti: ${pengurusInti.length}`);
    pengurusInti.forEach(a => {
      console.log(`     * ${a.nama} - ${a.jabatan} (${a.angkatan})`);
    });

    console.log(`   - Anggota dengan Divisi: ${denganDivisi.length}`);
  } else {
    console.log('❌ Error:', anggotaResult.error);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Test 3: Test getFotoUrl helper
  console.log('3️⃣ Testing getFotoUrl() helper...');
  const testPaths = [
    'member-1.jpg',
    'https://example.com/photo.jpg',
    null
  ];

  testPaths.forEach(path => {
    const url = getFotoUrl(path);
    console.log(`   Input: ${path}`);
    console.log(`   Output: ${url}`);
    console.log('');
  });

  console.log('='.repeat(60) + '\n');
  console.log('✨ Testing completed!\n');
}

// Run the test
testAPI().catch(console.error);
