import { supabase, StrukturOrganisasi, Bidang, Divisi, Anggota } from '../../config/supabase';

/**
 * Mengambil seluruh struktur organisasi lengkap
 * dengan hierarki: Bidang -> Divisi -> Anggota
 */
export async function getStrukturOrganisasi(): Promise<{
  success: boolean;
  data?: StrukturOrganisasi[];
  error?: string;
}> {
  try {
    // 1. Ambil semua bidang
    const { data: bidangList, error: bidangError } = await supabase
      .from('bidang')
      .select('*')
      .order('urutan', { ascending: true });

    if (bidangError) {
      throw new Error(`Error fetching bidang: ${bidangError.message}`);
    }

    if (!bidangList || bidangList.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    // 2. Ambil semua divisi dengan relasi bidang
    const { data: divisiList, error: divisiError } = await supabase
      .from('divisi')
      .select('*, bidang(*)')
      .order('urutan', { ascending: true });

    if (divisiError) {
      throw new Error(`Error fetching divisi: ${divisiError.message}`);
    }

    // 3. Ambil semua anggota dengan relasi divisi
    const { data: anggotaList, error: anggotaError } = await supabase
      .from('anggota')
      .select('*, divisi(*)')
      .order('urutan', { ascending: true });

    if (anggotaError) {
      throw new Error(`Error fetching anggota: ${anggotaError.message}`);
    }

    // 4. Susun struktur hierarki
    const struktur: StrukturOrganisasi[] = bidangList.map((bidang: Bidang) => {
      // Filter divisi yang termasuk dalam bidang ini
      const divisiInBidang = (divisiList || []).filter(
        (divisi: Divisi) => divisi.bidang_id === bidang.id
      );

      // Untuk setiap divisi, ambil anggotanya
      const divisiWithAnggota = divisiInBidang.map((divisi: Divisi) => {
        const anggotaInDivisi = (anggotaList || []).filter(
          (anggota: Anggota) => anggota.divisi_id === divisi.id
        );

        return {
          ...divisi,
          anggota: anggotaInDivisi,
        };
      });

      return {
        bidang,
        divisi: divisiWithAnggota,
      };
    });

    return {
      success: true,
      data: struktur,
    };
  } catch (error) {
    console.error('Error in getStrukturOrganisasi:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Mengambil semua anggota termasuk yang tidak punya divisi (untuk pengurus inti)
 */
export async function getAllAnggota(): Promise<{
  success: boolean;
  data?: Anggota[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select('*, divisi(*, bidang(*))')
      .order('urutan', { ascending: true });

    if (error) {
      throw new Error(`Error fetching anggota: ${error.message}`);
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error('Error in getAllAnggota:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Mengambil anggota berdasarkan divisi
 */
export async function getAnggotaByDivisi(divisiId: string): Promise<{
  success: boolean;
  data?: Anggota[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select('*, divisi(*, bidang(*))')
      .eq('divisi_id', divisiId)
      .order('urutan', { ascending: true });

    if (error) {
      throw new Error(`Error fetching anggota by divisi: ${error.message}`);
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error('Error in getAnggotaByDivisi:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Mengambil detail anggota berdasarkan ID
 */
export async function getAnggotaById(anggotaId: string): Promise<{
  success: boolean;
  data?: Anggota;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('anggota')
      .select('*, divisi(*, bidang(*))')
      .eq('id', anggotaId)
      .single();

    if (error) {
      throw new Error(`Error fetching anggota by id: ${error.message}`);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Error in getAnggotaById:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Helper function untuk mendapatkan URL foto profil lengkap
 */
export function getFotoUrl(fotoPath: string | null): string | null {
  if (!fotoPath) return null;

  // Jika sudah URL lengkap, return as is
  if (fotoPath.startsWith('http')) return fotoPath;

  // Jika path dari storage bucket
  const SUPABASE_URL = 'https://xiwcvwgvkpqvtncxqxrv.supabase.co';
  return `${SUPABASE_URL}/storage/v1/object/public/profile-photos/${fotoPath}`;
}
