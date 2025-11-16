'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { 
  getAllProkerBidang, 
  createProkerBidang, 
  updateProkerBidang, 
  deleteProkerBidang,
  uploadFotoProkerBidang,
  getFotoProkerBidangUrl
} from '@/backend/api/proker/proker-bidang-api';
import { getStrukturOrganisasi, getAllAnggota } from '@/backend/api/organisasi/get-struktur';
import { ProkerBidang, Bidang, Anggota } from '@/backend/config/supabase';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  X,
  User,
  Building2,
  ClipboardList,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProkerBidangAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [prokerList, setProkerList] = useState<ProkerBidang[]>([]);
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProker, setEditingProker] = useState<ProkerBidang | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    bidang_id: '',
    penanggung_jawab_id: '',
    urutan: 0,
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prokerRes, strukturRes, anggotaRes] = await Promise.all([
        getAllProkerBidang(),
        getStrukturOrganisasi(),
        getAllAnggota(),
      ]);

      if (prokerRes.success) {
        setProkerList(prokerRes.data || []);
      }

      if (strukturRes.success) {
        // Extract bidang dari struktur organisasi
        const allBidang: Bidang[] = strukturRes.data?.map(s => s.bidang) || [];
        setBidangList(allBidang);
      }

      if (anggotaRes.success) {
        setAnggotaList(anggotaRes.data || []);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.bidang_id) {
        alert('Bidang harus dipilih');
        setLoading(false);
        return;
      }

      const data = {
        nama: formData.nama,
        deskripsi: formData.deskripsi || undefined,
        bidang_id: formData.bidang_id,
        penanggung_jawab_id: formData.penanggung_jawab_id || null,
        urutan: formData.urutan,
      };

      const result = editingProker
        ? await updateProkerBidang(editingProker.id, data)
        : await createProkerBidang(data);

      if (result.success && result.data) {
        if (fotoFile) {
          setUploading(true);
          await uploadFotoProkerBidang(fotoFile, result.data.id);
          setUploading(false);
        }

        setShowModal(false);
        resetForm();
        fetchData();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus proker bidang ini?')) return;

    setLoading(true);
    const result = await deleteProkerBidang(id);
    if (result.success) {
      fetchData();
    } else {
      alert(`Error: ${result.error}`);
      setLoading(false);
    }
  };

  const openEditModal = (proker: ProkerBidang) => {
    setEditingProker(proker);
    
    setFormData({
      nama: proker.nama,
      deskripsi: proker.deskripsi || '',
      bidang_id: proker.bidang_id || '',
      penanggung_jawab_id: proker.penanggung_jawab_id || '',
      urutan: proker.urutan,
    });

    if (proker.foto_url) {
      setFotoPreview(getFotoProkerBidangUrl(proker.foto_url));
    }

    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProker(null);
    setFormData({
      nama: '',
      deskripsi: '',
      bidang_id: '',
      penanggung_jawab_id: '',
      urutan: prokerList.length,
    });
    setFotoFile(null);
    setFotoPreview(null);
  };

  // Get Kepala Bidang atau anggota dengan divisi di bidang tersebut
  const getAnggotaBidang = () => {
    if (!formData.bidang_id) return [];
    
    // Filter anggota yang kepala bidang-nya sesuai dengan bidang_id
    const bidang = bidangList.find(b => b.id === formData.bidang_id);
    if (!bidang) return [];

    // Kepala bidang
    const kepalaBidang = anggotaList.filter(a => a.id === bidang.kepala_bidang_id);
    
    // Anggota divisi yang bidangnya sesuai
    const anggotaDivisi = anggotaList.filter(a => {
      if (!a.divisi) return false;
      return a.divisi.bidang_id === formData.bidang_id;
    });

    return [...kepalaBidang, ...anggotaDivisi];
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Program Kerja Bidang">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/proker"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Kembali ke Menu Proker</span>
        </Link>
        
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-5 w-5" />
          Tambah Proker Bidang
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : prokerList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <ClipboardList className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Belum Ada Program Kerja Bidang
          </h3>
          <p className="text-gray-500 mb-6">
            Mulai tambahkan program kerja untuk setiap bidang
          </p>
          <Button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Proker Pertama
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prokerList.map((proker) => (
            <div
              key={proker.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {proker.foto_url ? (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={getFotoProkerBidangUrl(proker.foto_url) || ''}
                    alt={proker.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-green-300" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {proker.nama}
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
                      <Building2 className="h-3 w-3" />
                      {proker.bidang?.nama || 'Bidang'}
                    </span>
                  </div>
                  <ClipboardList className="h-6 w-6 text-green-600" />
                </div>

                {proker.deskripsi && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {proker.deskripsi}
                  </p>
                )}

                <div className="space-y-2 mb-4 pt-4 border-t border-gray-100">
                  {proker.penanggung_jawab && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-1.5 bg-purple-50 rounded">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Penanggung Jawab</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {proker.penanggung_jawab.nama}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditModal(proker)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(proker.id)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:border-red-200"
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingProker ? 'Edit Proker Bidang' : 'Tambah Proker Bidang'}
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

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Upload Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto/Banner Program Kerja Bidang
                  </label>
                  <div className="flex items-center gap-4">
                    {fotoPreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={fotoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Klik untuk upload foto
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            PNG, JPG max 5MB
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Nama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Program Kerja Bidang *
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                    placeholder="Contoh: Pelatihan Kepemimpinan Tingkat Bidang"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Bidang */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bidang *
                  </label>
                  <select
                    value={formData.bidang_id}
                    onChange={(e) =>
                      setFormData({ 
                        ...formData, 
                        bidang_id: e.target.value,
                        penanggung_jawab_id: '' // Reset PJ saat ganti bidang
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Bidang --</option>
                    {bidangList.map((bidang) => (
                      <option key={bidang.id} value={bidang.id}>
                        {bidang.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Penanggung Jawab */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penanggung Jawab
                  </label>
                  <select
                    value={formData.penanggung_jawab_id}
                    onChange={(e) =>
                      setFormData({ ...formData, penanggung_jawab_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!formData.bidang_id}
                  >
                    <option value="">-- {formData.bidang_id ? 'Pilih Penanggung Jawab' : 'Pilih Bidang Dulu'} --</option>
                    {getAnggotaBidang().map((anggota) => (
                      <option key={anggota.id} value={anggota.id}>
                        {anggota.nama} - {anggota.jabatan}
                      </option>
                    ))}
                  </select>
                  {formData.bidang_id && getAnggotaBidang().length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Belum ada anggota di bidang ini
                    </p>
                  )}
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) =>
                      setFormData({ ...formData, deskripsi: e.target.value })
                    }
                    rows={4}
                    placeholder="Deskripsi lengkap program kerja bidang..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    onChange={(e) =>
                      setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Angka lebih kecil akan ditampilkan lebih dulu
                  </p>
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
                    disabled={loading || uploading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {uploading ? 'Mengupload foto...' : 'Menyimpan...'}
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