import { createClient } from '@supabase/supabase-js';

// Konfigurasi Supabase
const SUPABASE_URL = 'https://xiwcvwgvkpqvtncxqxrv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2N2d2d2a3BxdnRuY3hxeHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMjE5OTIsImV4cCI6MjA3ODc5Nzk5Mn0.MMisMgc8CF2eOnBbLSu8yHQX6b1vW6DH8l1qbPq5HEg';

// Supabase client untuk operasi public
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipe data untuk database
export interface Bidang {
  id: string;
  nama: string;
  deskripsi: string | null;
  kepala_bidang_id: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
}

export interface Divisi {
  id: string;
  bidang_id: string;
  nama: string;
  deskripsi: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
  bidang?: Bidang;
}

export interface Anggota {
  id: string;
  nama: string;
  jabatan: string;
  angkatan: number;
  divisi_id: string | null;
  foto_url: string | null;
  email: string | null;
  telepon: string | null;
  bio: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
  divisi?: Divisi;
}

export interface StrukturOrganisasi {
  bidang: Bidang;
  kepala_bidang: Anggota | null;
  divisi: (Divisi & {
    anggota: Anggota[];
  })[];
}

export interface ProkerDivisi {
  id: string;
  nama: string;
  deskripsi: string | null;
  divisi_id: string | null;
  penanggung_jawab_id: string | null;
  foto_url: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
  divisi?: Divisi;
  penanggung_jawab?: Anggota;
}
export interface ProkerBidang {
  id: string;
  nama: string;
  deskripsi: string | null;
  bidang_id: string | null;
  penanggung_jawab_id: string | null;
  foto_url: string | null;
  urutan: number;
  created_at: string;
  updated_at: string;
  bidang?: Bidang;
  penanggung_jawab?: Anggota;
}

export type Proker = ProkerDivisi
