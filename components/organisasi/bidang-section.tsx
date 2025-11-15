'use client';

import { StrukturOrganisasi } from '@/backend/config/supabase';
import { DivisiSection } from './divisi-section';
import { Building2 } from 'lucide-react';

interface BidangSectionProps {
  struktur: StrukturOrganisasi;
}

export function BidangSection({ struktur }: BidangSectionProps) {
  const { bidang, divisi } = struktur;

  // Jangan tampilkan jika tidak ada divisi dengan anggota
  const hasAnggota = divisi.some((div) => div.anggota.length > 0);
  if (!hasAnggota) return null;

  return (
    <section className="mb-16">
      {/* Header Bidang */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 shadow-lg">
          <Building2 className="h-8 w-8 text-white" />
          <h2 className="text-3xl font-bold text-white">
            {bidang.nama}
          </h2>
        </div>
        {bidang.deskripsi && (
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {bidang.deskripsi}
          </p>
        )}
      </div>

      {/* Divisi dalam Bidang */}
      <div className="space-y-8">
        {divisi.map((div) => (
          <DivisiSection key={div.id} divisi={div} />
        ))}
      </div>
    </section>
  );
}
