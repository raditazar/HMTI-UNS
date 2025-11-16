'use client';

import { useProtectedRoute } from '@/hooks/use-protected-route';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Building2, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProkerMenuPage() {
  const { user, loading: authLoading } = useProtectedRoute();

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Program Kerja">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Proker Bidang */}
        <Link
          href="/admin/proker/bidang"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Program Kerja Bidang
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Kelola program kerja tingkat bidang yang melibatkan seluruh divisi dalam bidang tersebut.
            </p>

            <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all">
              Kelola Proker Bidang
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-green-200 rounded-full opacity-30 group-hover:scale-150 transition-transform"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-green-300 rounded-full opacity-20 group-hover:scale-150 transition-transform"></div>
        </Link>

        {/* Proker Divisi */}
        <Link
          href="/admin/proker/divisi"
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Layers className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Program Kerja Divisi
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              Kelola program kerja per divisi dan pengurus inti (Ketua, Wakil, Sekretaris, Bendahara).
            </p>

            <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
              Kelola Proker Divisi
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-200 rounded-full opacity-30 group-hover:scale-150 transition-transform"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-300 rounded-full opacity-20 group-hover:scale-150 transition-transform"></div>
        </Link>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-4xl">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-green-600" />
            Proker Bidang
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Proker yang melibatkan seluruh divisi dalam satu bidang</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Koordinasi oleh Kepala Bidang atau anggota divisi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Contoh: Pelatihan Leadership Tingkat Bidang</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Proker Divisi
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Proker per divisi atau pengurus inti</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Filter: Ketua, Wakil, Sekretaris, Bendahara, atau Divisi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">✓</span>
              <span>Contoh: Seminar Nasional, Rapat Kerja</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}