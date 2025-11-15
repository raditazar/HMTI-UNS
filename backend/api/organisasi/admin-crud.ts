import { supabase } from '../../config/supabase';
import { Bidang, Divisi, Anggota } from '../../config/supabase';

// ========== BIDANG CRUD ==========

export async function createBidang(data: {
  nama: string;
  deskripsi?: string;
  urutan: number;
}) {
  try {
    const { data: newBidang, error } = await supabase
      .from('bidang')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: newBidang };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateBidang(id: string, data: Partial<Bidang>) {
  try {
    const { data: updated, error } = await supabase
      .from('bidang')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteBidang(id: string) {
  try {
    const { error } = await supabase.from('bidang').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== DIVISI CRUD ==========

export async function createDivisi(data: {
  bidang_id: string;
  nama: string;
  deskripsi?: string;
  urutan: number;
}) {
  try {
    const { data: newDivisi, error } = await supabase
      .from('divisi')
      .insert([data])
      .select('*, bidang(*)')
      .single();

    if (error) throw error;

    return { success: true, data: newDivisi };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateDivisi(id: string, data: Partial<Divisi>) {
  try {
    const { data: updated, error } = await supabase
      .from('divisi')
      .update(data)
      .eq('id', id)
      .select('*, bidang(*)')
      .single();

    if (error) throw error;

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteDivisi(id: string) {
  try {
    const { error } = await supabase.from('divisi').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== ANGGOTA CRUD ==========

export async function createAnggota(data: {
  nama: string;
  jabatan: string;
  angkatan: number;
  divisi_id?: string | null;
  email?: string;
  telepon?: string;
  bio?: string;
  urutan: number;
}) {
  try {
    const { data: newAnggota, error } = await supabase
      .from('anggota')
      .insert([data])
      .select('*, divisi(*, bidang(*))')
      .single();

    if (error) throw error;

    return { success: true, data: newAnggota };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function updateAnggota(id: string, data: Partial<Anggota>) {
  try {
    const { data: updated, error } = await supabase
      .from('anggota')
      .update(data)
      .eq('id', id)
      .select('*, divisi(*, bidang(*))')
      .single();

    if (error) throw error;

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteAnggota(id: string) {
  try {
    // Get anggota to check if has photo
    const { data: anggota } = await supabase
      .from('anggota')
      .select('foto_url')
      .eq('id', id)
      .single();

    // Delete photo from storage if exists
    if (anggota?.foto_url) {
      await supabase.storage.from('profile-photos').remove([anggota.foto_url]);
    }

    // Delete anggota record
    const { error } = await supabase.from('anggota').delete().eq('id', id);

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

export async function uploadFoto(file: File, anggotaId: string) {
  try {
    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      throw new Error('Ukuran file maksimal 500 KB');
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Format file harus JPG, PNG, atau WebP');
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${anggotaId}-${Date.now()}.${fileExt}`;

    // Get existing photo to delete
    const { data: existingAnggota } = await supabase
      .from('anggota')
      .select('foto_url')
      .eq('id', anggotaId)
      .single();

    // Delete old photo if exists
    if (existingAnggota?.foto_url) {
      await supabase.storage
        .from('profile-photos')
        .remove([existingAnggota.foto_url]);
    }

    // Upload new photo
    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Update anggota record with new photo path
    const { error: updateError } = await supabase
      .from('anggota')
      .update({ foto_url: fileName })
      .eq('id', anggotaId);

    if (updateError) throw updateError;

    return { success: true, data: { foto_url: fileName } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deleteFoto(anggotaId: string) {
  try {
    // Get existing photo
    const { data: anggota } = await supabase
      .from('anggota')
      .select('foto_url')
      .eq('id', anggotaId)
      .single();

    if (!anggota?.foto_url) {
      throw new Error('Tidak ada foto untuk dihapus');
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('profile-photos')
      .remove([anggota.foto_url]);

    if (storageError) throw storageError;

    // Update anggota record
    const { error: updateError } = await supabase
      .from('anggota')
      .update({ foto_url: null })
      .eq('id', anggotaId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
