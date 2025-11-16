import { supabase, ProkerBidang } from '../../config/supabase';

// ========== READ ==========

export async function getAllProkerBidang() {
  try {
    const { data, error } = await supabase
      .from('proker_bidang')
      .select(`
        *,
        bidang(*),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .order('urutan', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as ProkerBidang[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getProkerBidangByBidang(bidangId: string) {
  try {
    const { data, error } = await supabase
      .from('proker_bidang')
      .select(`
        *,
        bidang(*),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .eq('bidang_id', bidangId)
      .order('urutan', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as ProkerBidang[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getProkerBidangById(id: string) {
  try {
    const { data, error } = await supabase
      .from('proker_bidang')
      .select(`
        *,
        bidang(*),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data: data as ProkerBidang };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== CREATE ==========

export async function createProkerBidang(data: {
  nama: string;
  deskripsi?: string;
  bidang_id: string;
  penanggung_jawab_id?: string | null;
  foto_url?: string | null;
  urutan: number;
}) {
  try {
    const insertData = {
      nama: data.nama,
      deskripsi: data.deskripsi || null,
      bidang_id: data.bidang_id,
      penanggung_jawab_id: data.penanggung_jawab_id || null,
      foto_url: data.foto_url || null,
      urutan: data.urutan,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newProker, error } = await supabase
      .from('proker_bidang')
      .insert([insertData])
      .select(`
        *,
        bidang(*),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .single();

    if (error) throw error;

    return { success: true, data: newProker as ProkerBidang };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== UPDATE ==========

export async function updateProkerBidang(id: string, data: Partial<ProkerBidang>) {
  try {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from('proker_bidang')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        bidang(*),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .single();

    if (error) throw error;

    return { success: true, data: updated as ProkerBidang };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== DELETE ==========

export async function deleteProkerBidang(id: string) {
  try {
    const { data: proker } = await supabase
      .from('proker_bidang')
      .select('foto_url')
      .eq('id', id)
      .single();

    if (proker?.foto_url) {
      await supabase.storage
        .from('proker-bidang-photos')
        .remove([proker.foto_url]);
    }

    const { error } = await supabase
      .from('proker_bidang')
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

export async function uploadFotoProkerBidang(file: File, prokerId: string) {
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
      .from('proker_bidang')
      .select('foto_url')
      .eq('id', prokerId)
      .single();

    if (oldProker?.foto_url) {
      await supabase.storage
        .from('proker-bidang-photos')
        .remove([oldProker.foto_url]);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${prokerId}-${Date.now()}.${fileExt}`;
    const filePath = `proker-bidang/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('proker-bidang-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { error: updateError } = await supabase
      .from('proker_bidang')
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

export function getFotoProkerBidangUrl(fotoPath: string | null): string | null {
  if (!fotoPath) return null;
  if (fotoPath.startsWith('http')) return fotoPath;
  
  const { data } = supabase.storage
    .from('proker-bidang-photos')
    .getPublicUrl(fotoPath);
  
  return data.publicUrl;
}

// ========== STATS ==========

export async function getProkerBidangStats() {
  try {
    const { data, error } = await supabase
      .from('proker_bidang')
      .select('bidang_id, bidang(nama)');

    if (error) throw error;

    const statsByBidang: { [key: string]: number } = {};
    
    (data || []).forEach((item: any) => {
      const bidangName = item.bidang?.nama || 'Unknown';
      statsByBidang[bidangName] = (statsByBidang[bidangName] || 0) + 1;
    });

    return { 
      success: true, 
      data: {
        total: data.length,
        byBidang: statsByBidang,
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}