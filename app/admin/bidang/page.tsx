'use client';

import { useState, useEffect } from 'react';
import { supabase, type Bidang, type Anggota } from '@/backend/config/supabase';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit2, Trash2, User } from 'lucide-react';

// Type untuk bidang dengan relasi kepala_bidang
interface BidangWithKepala extends Bidang {
  kepala_bidang?: Anggota | null;
}

export default function BidangAdminPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [bidangList, setBidangList] = useState<BidangWithKepala[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBidang, setEditingBidang] = useState<BidangWithKepala | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    kepala_bidang_id: '',
    urutan: 0,
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch bidang dengan kepala bidang menggunakan LEFT JOIN
      const { data: bidang, error: bidangError } = await supabase
        .from('bidang')
        .select(`
          id,
          nama,
          deskripsi,
          urutan,
          kepala_bidang_id,
          created_at,
          updated_at,
          kepala_bidang:kepala_bidang_id(
            id,
            nama,
            jabatan,
            angkatan,
            divisi_id,
            foto_url,
            email,
            telepon,
            bio,
            urutan,
            created_at,
            updated_at
          )
        `)
        .order('urutan', { ascending: true });

      if (bidangError) {
        console.error('Error fetching bidang:', bidangError);
      }

      // Fetch semua anggota untuk dropdown
      const { data: anggota, error: anggotaError } = await supabase
        .from('anggota')
        .select('*')
        .order('nama', { ascending: true });

      if (anggotaError) {
        console.error('Error fetching anggota:', anggotaError);
      }

      if (bidang) {
        // Transform data to match BidangWithKepala type
        const transformedBidang: BidangWithKepala[] = bidang.map(b => ({
          id: b.id,
          nama: b.nama,
          deskripsi: b.deskripsi,
          urutan: b.urutan,
          kepala_bidang_id: b.kepala_bidang_id,
          created_at: b.created_at,
          updated_at: b.updated_at,
          kepala_bidang: Array.isArray(b.kepala_bidang) 
            ? b.kepala_bidang[0] || null 
            : b.kepala_bidang || null,
        }));
        setBidangList(transformedBidang);
      }
      
      if (anggota) {
        setAnggotaList(anggota);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);

      const data = {
        nama: formData.nama,
        deskripsi: formData.deskripsi || null,
        kepala_bidang_id: formData.kepala_bidang_id || null,
        urutan: formData.urutan,
        updated_at: new Date().toISOString(),
      };

      if (editingBidang) {
        const { error } = await supabase
          .from('bidang')
          .update(data)
          .eq('id', editingBidang.id);

        if (error) {
          console.error('Error updating bidang:', error);
          alert('Gagal mengupdate bidang: ' + error.message);
          return;
        }
      } else {
        const { error } = await supabase
          .from('bidang')
          .insert([{
            ...data,
            created_at: new Date().toISOString(),
          }]);

        if (error) {
          console.error('Error creating bidang:', error);
          alert('Gagal membuat bidang: ' + error.message);
          return;
        }
      }

      setShowModal(false);
      resetForm();
      await fetchData();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin hapus bidang ini? Semua divisi di bidang ini juga akan terhapus.')) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('bidang')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting bidang:', error);
        alert('Gagal menghapus bidang: ' + error.message);
        return;
      }

      await fetchData();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      alert('Terjadi kesalahan saat menghapus data');
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(bidang: BidangWithKepala) {
    setEditingBidang(bidang);
    setFormData({
      nama: bidang.nama,
      deskripsi: bidang.deskripsi || '',
      kepala_bidang_id: bidang.kepala_bidang_id || '',
      urutan: bidang.urutan,
    });
    setShowModal(true);
  }

  function resetForm() {
    setEditingBidang(null);
    setFormData({
      nama: '',
      deskripsi: '',
      kepala_bidang_id: '',
      urutan: bidangList.length,
    });
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Bidang">
      <div className="mb-6">
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Tambah Bidang
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : bidangList.length === 0 ? (
        <div className="text-center py-20">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada data bidang</p>
          <p className="text-gray-400 text-sm mt-2">Klik tombol "Tambah Bidang" untuk menambah data</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bidangList.map((bidang) => (
            <div
              key={bidang.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {bidang.nama}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Urutan: {bidang.urutan}
                    </span>
                  </div>
                  
                  {bidang.deskripsi && (
                    <p className="text-gray-600 mb-3">{bidang.deskripsi}</p>
                  )}
                  
                  {bidang.kepala_bidang ? (
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Kepala Bidang</p>
                        <p className="text-sm font-semibold text-blue-700">
                          {bidang.kepala_bidang.nama}
                        </p>
                        <p className="text-xs text-blue-600">
                          {bidang.kepala_bidang.jabatan}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Belum ada kepala bidang</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditModal(bidang)}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 border-blue-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(bidang.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
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
          <div className="bg-white rounded-xl max-w-lg w-full my-8 shadow-2xl">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {editingBidang ? 'Edit Bidang' : 'Tambah Bidang Baru'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Bidang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                    placeholder="Contoh: Bidang Akademik"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    placeholder="Deskripsi singkat tentang bidang ini..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kepala Bidang
                  </label>
                  <select
                    value={formData.kepala_bidang_id}
                    onChange={(e) => setFormData({ ...formData, kepala_bidang_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="">-- Pilih Kepala Bidang (Opsional) --</option>
                    {anggotaList.map((anggota) => (
                      <option key={anggota.id} value={anggota.id}>
                        {anggota.nama} - {anggota.jabatan} ({anggota.angkatan})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih anggota yang akan menjadi kepala bidang
                  </p>
                </div>

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
                  <p className="text-xs text-gray-500 mt-1">
                    Urutan tampilan bidang di halaman organisasi (semakin kecil, semakin atas)
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
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
                      editingBidang ? 'Update Bidang' : 'Tambah Bidang'
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