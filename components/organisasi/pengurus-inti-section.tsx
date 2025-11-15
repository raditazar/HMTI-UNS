'use client';

import { Anggota } from '@/backend/config/supabase';
import { AnggotaCard } from './anggota-card';
import { Crown } from 'lucide-react';

interface PengurusIntiSectionProps {
  pengurusInti: Anggota[];
}

export function PengurusIntiSection({ pengurusInti }: PengurusIntiSectionProps) {
  if (pengurusInti.length === 0) return null;

  return (
    <section className="mb-20">
      {/* Header Pengurus Inti */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 shadow-xl">
          <Crown className="h-8 w-8 text-white" />
          <h2 className="text-3xl font-bold text-white">
            Pengurus Inti
          </h2>
        </div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Kepemimpinan organisasi yang bertanggung jawab atas arah dan kebijakan strategis
        </p>
      </div>

      {/* Grid Pengurus Inti - Layout khusus */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {pengurusInti.map((anggota) => (
          <AnggotaCard key={anggota.id} anggota={anggota} />
        ))}
      </div>

      {/* Separator */}
      <div className="mt-16 mb-12 flex items-center justify-center">
        <div className="h-1 w-full max-w-md bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full" />
      </div>
    </section>
  );
}
