'use client';

import { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { getStrukturOrganisasi, getAllAnggota } from '@/backend/api/organisasi/get-struktur';
import { getProkerStats } from '@/backend/api/proker/proker-api';
import { Building2, Layers, Users, Loader2, ClipboardList } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useProtectedRoute();
  const [stats, setStats] = useState({
    bidang: 0,
    divisi: 0,
    anggota: 0,
    pengurusInti: 0,
    proker: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [strukturRes, anggotaRes, prokerRes] = await Promise.all([
          getStrukturOrganisasi(),
          getAllAnggota(),
          getProkerStats(),
        ]);

        if (strukturRes.success && anggotaRes.success) {
          const bidangCount = strukturRes.data?.length || 0;
          const divisiCount = strukturRes.data?.reduce(
            (acc, str) => acc + str.divisi.length,
            0
          ) || 0;
          const pengurusIntiCount = anggotaRes.data?.filter(
            (a) => a.divisi_id === null
          ).length || 0;

          setStats({
            bidang: bidangCount,
            divisi: divisiCount,
            anggota: anggotaRes.data?.length || 0,
            pengurusInti: pengurusIntiCount,
            proker: prokerRes.success ? prokerRes.data?.total || 0 : 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Bidang',
      value: stats.bidang,
      icon: Building2,
      color: 'bg-blue-500',
      href: '/admin/bidang',
    },
    {
      label: 'Total Divisi',
      value: stats.divisi,
      icon: Layers,
      color: 'bg-green-500',
      href: '/admin/divisi',
    },
    {
      label: 'Total Anggota',
      value: stats.anggota,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/anggota',
    },
    {
      label: 'Pengurus Inti',
      value: stats.pengurusInti,
      icon: Users,
      color: 'bg-amber-500',
      href: '/admin/anggota',
    },
    {
      label: 'Total Proker',
      value: stats.proker,
      icon: ClipboardList,
      color: 'bg-indigo-500',
      href: '/admin/proker',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aksi Cepat
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/bidang"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="font-medium text-gray-900">Kelola Bidang</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tambah, edit, atau hapus bidang
                </p>
              </Link>

              <Link
                href="/admin/divisi"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
              >
                <Layers className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="font-medium text-gray-900">Kelola Divisi</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tambah, edit, atau hapus divisi
                </p>
              </Link>

              <Link
                href="/admin/anggota"
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
              >
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="font-medium text-gray-900">Kelola Anggota</p>
                <p className="text-sm text-gray-500 mt-1">
                  Tambah, edit, upload foto anggota
                </p>
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Kelola struktur organisasi Anda dengan mudah.
              Mulai dari menambahkan bidang, kemudian divisi, lalu anggota.
            </p>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
