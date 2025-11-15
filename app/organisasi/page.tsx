'use client';

import { useEffect, useState } from 'react';
import { getStrukturOrganisasi, getAllAnggota } from '@/backend/api/organisasi/get-struktur';
import { StrukturOrganisasi, Anggota } from '@/backend/config/supabase';
import { BidangSection } from '@/components/organisasi/bidang-section';
import { PengurusIntiSection } from '@/components/organisasi/pengurus-inti-section';
import { useAuth } from '@/lib/auth/auth-context';
import { Users, Loader2, Settings } from 'lucide-react';
import Link from 'next/link';

export default function OrganisasiPage() {
  const { user } = useAuth();
  const [struktur, setStruktur] = useState<StrukturOrganisasi[]>([]);
  const [pengurusInti, setPengurusInti] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch struktur organisasi
        const strukturResponse = await getStrukturOrganisasi();
        if (!strukturResponse.success) {
          throw new Error(strukturResponse.error || 'Failed to fetch struktur');
        }

        // Fetch semua anggota untuk mencari pengurus inti (yang tidak punya divisi)
        const anggotaResponse = await getAllAnggota();
        if (!anggotaResponse.success) {
          throw new Error(anggotaResponse.error || 'Failed to fetch anggota');
        }

        setStruktur(strukturResponse.data || []);

        // Filter pengurus inti (anggota tanpa divisi)
        const pengurusIntiData = (anggotaResponse.data || []).filter(
          (anggota) => anggota.divisi_id === null
        );
        setPengurusInti(pengurusIntiData);
      } catch (err) {
        console.error('Error fetching organisasi data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Memuat data organisasi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="rounded-2xl bg-white p-8 shadow-xl text-center max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <Users className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Terjadi Kesalahan</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 relative">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Users className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Struktur Organisasi
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Mengenal lebih dekat pengurus dan anggota yang menggerakkan organisasi kami
          </p>
        </div>

        {/* Admin Button - Only visible when logged in */}
        {user && (
          <div className="absolute top-4 right-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors border border-white/30"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Pengurus Inti */}
        <PengurusIntiSection pengurusInti={pengurusInti} />

        {/* Struktur per Bidang */}
        {struktur.map((str) => (
          <BidangSection key={str.bidang.id} struktur={str} />
        ))}

        {/* Empty State */}
        {struktur.length === 0 && pengurusInti.length === 0 && (
          <div className="text-center py-20">
            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Belum Ada Data Organisasi
            </h3>
            <p className="text-gray-500">
              Silakan tambahkan data pengurus dan anggota melalui dashboard admin
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="container mx-auto max-w-7xl text-center text-sm text-gray-600">
          <p>
            Data ditampilkan berdasarkan bidang, divisi, dan urutan yang telah ditentukan.
          </p>
          <p className="mt-1">
            Untuk informasi lebih lanjut, silakan hubungi sekretariat organisasi.
          </p>
        </div>
      </div>
    </div>
  );
}
