'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { 
  getAllProker, 
  createProker, 
  updateProker, 
  deleteProker,
  uploadFotoProker,
  getFotoProkerUrl
} from '@/backend/api/proker/proker-api';
import { getStrukturOrganisasi, getAllAnggota } from '@/backend/api/organisasi/get-struktur';
import { Proker, Divisi, Anggota } from '@/backend/config/supabase';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  X,
  User,
  Layers,
  ClipboardList,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterOption {
  id: string | null;
  name: string;
  type: 'pengurus' | 'divisi';
}

export default function ProkerAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [prokerList, setProkerList] = useState<Proker[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProker, setEditingProker] = useState<Proker | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    divisi_id: '',
    penanggung_jawab_id: '',
    urutan: 0,
  });

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prokerRes, strukturRes, anggotaRes] = await Promise.all([
        getAllProker(),
        getStrukturOrganisasi(),
        getAllAnggota(),
      ]);

      if (prokerRes.success) {
        setProkerList(prokerRes.data || []);
      }

      if (strukturRes.success && anggotaRes.success) {
        const options: FilterOption[] = [];
        
        // Tambahkan pengurus inti
        options.push(
          { id: 'ketua', name: 'Ketua', type: 'pengurus' },
          { id: 'wakil', name: 'Wakil Ketua', type: 'pengurus' },
          { id: 'sekretaris', name: 'Sekretaris', type: 'pengurus' },
          { id: 'bendahara', name: 'Bendahara', type: 'pengurus' }
        );

        // Tambahkan divisi
        const allDivisi: Divisi[] = [];
        strukturRes.data?.forEach((str) => {
          allDivisi.push(...str.divisi);
        });
        
        allDivisi.forEach(div => {
          options.push({
            id: div.id,
            name: div.nama,
            type: 'divisi'
          });
        });

        setFilterOptions(options);
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
      // Determine divisi_id
      let divisiId: string | null = null;
      if (formData.divisi_id && !['ketua', 'wakil', 'sekretaris', 'bendahara'].includes(formData.divisi_id)) {
        divisiId = formData.divisi_id;
      }

      const data = {
        nama: formData.nama,
        deskripsi: formData.deskripsi || undefined,
        divisi_id: divisiId,
        penanggung_jawab_id: formData.penanggung_jawab_id || null,
        urutan: formData.urutan,
      };

      const result = editingProker
        ? await updateProker(editingProker.id, data)
        : await createProker(data);

      if (result.success && result.data) {
        // Upload foto jika ada
        if (fotoFile) {
          setUploading(true);
          await uploadFotoProker(fotoFile, result.data.id);
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
    if (!confirm('Yakin ingin menghapus proker ini?')) return;

    setLoading(true);
    const result = await deleteProker(id);
    if (result.success) {
      fetchData();
    } else {
      alert(`Error: ${result.error}`);
      setLoading(false);
    }
  };

  const openEditModal = (proker: Proker) => {
    setEditingProker(proker);
    
    // Determine divisi_id for form
    let divisiIdValue = '';
    if (proker.divisi_id) {
      divisiIdValue = proker.divisi_id;
    } else if (proker.penanggung_jawab) {
      // Pengurus inti - tentukan berdasarkan jabatan
      const jabatan = proker.penanggung_jawab.jabatan.toLowerCase();
      if (jabatan.includes('ketua') && !jabatan.includes('wakil')) divisiIdValue = 'ketua';
      else if (jabatan.includes('wakil')) divisiIdValue = 'wakil';
      else if (jabatan.includes('sekretaris')) divisiIdValue = 'sekretaris';
      else if (jabatan.includes('bendahara')) divisiIdValue = 'bendahara';
    }

    setFormData({
      nama: proker.nama,
      deskripsi: proker.deskripsi || '',
      divisi_id: divisiIdValue,
      penanggung_jawab_id: proker.penanggung_jawab_id || '',
      urutan: proker.urutan,
    });

    if (proker.foto_url) {
      setFotoPreview(getFotoProkerUrl(proker.foto_url));
    }

    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProker(null);
    setFormData({
      nama: '',
      deskripsi: '',
      divisi_id: '',
      penanggung_jawab_id: '',
      urutan: prokerList.length,
    });
    setFotoFile(null);
    setFotoPreview(null);
  };

  const getDivisiLabel = (proker: Proker) => {
    if (proker.divisi) {
      return proker.divisi.nama;
    }
    // Pengurus inti
    if (proker.penanggung_jawab) {
      const jabatan = proker.penanggung_jawab.jabatan.toLowerCase();
      if (jabatan.includes('ketua') && !jabatan.includes('wakil')) return 'Ketua';
      if (jabatan.includes('wakil')) return 'Wakil Ketua';
      if (jabatan.includes('sekretaris')) return 'Sekretaris';
      if (jabatan.includes('bendahara')) return 'Bendahara';
    }
    return 'Pengurus Inti';
  };

  // Filter anggota berdasarkan divisi_id yang dipilih
  const getFilteredAnggota = () => {
    if (!formData.divisi_id) return anggotaList;

    // Untuk pengurus inti
    if (['ketua', 'wakil', 'sekretaris', 'bendahara'].includes(formData.divisi_id)) {
      return anggotaList.filter(anggota => {
        const jabatan = anggota.jabatan.toLowerCase();
        if (formData.divisi_id === 'ketua' && jabatan.includes('ketua') && !jabatan.includes('wakil')) return true;
        if (formData.divisi_id === 'wakil' && jabatan.includes('wakil')) return true;
        if (formData.divisi_id === 'sekretaris' && jabatan.includes('sekretaris')) return true;
        if (formData.divisi_id === 'bendahara' && jabatan.includes('bendahara')) return true;
        return false;
      });
    }

    // Untuk divisi
    return anggotaList.filter(anggota => anggota.divisi_id === formData.divisi_id);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Program Kerja">
      <div className="mb-6">
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Tambah Proker
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : prokerList.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardList className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500">Belum ada program kerja</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prokerList.map((proker) => (
            <div
              key={proker.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Foto Banner */}
              {proker.foto_url ? (
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={getFotoProkerUrl(proker.foto_url) || ''}
                    alt={proker.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-blue-300" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {proker.nama}
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      <Layers className="h-3 w-3" />
                      {getDivisiLabel(proker)}
                    </span>
                  </div>
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>

                {/* Deskripsi */}
                {proker.deskripsi && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {proker.deskripsi}
                  </p>
                )}

                {/* Info */}
                <div className="space-y-2 mb-4">
                  {proker.penanggung_jawab && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">
                        {proker.penanggung_jawab.nama}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingProker ? 'Edit Proker' : 'Tambah Proker'}
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
                    Foto/Banner Program Kerja
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
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
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
                    Nama Program Kerja *
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                    placeholder="Contoh: Seminar Nasional Teknik Industri"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Divisi/Pengurus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Divisi/Pengurus Inti *
                  </label>
                  <select
                    value={formData.divisi_id}
                    onChange={(e) =>
                      setFormData({ 
                        ...formData, 
                        divisi_id: e.target.value,
                        penanggung_jawab_id: '' // Reset PJ saat ganti divisi
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Divisi/Pengurus --</option>
                    <optgroup label="Pengurus Inti">
                      <option value="ketua">Ketua</option>
                      <option value="wakil">Wakil Ketua</option>
                      <option value="sekretaris">Sekretaris</option>
                      <option value="bendahara">Bendahara</option>
                    </optgroup>
                    <optgroup label="Divisi">
                      {filterOptions
                        .filter(opt => opt.type === 'divisi')
                        .map((opt) => (
                          <option key={opt.id} value={opt.id || ''}>
                            {opt.name}
                          </option>
                        ))}
                    </optgroup>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.divisi_id}
                  >
                    <option value="">-- {formData.divisi_id ? 'Pilih PJ' : 'Pilih Divisi Dulu'} --</option>
                    {getFilteredAnggota().map((anggota) => (
                      <option key={anggota.id} value={anggota.id}>
                        {anggota.nama} - {anggota.jabatan}
                      </option>
                    ))}
                  </select>
                  {formData.divisi_id && getFilteredAnggota().length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Belum ada anggota di {['ketua', 'wakil', 'sekretaris', 'bendahara'].includes(formData.divisi_id) ? 'posisi ini' : 'divisi ini'}
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
                    placeholder="Deskripsi lengkap program kerja..."
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
                    onChange={(e) =>
                      setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    disabled={loading || uploading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
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