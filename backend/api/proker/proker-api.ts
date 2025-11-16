import { supabase, Proker } from "../../config/supabase";

// ========== READ ==========

export async function getAllProker() {
  try {
    const { data, error } = await supabase
      .from("proker_divisi") // ✅ FIX
      .select(
        `
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `
      )
      .order("urutan", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProkerByDivisi(divisiId: string | null) {
  try {
    const query = supabase
      .from("proker_divisi") // ✅ FIX
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `);

    if (divisiId === null || divisiId === 'null') {
      query.is('divisi_id', null);
    } else {
      query.eq('divisi_id', divisiId);
    }

    const { data, error } = await query.order('urutan', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProkerByJabatan(jabatan: string) {
  try {
    const { data: allProker, error } = await supabase
      .from("proker_divisi") // ✅ FIX
      .select(
        `
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `
      )
      .is("divisi_id", null)
      .order("urutan", { ascending: true });

    if (error) throw error;

    const filtered = (allProker || []).filter((proker: any) => {
      if (!proker.penanggung_jawab) return false;
      const pjJabatan = proker.penanggung_jawab.jabatan?.toLowerCase() || "";
      const searchJabatan = jabatan.toLowerCase();
      return pjJabatan.includes(searchJabatan);
    });

    return { success: true, data: filtered as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProkerByPenanggungJawab(anggotaId: string) {
  try {
    const { data, error } = await supabase
      .from("proker_divisi") // ✅ FIX
      .select(
        `
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `
      )
      .eq("penanggung_jawab_id", anggotaId)
      .order("urutan", { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProkerById(id: string) {
  try {
    const { data, error } = await supabase
      .from("proker_divisi") // ✅ FIX
      .select(
        `
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: data as Proker };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ========== CREATE ==========

export async function createProker(data: {
  nama: string;
  deskripsi?: string;
  divisi_id?: string | null;
  penanggung_jawab_id?: string | null;
  foto_url?: string | null;
  urutan: number;
}) {
  try {
    const insertData = {
      nama: data.nama,
      deskripsi: data.deskripsi || null,
      divisi_id: data.divisi_id || null,
      penanggung_jawab_id: data.penanggung_jawab_id || null,
      foto_url: data.foto_url || null,
      urutan: data.urutan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newProker, error } = await supabase
      .from('proker_divisi') // ✅ FIX
      .insert([insertData])
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .single();

    if (error) throw error;

    return { success: true, data: newProker as Proker };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== UPDATE ==========

export async function updateProker(id: string, data: Partial<Proker>) {
  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from("proker_divisi") // ✅ FIX
      .update(updateData)
      .eq("id", id)
      .select(
        `
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `
      )
      .single();

    if (error) throw error;

    return { success: true, data: updated as Proker };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ========== DELETE ==========

export async function deleteProker(id: string) {
  try {
    const { data: proker } = await supabase
      .from('proker_divisi') // ✅ FIX
      .select('foto_url')
      .eq('id', id)
      .single();

    if (proker?.foto_url) {
      await supabase.storage
        .from('proker-photos')
        .remove([proker.foto_url]);
    }

    const { error } = await supabase
      .from('proker_divisi') // ✅ FIX
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== UPLOAD FOTO ==========

export async function uploadFotoProker(file: File, prokerId: string) {
  try {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Ukuran file maksimal 5MB');
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format file harus JPG, PNG, atau WEBP');
    }

    const { data: oldProker } = await supabase
      .from('proker_divisi') // ✅ FIX
      .select('foto_url')
      .eq('id', prokerId)
      .single();

    if (oldProker?.foto_url) {
      await supabase.storage
        .from('proker-photos')
        .remove([oldProker.foto_url]);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${prokerId}-${Date.now()}.${fileExt}`;
    const filePath = `proker/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('proker-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { error: updateError } = await supabase
      .from('proker_divisi') // ✅ FIX
      .update({ 
        foto_url: filePath,
        updated_at: new Date().toISOString() 
      })
      .eq('id', prokerId);

    if (updateError) throw updateError;

    return { success: true, filePath };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Gagal mengupload foto' 
    };
  }
}

export async function deleteFotoProker(prokerId: string) {
  try {
    const { data: proker } = await supabase
      .from('proker_divisi') // ✅ FIX
      .select('foto_url')
      .eq('id', prokerId)
      .single();

    if (proker?.foto_url) {
      const { error: deleteError } = await supabase.storage
        .from('proker-photos')
        .remove([proker.foto_url]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('proker_divisi') // ✅ FIX
        .update({ 
          foto_url: null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', prokerId);

      if (updateError) throw updateError;
    }

    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Gagal menghapus foto' 
    };
  }
}

export function getFotoProkerUrl(fotoPath: string | null): string | null {
  if (!fotoPath) return null;
  if (fotoPath.startsWith("http")) return fotoPath;

  const { data } = supabase.storage
    .from("proker-photos")
    .getPublicUrl(fotoPath);

  return data.publicUrl;
}

// ========== STATS ==========

export async function getProkerStats() {
  try {
    const { data, error } = await supabase
      .from("proker_divisi") // ✅ FIX
      .select("divisi_id, divisi(nama), penanggung_jawab:anggota!penanggung_jawab_id(jabatan)");

    if (error) throw error;

    const statsByDivisi: { [key: string]: number } = {};
    let pengurusIntiCount = 0;

    (data || []).forEach((item: any) => {
      if (item.divisi?.nama) {
        const divisiName = item.divisi.nama;
        statsByDivisi[divisiName] = (statsByDivisi[divisiName] || 0) + 1;
      } else {
        statsByDivisi['Pengurus Inti'] = (statsByDivisi['Pengurus Inti'] || 0) + 1;
        pengurusIntiCount++;
      }
    });

    return {
      success: true,
      data: {
        total: data.length,
        byDivisi: statsByDivisi,
        pengurusIntiCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}