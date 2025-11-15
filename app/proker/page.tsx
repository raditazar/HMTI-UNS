'use client';

import { useEffect, useState } from 'react';
import { getAllProker } from '@/backend/api/proker/proker-api';
import { Proker } from '@/backend/config/supabase';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Loader2,
  ClipboardList,
  Calendar,
  User,
  Layers,
  Settings,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

export default function ProkerPage() {
  const { user } = useAuth();
  const [prokerList, setProkerList] = useState<Proker[]>([]);
  const [filteredProker, setFilteredProker] = useState<Proker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getAllProker();

        if (res.success) {
          setProkerList(res.data || []);
          setFilteredProker(res.data || []);
        } else {
          throw new Error(res.error || 'Failed to fetch proker');
        }
      } catch (err) {
        console.error('Error fetching proker:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredProker(prokerList);
    } else {
      setFilteredProker(
        prokerList.filter((proker) => proker.status === filterStatus)
      );
    }
  }, [filterStatus, prokerList]);

  const getStatusBadge = (status: Proker['status']) => {
    const badges = {
      planned: 'bg-gray-100 text-gray-700 border-gray-300',
      ongoing: 'bg-blue-100 text-blue-700 border-blue-300',
      completed: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    const labels = {
      planned: 'Direncanakan',
      ongoing: 'Sedang Berjalan',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const getStatusCount = (status: string) => {
    if (status === 'all') return prokerList.length;
    return prokerList.filter((p) => p.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Memuat program kerja...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="rounded-2xl bg-white p-8 shadow-xl text-center max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <ClipboardList className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Terjadi Kesalahan
          </h2>
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
            <ClipboardList className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Program Kerja</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Daftar program kerja yang dijalankan oleh berbagai divisi dalam
            organisasi
          </p>
        </div>

        {/* Admin Button - Only visible when logged in */}
        {user && (
          <div className="absolute top-4 right-4">
            <Link
              href="/admin/proker"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors border border-white/30"
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Kelola Proker</span>
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Filter Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Status</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua ({getStatusCount('all')})
            </button>
            <button
              onClick={() => setFilterStatus('planned')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'planned'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Direncanakan ({getStatusCount('planned')})
            </button>
            <button
              onClick={() => setFilterStatus('ongoing')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'ongoing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sedang Berjalan ({getStatusCount('ongoing')})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Selesai ({getStatusCount('completed')})
            </button>
          </div>
        </div>

        {/* Proker Grid */}
        {filteredProker.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Belum Ada Program Kerja
            </h3>
            <p className="text-gray-500">
              {filterStatus === 'all'
                ? 'Belum ada program kerja yang ditambahkan'
                : `Tidak ada program kerja dengan status "${filterStatus}"`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProker.map((proker) => (
              <div
                key={proker.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header with Status */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <ClipboardList className="h-6 w-6 text-blue-600" />
                    {getStatusBadge(proker.status)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                    {proker.nama}
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Deskripsi */}
                  {proker.deskripsi && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {proker.deskripsi}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-3">
                    {/* Divisi */}
                    {proker.divisi && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Layers className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Divisi</p>
                          <p className="text-sm font-medium text-gray-900">
                            {proker.divisi.nama}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Penanggung Jawab */}
                    {proker.penanggung_jawab && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Penanggung Jawab</p>
                          <p className="text-sm font-medium text-gray-900">
                            {proker.penanggung_jawab.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            {proker.penanggung_jawab.jabatan}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tanggal */}
                    {(proker.tanggal_mulai || proker.tanggal_selesai) && (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Waktu Pelaksanaan</p>
                          <p className="text-sm font-medium text-gray-900">
                            {proker.tanggal_mulai &&
                              new Date(proker.tanggal_mulai).toLocaleDateString(
                                'id-ID',
                                { day: 'numeric', month: 'short', year: 'numeric' }
                              )}
                            {proker.tanggal_mulai && proker.tanggal_selesai && ' - '}
                            {proker.tanggal_selesai &&
                              new Date(proker.tanggal_selesai).toLocaleDateString(
                                'id-ID',
                                { day: 'numeric', month: 'short', year: 'numeric' }
                              )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="container mx-auto max-w-7xl text-center text-sm text-gray-600">
          <p>
            Program kerja ditampilkan berdasarkan divisi dan status pelaksanaan.
          </p>
          <p className="mt-1">
            Untuk informasi lebih lanjut, silakan hubungi divisi terkait.
          </p>
        </div>
      </div>
    </div>
  );
}
