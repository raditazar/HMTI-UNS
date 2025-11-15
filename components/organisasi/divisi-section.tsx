'use client';

import { Divisi, Anggota } from '@/backend/config/supabase';
import { AnggotaCard } from './anggota-card';
import { Users } from 'lucide-react';

interface DivisiSectionProps {
  divisi: Divisi & { anggota: Anggota[] };
}

export function DivisiSection({ divisi }: DivisiSectionProps) {
  if (divisi.anggota.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Header Divisi */}
      <div className="mb-6 border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-transparent pl-6 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {divisi.nama}
            </h3>
            {divisi.deskripsi && (
              <p className="mt-1 text-sm text-gray-600">
                {divisi.deskripsi}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid Anggota */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {divisi.anggota.map((anggota) => (
          <AnggotaCard key={anggota.id} anggota={anggota} />
        ))}
      </div>
    </div>
  );
}
