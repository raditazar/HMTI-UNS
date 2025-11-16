'use client';

import { useEffect, useState } from 'react';
import { 
  getStrukturOrganisasi, 
  getPengurusInti,
  getFotoUrl 
} from '@/backend/api/organisasi/get-struktur';
import { StrukturOrganisasi, Anggota } from '@/backend/config/supabase';
import { useAuth } from '@/lib/auth/auth-context';
import { 
  Users, 
  Loader2, 
  Settings, 
  User,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Home 
} from 'lucide-react';
import Link from 'next/link';

export default function OrganisasiPage() {
  const { user } = useAuth();
  const [struktur, setStruktur] = useState<StrukturOrganisasi[]>([]);
  const [pengurusInti, setPengurusInti] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBidang, setExpandedBidang] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch struktur organisasi dan pengurus inti
        const [strukturResponse, pengurusResponse] = await Promise.all([
          getStrukturOrganisasi(),
          getPengurusInti(),
        ]);

        if (!strukturResponse.success) {
          throw new Error(strukturResponse.error || 'Failed to fetch struktur');
        }

        if (!pengurusResponse.success) {
          throw new Error(pengurusResponse.error || 'Failed to fetch pengurus inti');
        }

        const strukturData = strukturResponse.data || [];
        setStruktur(strukturData);
        setPengurusInti(pengurusResponse.data || []);
        
        // Expand all bidang by default
        setExpandedBidang(strukturData.map(s => s.bidang.id));
      } catch (err) {
        console.error('Error fetching organisasi data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const toggleBidang = (bidangId: string) => {
    setExpandedBidang(prev =>
      prev.includes(bidangId)
        ? prev.filter(id => id !== bidangId)
        : [...prev, bidangId]
    );
  };

  const AnggotaCard = ({ 
    anggota, 
    isKepalaBidang = false 
  }: { 
    anggota: Anggota; 
    isKepalaBidang?: boolean;
  }) => (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-300 hover:shadow-md ${
      isKepalaBidang ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
    }`}>
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
        {anggota.foto_url ? (
          <img
            src={getFotoUrl(anggota.foto_url) || ''}
            alt={anggota.nama}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full">
                    <svg class="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className="h-16 w-16 text-gray-300" />
          </div>
        )}
        {isKepalaBidang && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Kepala Bidang
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow">
            {anggota.angkatan}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
          {anggota.nama}
        </h3>
        <p className="text-sm text-blue-600 font-medium line-clamp-1">
          {anggota.jabatan}
        </p>
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Kembali</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Struktur Organisasi HMTI UNS</h1>
            <div className="flex items-center gap-3">
              {user && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span className="font-medium hidden sm:inline">Admin</span>
                </Link>
              )}
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Pengurus Inti Section */}
        {pengurusInti.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pengurus Inti
              </h2>
              <p className="text-gray-600">
                Struktur kepengurusan inti HMTI UNS periode 2024/2025
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {pengurusInti.map(anggota => (
                <AnggotaCard key={anggota.id} anggota={anggota} />
              ))}
            </div>
          </div>
        )}

        {/* Bidang Sections */}
        <div className="space-y-6">
          {struktur.map(item => (
            <div key={item.bidang.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Bidang Header */}
              <button
                onClick={() => toggleBidang(item.bidang.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {item.bidang.nama}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {item.divisi.length} Divisi • {item.divisi.reduce((acc, d) => acc + d.anggota.length, 0)} Anggota
                    {item.kepala_bidang && ' • 1 Kepala Bidang'}
                  </p>
                </div>
                {expandedBidang.includes(item.bidang.id) ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </button>

              {/* Bidang Content */}
              {expandedBidang.includes(item.bidang.id) && (
                <div className="border-t border-gray-200">
                  {/* Kepala Bidang */}
                  {item.kepala_bidang && (
                    <div className="p-6 bg-blue-50 border-b border-blue-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Kepala Bidang
                      </h3>
                      <div className="max-w-xs">
                        <AnggotaCard anggota={item.kepala_bidang} isKepalaBidang />
                      </div>
                    </div>
                  )}

                  {/* Divisi List */}
                  <div className="p-6 space-y-8">
                    {item.divisi.map(divisi => (
                      <div key={divisi.id}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-shrink-0 w-1 h-8 bg-blue-600 rounded-full"></div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {divisi.nama}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {divisi.anggota.length} Anggota
                            </p>
                          </div>
                        </div>
                        
                        {divisi.anggota.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {divisi.anggota
                              .sort((a, b) => a.urutan - b.urutan)
                              .map(anggota => (
                                <AnggotaCard key={anggota.id} anggota={anggota} />
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Belum ada anggota di divisi ini
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

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

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">
              Total Anggota: <span className="font-bold text-blue-600">
                {pengurusInti.length + struktur.reduce((acc, s) => 
                  acc + (s.kepala_bidang ? 1 : 0) + s.divisi.reduce((divAcc, d) => divAcc + d.anggota.length, 0), 0
                )}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}