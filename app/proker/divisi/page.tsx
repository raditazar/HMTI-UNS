'use client';

import { useEffect, useState } from 'react';
import { getAllProker, getFotoProkerUrl } from '@/backend/api/proker/proker-api';
import { getStrukturOrganisasi } from '@/backend/api/organisasi/get-struktur';
import { Proker, Divisi } from '@/backend/config/supabase';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Loader2,
  ClipboardList,
  Calendar,
  User,
  Layers,
  Settings,
  Filter,
  ArrowLeft,
  Home,
  Image as ImageIcon,
  ChevronDown,
  X,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface FilterOption {
  id: string | null;
  name: string;
  type: 'all' | 'pengurus' | 'divisi';
}

export default function ProkerPage() {
  const { user } = useAuth();
  const [prokerList, setProkerList] = useState<Proker[]>([]);
  const [filteredProker, setFilteredProker] = useState<Proker[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>({
    id: null,
    name: 'Semua Program Kerja',
    type: 'all',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prokerRes, strukturRes] = await Promise.all([
          getAllProker(),
          getStrukturOrganisasi(),
        ]);

        if (prokerRes.success) {
          setProkerList(prokerRes.data || []);
          setFilteredProker(prokerRes.data || []);
        } else {
          throw new Error(prokerRes.error || 'Failed to fetch proker');
        }

        if (strukturRes.success) {
          const options: FilterOption[] = [
            { id: null, name: 'Semua Program Kerja', type: 'all' },
          ];

          // Pengurus Inti
          const pengurusOptions: FilterOption[] = [
            { id: 'ketua', name: 'Ketua', type: 'pengurus' },
            { id: 'wakil', name: 'Wakil Ketua', type: 'pengurus' },
            { id: 'sekretaris', name: 'Sekretaris', type: 'pengurus' },
            { id: 'bendahara', name: 'Bendahara', type: 'pengurus' },
          ];

          // Filter hanya pengurus yang punya proker
          const pengurusWithProker = pengurusOptions.filter(opt => {
            const count = (prokerRes.data || []).filter(proker => {
              if (!proker.divisi_id && proker.penanggung_jawab) {
                const jabatan = proker.penanggung_jawab.jabatan.toLowerCase();
                if (opt.id === 'ketua' && jabatan.includes('ketua') && !jabatan.includes('wakil')) return true;
                if (opt.id === 'wakil' && jabatan.includes('wakil')) return true;
                if (opt.id === 'sekretaris' && jabatan.includes('sekretaris')) return true;
                if (opt.id === 'bendahara' && jabatan.includes('bendahara')) return true;
              }
              return false;
            }).length;
            return count > 0;
          });

          options.push(...pengurusWithProker);

          // Divisi
          const allDivisi: Divisi[] = [];
          strukturRes.data?.forEach((str) => {
            allDivisi.push(...str.divisi);
          });

          // Filter divisi yang punya proker
          const divisiWithProker = allDivisi.filter(div => {
            const count = (prokerRes.data || []).filter(
              proker => proker.divisi_id === div.id
            ).length;
            return count > 0;
          });

          divisiWithProker.forEach(div => {
            options.push({
              id: div.id,
              name: div.nama,
              type: 'divisi',
            });
          });

          setFilterOptions(options);
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
    let filtered = prokerList;

    // Filter by dropdown
    if (selectedFilter.id) {
      filtered = filtered.filter((proker) => {
        // Check divisi
        if (proker.divisi_id === selectedFilter.id) return true;

        // Check pengurus inti
        if (!proker.divisi_id && proker.penanggung_jawab) {
          const jabatan = proker.penanggung_jawab.jabatan.toLowerCase();
          if (selectedFilter.id === 'ketua' && jabatan.includes('ketua') && !jabatan.includes('wakil')) return true;
          if (selectedFilter.id === 'wakil' && jabatan.includes('wakil')) return true;
          if (selectedFilter.id === 'sekretaris' && jabatan.includes('sekretaris')) return true;
          if (selectedFilter.id === 'bendahara' && jabatan.includes('bendahara')) return true;
        }

        return false;
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((proker) => {
        const nama = proker.nama.toLowerCase();
        const deskripsi = (proker.deskripsi || '').toLowerCase();
        const pj = (proker.penanggung_jawab?.nama || '').toLowerCase();
        return nama.includes(query) || deskripsi.includes(query) || pj.includes(query);
      });
    }

    setFilteredProker(filtered);
  }, [selectedFilter, searchQuery, prokerList]);

  const getDivisiLabel = (proker: Proker) => {
    if (proker.divisi) {
      return proker.divisi.nama;
    }
    if (proker.penanggung_jawab) {
      const jabatan = proker.penanggung_jawab.jabatan.toLowerCase();
      if (jabatan.includes('ketua') && !jabatan.includes('wakil')) return 'Ketua';
      if (jabatan.includes('wakil')) return 'Wakil Ketua';
      if (jabatan.includes('sekretaris')) return 'Sekretaris';
      if (jabatan.includes('bendahara')) return 'Bendahara';
    }
    return 'Pengurus Inti';
  };

  const getProkerCount = (filterId: string | null) => {
    if (!filterId) return prokerList.length;

    return prokerList.filter(proker => {
      if (proker.divisi_id === filterId) return true;

      if (!proker.divisi_id && proker.penanggung_jawab) {
        const jabatan = proker.penanggung_jawab.jabatan.toLowerCase();
        if (filterId === 'ketua' && jabatan.includes('ketua') && !jabatan.includes('wakil')) return true;
        if (filterId === 'wakil' && jabatan.includes('wakil')) return true;
        if (filterId === 'sekretaris' && jabatan.includes('sekretaris')) return true;
        if (filterId === 'bendahara' && jabatan.includes('bendahara')) return true;
      }

      return false;
    }).length;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-blue-600" />
              Program Kerja HMTI UNS
            </h1>
            <div className="flex items-center gap-3">
              {user && (
                <Link
                  href="/admin/proker"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                  <span className="font-medium hidden sm:inline">Kelola</span>
                </Link>
              )}
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header & Filters */}
        <div className="mb-8">
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {filteredProker.length} Program Kerja
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedFilter.type === 'all' 
                    ? 'Menampilkan semua program kerja'
                    : `Filter: ${selectedFilter.name}`}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dropdown Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Berdasarkan Divisi/Pengurus
              </label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors focus:outline-none focus:border-blue-500"
              >
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedFilter.name}</p>
                    <p className="text-xs text-gray-500">
                      {getProkerCount(selectedFilter.id)} proker
                    </p>
                  </div>
                </div>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    showDropdown ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
                    {filterOptions.map((option, index) => {
                      const count = getProkerCount(option.id);
                      const isSelected = selectedFilter.id === option.id;
                      
                      return (
                        <div key={option.id || 'all'}>
                          {/* Separator */}
                          {index > 0 && option.type !== filterOptions[index - 1].type && (
                            <div className="border-t border-gray-100 my-1" />
                          )}
                          
                          {/* Section Label */}
                          {(index === 0 || option.type !== filterOptions[index - 1].type) && 
                            option.type !== 'all' && (
                            <div className="px-4 py-2 bg-gray-50">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                {option.type === 'pengurus' ? 'Pengurus Inti' : 'Divisi'}
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              setSelectedFilter(option);
                              setShowDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                              isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Layers className={`h-4 w-4 ${
                                isSelected ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                              <span className={`font-medium ${
                                isSelected ? 'text-blue-700' : 'text-gray-700'
                              }`}>
                                {option.name}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isSelected 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {count}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Program Kerja
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama proker, deskripsi, atau PJ..."
                  className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedFilter.type !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Filter aktif:</span>
              {selectedFilter.type !== 'all' && (
                <button
                  onClick={() => setSelectedFilter({
                    id: null,
                    name: 'Semua Program Kerja',
                    type: 'all',
                  })}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {selectedFilter.name}
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  "{searchQuery}"
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Proker Grid */}
        {filteredProker.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <ClipboardList className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak Ada Program Kerja
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `Tidak ditemukan program kerja dengan kata kunci "${searchQuery}"`
                : 'Belum ada program kerja untuk filter yang dipilih'}
            </p>
            {(selectedFilter.type !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedFilter({
                    id: null,
                    name: 'Semua Program Kerja',
                    type: 'all',
                  });
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <X className="h-5 w-5" />
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProker.map((proker) => (
              <div
                key={proker.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Foto Banner */}
                {proker.foto_url ? (
                  <div className="relative h-48 bg-gray-100 overflow-hidden group">
                    <img
                      src={getFotoProkerUrl(proker.foto_url) || ''}
                      alt={proker.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-blue-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1 leading-tight">
                        {proker.nama}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200">
                      <Layers className="h-3.5 w-3.5" />
                      {getDivisiLabel(proker)}
                    </span>
                  </div>

                  {/* Deskripsi */}
                  {proker.deskripsi && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {proker.deskripsi}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {proker.penanggung_jawab && (
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 p-2 bg-purple-50 rounded-lg">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Penanggung Jawab</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {proker.penanggung_jawab.nama}
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
    </div>
  );
}