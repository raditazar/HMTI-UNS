'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { getAllAnggota, getFotoUrl } from '@/backend/api/organisasi/get-struktur';
import { getStrukturOrganisasi } from '@/backend/api/organisasi/get-struktur';
import {
  createAnggota,
  updateAnggota,
  deleteAnggota,
  uploadFoto,
  deleteFoto,
} from '@/backend/api/organisasi/admin-crud';
import { Anggota, Bidang, Divisi } from '@/backend/config/supabase';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  FileText,
  Search,
  Filter,
  SortAsc,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnggotaAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [filteredAnggota, setFilteredAnggota] = useState<Anggota[]>([]);
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<Anggota | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingPhotoId, setUploadingPhotoId] = useState<string | null>(null);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState<string>('all');
  const [filterAngkatan, setFilterAngkatan] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nama' | 'angkatan' | 'urutan'>('urutan');

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    angkatan: new Date().getFullYear() - 2000 + 22,
    divisi_id: '',
    email: '',
    telepon: '',
    bio: '',
    urutan: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [anggotaRes, strukturRes] = await Promise.all([
        getAllAnggota(),
        getStrukturOrganisasi(),
      ]);

      if (anggotaRes.success) {
        setAnggotaList(anggotaRes.data || []);
        setFilteredAnggota(anggotaRes.data || []);
      }

      if (strukturRes.success) {
        const allBidang: Bidang[] = [];
        const allDivisi: Divisi[] = [];

        strukturRes.data?.forEach((str) => {
          allBidang.push(str.bidang);
          allDivisi.push(...str.divisi);
        });

        setBidangList(allBidang);
        setDivisiList(allDivisi);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Filter & Sort logic
  useEffect(() => {
    let result = [...anggotaList];

    // Search
    if (searchQuery) {
      result = result.filter(
        (a) =>
          a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.jabatan.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Divisi
    if (filterDivisi !== 'all') {
      if (filterDivisi === 'inti') {
        result = result.filter((a) => !a.divisi_id);
      } else {
        result = result.filter((a) => a.divisi_id === filterDivisi);
      }
    }

    // Filter by Angkatan
    if (filterAngkatan !== 'all') {
      result = result.filter((a) => a.angkatan.toString() === filterAngkatan);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'nama') {
        return a.nama.localeCompare(b.nama);
      } else if (sortBy === 'angkatan') {
        return b.angkatan - a.angkatan;
      } else {
        return a.urutan - b.urutan;
      }
    });

    setFilteredAnggota(result);
  }, [anggotaList, searchQuery, filterDivisi, filterAngkatan, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      divisi_id: formData.divisi_id || null,
    };

    const result = editingAnggota
      ? await updateAnggota(editingAnggota.id, data)
      : await createAnggota(data);

    if (result.success) {
      setShowModal(false);
      resetForm();
      fetchData();
    } else {
      alert(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;

    setLoading(true);
    const result = await deleteAnggota(id);
    if (result.success) {
      fetchData();
    } else {
      alert(`Error: ${result.error}`);
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (anggotaId: string, file: File) => {
    setUploadingPhoto(true);
    setUploadingPhotoId(anggotaId);
    const result = await uploadFoto(file, anggotaId);

    if (result.success) {
      await fetchData();
      alert('Foto berhasil diupload!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setUploadingPhoto(false);
    setUploadingPhotoId(null);
  };

  const handlePhotoDelete = async (anggotaId: string) => {
    if (!confirm('Yakin ingin menghapus foto?')) return;

    setUploadingPhoto(true);
    setUploadingPhotoId(anggotaId);
    const result = await deleteFoto(anggotaId);

    if (result.success) {
      await fetchData();
      alert('Foto berhasil dihapus!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setUploadingPhoto(false);
    setUploadingPhotoId(null);
  };

  const openEditModal = (anggota: Anggota) => {
    setEditingAnggota(anggota);
    setFormData({
      nama: anggota.nama,
      jabatan: anggota.jabatan,
      angkatan: anggota.angkatan,
      divisi_id: anggota.divisi_id || '',
      email: anggota.email || '',
      telepon: anggota.telepon || '',
      bio: anggota.bio || '',
      urutan: anggota.urutan,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingAnggota(null);
    setFormData({
      nama: '',
      jabatan: '',
      angkatan: new Date().getFullYear() - 2000 + 22,
      divisi_id: '',
      email: '',
      telepon: '',
      bio: '',
      urutan: anggotaList.length,
    });
  };

  // Get unique angkatan for filter
  const uniqueAngkatan = Array.from(new Set(anggotaList.map((a) => a.angkatan))).sort(
    (a, b) => b - a
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Anggota">
      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Tambah Anggota
          </Button>
          <div className="text-sm text-gray-600">
            Total: <span className="font-bold text-blue-600">{filteredAnggota.length}</span> dari{' '}
            <span className="font-bold">{anggotaList.length}</span> anggota
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Divisi */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">Semua Divisi</option>
              <option value="inti">Pengurus Inti</option>
              {divisiList.map((divisi) => (
                <option key={divisi.id} value={divisi.id}>
                  {divisi.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Angkatan */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterAngkatan}
              onChange={(e) => setFilterAngkatan(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">Semua Angkatan</option>
              {uniqueAngkatan.map((angkatan) => (
                <option key={angkatan} value={angkatan.toString()}>
                  Angkatan {angkatan}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'nama' | 'angkatan' | 'urutan')}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="urutan">Urutan</option>
              <option value="nama">Nama (A-Z)</option>
              <option value="angkatan">Angkatan (Terbaru)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Anggota Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredAnggota.length === 0 ? (
        <div className="text-center py-20">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada anggota ditemukan</p>
          <p className="text-gray-400 text-sm mt-2">Coba ubah filter atau tambah anggota baru</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnggota.map((anggota) => (
            <div
              key={anggota.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Photo */}
              <div className="relative h-56 bg-gradient-to-br from-blue-50 to-blue-100">
                {anggota.foto_url ? (
                  <img
                    src={getFotoUrl(anggota.foto_url) || ''}
                    alt={anggota.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    key={anggota.foto_url}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="h-20 w-20 text-blue-200" />
                  </div>
                )}

                {/* Upload Loading Overlay */}
                {uploadingPhoto && uploadingPhotoId === anggota.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                      <p className="text-white text-sm">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Photo Actions - Show on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                    <label
                      className={`flex-1 cursor-pointer bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white flex items-center justify-center gap-2 ${
                        uploadingPhoto && uploadingPhotoId === anggota.id
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {uploadingPhoto && uploadingPhotoId === anggota.id ? (
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(anggota.id, file);
                            e.target.value = '';
                          }
                        }}
                        disabled={uploadingPhoto && uploadingPhotoId === anggota.id}
                      />
                    </label>
                    {anggota.foto_url && (
                      <button
                        onClick={() => handlePhotoDelete(anggota.id)}
                        className="bg-red-500/90 backdrop-blur-sm p-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={uploadingPhoto && uploadingPhotoId === anggota.id}
                        title="Hapus foto"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Angkatan Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {anggota.angkatan}
                  </span>
                </div>

                {/* Order Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                    #{anggota.urutan}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                  {anggota.nama}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-2 line-clamp-1">
                  {anggota.jabatan}
                </p>

                {anggota.divisi ? (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                      {anggota.divisi.nama}
                    </span>
                  </div>
                ) : (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-xs text-blue-700 font-medium">
                      Pengurus Inti
                    </span>
                  </div>
                )}

                {anggota.email && (
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-1 line-clamp-1">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    {anggota.email}
                  </p>
                )}

                {anggota.telepon && (
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-3 line-clamp-1">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    {anggota.telepon}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Button
                    onClick={() => openEditModal(anggota)}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 border-blue-200"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(anggota.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingAnggota ? 'Edit Anggota' : 'Tambah Anggota Baru'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Jabatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="h-4 w-4 inline mr-1" />
                      Jabatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      required
                      placeholder="Contoh: Ketua Himpunan"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Angkatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award className="h-4 w-4 inline mr-1" />
                      Angkatan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.angkatan}
                      onChange={(e) => setFormData({ ...formData, angkatan: parseInt(e.target.value) })}
                      required
                      min="2000"
                      max="2099"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Divisi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Divisi
                      <span className="text-xs text-gray-500 ml-2">(Kosongkan untuk Pengurus Inti)</span>
                    </label>
                    <select
                      value={formData.divisi_id}
                      onChange={(e) => setFormData({ ...formData, divisi_id: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">-- Pengurus Inti --</option>
                      {divisiList.map((divisi) => (
                        <option key={divisi.id} value={divisi.id}>
                          {divisi.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Urutan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urutan Tampilan
                    </label>
                    <input
                      type="number"
                      value={formData.urutan}
                      onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })}
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nama@example.com"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Telepon */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Ceritakan tentang anggota ini..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <ImageIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Upload Foto</p>
                      <p className="text-blue-600">
                        Foto dapat diupload setelah data anggota berhasil disimpan. Gunakan tombol upload pada card anggota.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Menyimpan...
                      </>
                    ) : editingAnggota ? (
                      'Update Anggota'
                    ) : (
                      'Tambah Anggota'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}