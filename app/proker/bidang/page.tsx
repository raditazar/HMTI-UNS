'use client';

import { useEffect, useState } from 'react';
import { 
  getAllProkerBidang, 
  getFotoProkerBidangUrl 
} from '@/backend/api/proker/proker-bidang-api';
import { getStrukturOrganisasi } from '@/backend/api/organisasi/get-struktur';
import { ProkerBidang, Bidang } from '@/backend/config/supabase';
import { useAuth } from '@/lib/auth/auth-context';
import {
  Loader2,
  ClipboardList,
  User,
  Building2,
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
  type: 'all' | 'bidang';
}

export default function ProkerBidangPage() {
  const { user } = useAuth();
  const [prokerList, setProkerList] = useState<ProkerBidang[]>([]);
  const [filteredProker, setFilteredProker] = useState<ProkerBidang[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>({
    id: null,
    name: 'Semua Program Kerja Bidang',
    type: 'all',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prokerRes, strukturRes] = await Promise.all([
          getAllProkerBidang(),
          getStrukturOrganisasi(),
        ]);

        if (prokerRes.success) {
          setProkerList(prokerRes.data || []);
          setFilteredProker(prokerRes.data || []);
        } else {
          throw new Error(prokerRes.error || 'Failed to fetch proker bidang');
        }

        if (strukturRes.success) {
          const options: FilterOption[] = [
            { id: null, name: 'Semua Program Kerja Bidang', type: 'all' },
          ];

          // Filter bidang yang punya proker
          const bidangWithProker = (strukturRes.data || []).filter(struktur => {
            const count = (prokerRes.data || []).filter(
              proker => proker.bidang_id === struktur.bidang.id
            ).length;
            return count > 0;
          });

          bidangWithProker.forEach(struktur => {
            options.push({
              id: struktur.bidang.id,
              name: struktur.bidang.nama,
              type: 'bidang',
            });
          });

          setFilterOptions(options);
        }
      } catch (err) {
        console.error('Error fetching proker bidang:', err);
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
      filtered = filtered.filter((proker) => proker.bidang_id === selectedFilter.id);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((proker) => {
        const nama = proker.nama.toLowerCase();
        const deskripsi = (proker.deskripsi || '').toLowerCase();
        const pj = (proker.penanggung_jawab?.nama || '').toLowerCase();
        const bidang = (proker.bidang?.nama || '').toLowerCase();
        return nama.includes(query) || deskripsi.includes(query) || pj.includes(query) || bidang.includes(query);
      });
    }

    setFilteredProker(filtered);
  }, [selectedFilter, searchQuery, prokerList]);

  const getProkerCount = (filterId: string | null) => {
    if (!filterId) return prokerList.length;
    return prokerList.filter(proker => proker.bidang_id === filterId).length;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Memuat program kerja bidang...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
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
              <Building2 className="h-6 w-6 text-purple-600" />
              Program Kerja Bidang
            </h1>
            <div className="flex items-center gap-3">
              {user && (
                <Link
                  href="/admin/proker/bidang"
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors group"
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
                  {filteredProker.length} Program Kerja Bidang
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedFilter.type === 'all' 
                    ? 'Menampilkan semua program kerja bidang'
                    : `Filter: ${selectedFilter.name}`}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Filter & Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dropdown Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Berdasarkan Bidang
              </label>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 transition-colors focus:outline-none focus:border-purple-500"
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
                    {filterOptions.map((option) => {
                      const count = getProkerCount(option.id);
                      const isSelected = selectedFilter.id === option.id;
                      
                      return (
                        <button
                          key={option.id || 'all'}
                          onClick={() => {
                            setSelectedFilter(option);
                            setShowDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center justify-between ${
                            isSelected ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Building2 className={`h-4 w-4 ${
                              isSelected ? 'text-purple-600' : 'text-gray-400'
                            }`} />
                            <span className={`font-medium ${
                              isSelected ? 'text-purple-700' : 'text-gray-700'
                            }`}>
                              {option.name}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isSelected 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {count}
                          </span>
                        </button>
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
                  placeholder="Cari nama proker, bidang, atau PJ..."
                  className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-400 focus:outline-none focus:border-purple-500 transition-colors"
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
                    name: 'Semua Program Kerja Bidang',
                    type: 'all',
                  })}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  {selectedFilter.name}
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
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
                    name: 'Semua Program Kerja Bidang',
                    type: 'all',
                  });
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
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
                      src={getFotoProkerBidangUrl(proker.foto_url) || ''}
                      alt={proker.nama}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-purple-300" />
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
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-200">
                      <Building2 className="h-3.5 w-3.5" />
                      {proker.bidang?.nama || 'Tidak Ada Bidang'}
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