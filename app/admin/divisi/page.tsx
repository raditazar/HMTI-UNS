'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { getStrukturOrganisasi } from '@/backend/api/organisasi/get-struktur';
import { createDivisi, updateDivisi, deleteDivisi } from '@/backend/api/organisasi/admin-crud';
import { Bidang, Divisi } from '@/backend/config/supabase';
import { Loader2, Plus, Edit2, Trash2, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DivisiAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<Divisi | null>(null);

  const [formData, setFormData] = useState({
    bidang_id: '',
    nama: '',
    deskripsi: '',
    urutan: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getStrukturOrganisasi();
      if (res.success) {
        const allBidang: Bidang[] = [];
        const allDivisi: Divisi[] = [];

        res.data?.forEach((str) => {
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

    const result = editingDivisi
      ? await updateDivisi(editingDivisi.id, formData)
      : await createDivisi(formData);

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
    if (!confirm('Yakin ingin menghapus divisi ini? Anggota di divisi ini akan kehilangan divisi.')) return;

    setLoading(true);
    const result = await deleteDivisi(id);
    if (result.success) {
      fetchData();
    } else {
      alert(`Error: ${result.error}`);
      setLoading(false);
    }
  };

  const openEditModal = (divisi: Divisi) => {
    setEditingDivisi(divisi);
    setFormData({
      bidang_id: divisi.bidang_id,
      nama: divisi.nama,
      deskripsi: divisi.deskripsi || '',
      urutan: divisi.urutan,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingDivisi(null);
    setFormData({
      bidang_id: '',
      nama: '',
      deskripsi: '',
      urutan: divisiList.length,
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
    <AdminLayout title="Kelola Divisi">
      <div className="mb-6">
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Tambah Divisi
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {divisiList.map((divisi) => (
            <div
              key={divisi.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Layers className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{divisi.nama}</h3>
                  <p className="text-sm text-gray-500">Urutan: {divisi.urutan}</p>
                </div>
              </div>

              {divisi.bidang && (
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {divisi.bidang.nama}
                  </span>
                </div>
              )}

              {divisi.deskripsi && (
                <p className="text-sm text-gray-600 mb-4">{divisi.deskripsi}</p>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => openEditModal(divisi)}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(divisi.id)}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingDivisi ? 'Edit Divisi' : 'Tambah Divisi'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bidang *
                  </label>
                  <select
                    value={formData.bidang_id}
                    onChange={(e) => setFormData({ ...formData, bidang_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Bidang --</option>
                    {bidangList.map((bidang) => (
                      <option key={bidang.id} value={bidang.id}>
                        {bidang.nama}
                      </option>
                    ))}
                  </select>
                  {bidangList.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Buat bidang terlebih dahulu</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Divisi *
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    placeholder="Contoh: Sekretaris"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={3}
                    placeholder="Deskripsi singkat tentang divisi ini..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

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
                  <p className="text-xs text-gray-500 mt-1">Semakin kecil, semakin di atas</p>
                </div>

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
                    disabled={loading || bidangList.length === 0}
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
