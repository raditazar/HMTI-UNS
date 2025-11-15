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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AnggotaAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnggota, setEditingAnggota] = useState<Anggota | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
    const result = await uploadFoto(file, anggotaId);

    if (result.success) {
      // Refresh data untuk update UI
      await fetchData();
      alert('Foto berhasil diupload!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setUploadingPhoto(false);
  };

  const handlePhotoDelete = async (anggotaId: string) => {
    if (!confirm('Yakin ingin menghapus foto?')) return;

    setUploadingPhoto(true);
    const result = await deleteFoto(anggotaId);

    if (result.success) {
      // Refresh data untuk update UI
      await fetchData();
      alert('Foto berhasil dihapus!');
    } else {
      alert(`Error: ${result.error}`);
    }
    setUploadingPhoto(false);
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

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Anggota">
      {/* Add Button */}
      <div className="mb-6">
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
      </div>

      {/* Anggota List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {anggotaList.map((anggota) => (
            <div
              key={anggota.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Photo */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
                {anggota.foto_url ? (
                  <img
                    src={getFotoUrl(anggota.foto_url) || ''}
                    alt={anggota.nama}
                    className="w-full h-full object-cover"
                    key={anggota.foto_url}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="h-20 w-20 text-blue-300" />
                  </div>
                )}

                {/* Upload Loading Overlay */}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                      <p className="text-white text-sm">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Photo Actions */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <label className={`cursor-pointer bg-white/90 p-2 rounded-lg hover:bg-white ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploadingPhoto ? (
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 text-blue-600" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePhotoUpload(anggota.id, file);
                          // Reset input agar bisa upload file yang sama
                          e.target.value = '';
                        }
                      }}
                      disabled={uploadingPhoto}
                    />
                  </label>
                  {anggota.foto_url && (
                    <button
                      onClick={() => handlePhotoDelete(anggota.id)}
                      className="bg-white/90 p-2 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploadingPhoto}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  )}
                </div>

                {/* Angkatan Badge */}
                <div className="absolute top-2 left-2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {anggota.angkatan}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {anggota.nama}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-3">
                  {anggota.jabatan}
                </p>

                {anggota.divisi && (
                  <p className="text-xs text-gray-500 mb-2">
                    {anggota.divisi.nama}
                  </p>
                )}

                {anggota.email && (
                  <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                    <Mail className="h-3 w-3" />
                    {anggota.email}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => openEditModal(anggota)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(anggota.id)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingAnggota ? 'Edit Anggota' : 'Tambah Anggota'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Jabatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="h-4 w-4 inline mr-1" />
                      Jabatan *
                    </label>
                    <input
                      type="text"
                      value={formData.jabatan}
                      onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Angkatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Award className="h-4 w-4 inline mr-1" />
                      Angkatan *
                    </label>
                    <input
                      type="number"
                      value={formData.angkatan}
                      onChange={(e) => setFormData({ ...formData, angkatan: parseInt(e.target.value) })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Divisi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Divisi (Kosongkan untuk Pengurus Inti)
                    </label>
                    <select
                      value={formData.divisi_id}
                      onChange={(e) => setFormData({ ...formData, divisi_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Pengurus Inti --</option>
                      {divisiList.map((divisi) => (
                        <option key={divisi.id} value={divisi.id}>
                          {divisi.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Telepon */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Telepon
                    </label>
                    <input
                      type="tel"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Urutan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urutan Tampilan
                    </label>
                    <input
                      type="number"
                      value={formData.urutan}
                      onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ceritakan tentang anggota ini..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
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
                    ) : (
                      'Simpan'
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
