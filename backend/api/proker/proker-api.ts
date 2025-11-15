import { supabase, Proker } from '../../config/supabase';

// ========== READ ==========

/**
 * Get all proker dengan relasi divisi dan penanggung jawab
 */
export async function getAllProker() {
  try {
    const { data, error } = await supabase
      .from('proker')
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .order('urutan', { ascending: true })
      .order('tanggal_mulai', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get proker by divisi
 */
export async function getProkerByDivisi(divisiId: string) {
  try {
    const { data, error } = await supabase
      .from('proker')
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .eq('divisi_id', divisiId)
      .order('urutan', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get proker by status
 */
export async function getProkerByStatus(status: Proker['status']) {
  try {
    const { data, error } = await supabase
      .from('proker')
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .eq('status', status)
      .order('urutan', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get proker by penanggung jawab
 */
export async function getProkerByPenanggungJawab(anggotaId: string) {
  try {
    const { data, error } = await supabase
      .from('proker')
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .eq('penanggung_jawab_id', anggotaId)
      .order('status', { ascending: true })
      .order('tanggal_mulai', { ascending: true });

    if (error) throw error;

    return { success: true, data: data as Proker[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get proker by ID
 */
export async function getProkerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('proker')
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data: data as Proker };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== CREATE ==========

export async function createProker(data: {
  nama: string;
  deskripsi?: string;
  divisi_id: string;
  penanggung_jawab_id?: string | null;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  status?: Proker['status'];
  urutan: number;
}) {
  try {
    const { data: newProker, error } = await supabase
      .from('proker')
      .insert([{
        ...data,
        penanggung_jawab_id: data.penanggung_jawab_id || null,
      }])
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
    const { data: updated, error } = await supabase
      .from('proker')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        divisi(*, bidang(*)),
        penanggung_jawab:anggota!penanggung_jawab_id(*)
      `)
      .single();

    if (error) throw error;

    return { success: true, data: updated as Proker };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== DELETE ==========

export async function deleteProker(id: string) {
  try {
    const { error } = await supabase.from('proker').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========== STATS ==========

/**
 * Get statistik proker
 */
export async function getProkerStats() {
  try {
    const { data, error } = await supabase.from('proker').select('status');

    if (error) throw error;

    const stats = {
      total: data.length,
      planned: data.filter((p) => p.status === 'planned').length,
      ongoing: data.filter((p) => p.status === 'ongoing').length,
      completed: data.filter((p) => p.status === 'completed').length,
      cancelled: data.filter((p) => p.status === 'cancelled').length,
    };

    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
