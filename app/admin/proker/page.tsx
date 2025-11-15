'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { getAllProker, createProker, updateProker, deleteProker } from '@/backend/api/proker/proker-api';
import { getStrukturOrganisasi, getAllAnggota } from '@/backend/api/organisasi/get-struktur';
import { Proker, Divisi, Anggota } from '@/backend/config/supabase';
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  User,
  Layers,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProkerAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [prokerList, setProkerList] = useState<Proker[]>([]);
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProker, setEditingProker] = useState<Proker | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    divisi_id: '',
    penanggung_jawab_id: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status: 'planned' as Proker['status'],
    urutan: 0,
  });

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

      if (strukturRes.success) {
        const allDivisi: Divisi[] = [];
        strukturRes.data?.forEach((str) => {
          allDivisi.push(...str.divisi);
        });
        setDivisiList(allDivisi);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...formData,
      penanggung_jawab_id: formData.penanggung_jawab_id || null,
    };

    const result = editingProker
      ? await updateProker(editingProker.id, data)
      : await createProker(data);

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
    setFormData({
      nama: proker.nama,
      deskripsi: proker.deskripsi || '',
      divisi_id: proker.divisi_id,
      penanggung_jawab_id: proker.penanggung_jawab_id || '',
      tanggal_mulai: proker.tanggal_mulai || '',
      tanggal_selesai: proker.tanggal_selesai || '',
      status: proker.status,
      urutan: proker.urutan,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProker(null);
    setFormData({
      nama: '',
      deskripsi: '',
      divisi_id: '',
      penanggung_jawab_id: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status: 'planned',
      urutan: prokerList.length,
    });
  };

  const getStatusBadge = (status: Proker['status']) => {
    const badges = {
      planned: 'bg-gray-100 text-gray-700',
      ongoing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    const labels = {
      planned: 'Direncanakan',
      ongoing: 'Berjalan',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {prokerList.map((proker) => (
            <div
              key={proker.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {proker.nama}
                  </h3>
                  {getStatusBadge(proker.status)}
                </div>
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>

              {/* Deskripsi */}
              {proker.deskripsi && (
                <p className="text-sm text-gray-600 mb-4">
                  {proker.deskripsi}
                </p>
              )}

              {/* Info */}
              <div className="space-y-2 mb-4">
                {proker.divisi && (
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{proker.divisi.nama}</span>
                  </div>
                )}

                {proker.penanggung_jawab && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                      {proker.penanggung_jawab.nama}
                    </span>
                  </div>
                )}

                {(proker.tanggal_mulai || proker.tanggal_selesai) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">
                      {proker.tanggal_mulai &&
                        new Date(proker.tanggal_mulai).toLocaleDateString('id-ID')}
                      {proker.tanggal_mulai && proker.tanggal_selesai && ' - '}
                      {proker.tanggal_selesai &&
                        new Date(proker.tanggal_selesai).toLocaleDateString('id-ID')}
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

                {/* Divisi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Divisi *
                  </label>
                  <select
                    value={formData.divisi_id}
                    onChange={(e) =>
                      setFormData({ ...formData, divisi_id: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Divisi --</option>
                    {divisiList.map((divisi) => (
                      <option key={divisi.id} value={divisi.id}>
                        {divisi.nama}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Belum Ada PJ --</option>
                    {anggotaList.map((anggota) => (
                      <option key={anggota.id} value={anggota.id}>
                        {anggota.nama} - {anggota.jabatan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tanggal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_mulai}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggal_mulai: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_selesai}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggal_selesai: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as Proker['status'] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="planned">Direncanakan</option>
                    <option value="ongoing">Sedang Berjalan</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
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
                      setFormData({ ...formData, urutan: parseInt(e.target.value) })
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
