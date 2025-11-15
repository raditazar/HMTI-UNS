'use client';

import { Anggota } from '@/backend/config/supabase';
import { getFotoUrl } from '@/backend/api/organisasi/get-struktur';
import { User, Mail, Phone } from 'lucide-react';

interface AnggotaCardProps {
  anggota: Anggota;
}

export function AnggotaCard({ anggota }: AnggotaCardProps) {
  const fotoUrl = getFotoUrl(anggota.foto_url);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Foto Profil */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={anggota.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="h-24 w-24 text-blue-300" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Angkatan Badge */}
        <div className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow-lg">
          {anggota.angkatan}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-5">
        {/* Nama */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
          {anggota.nama}
        </h3>

        {/* Jabatan */}
        <p className="mt-1 text-sm font-medium text-blue-600">
          {anggota.jabatan}
        </p>

        {/* Divisi Info */}
        {anggota.divisi && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-gray-500">
              {anggota.divisi.nama}
            </p>
            {anggota.divisi.bidang && (
              <p className="text-xs text-gray-400">
                {anggota.divisi.bidang.nama}
              </p>
            )}
          </div>
        )}

        {/* Bio */}
        {anggota.bio && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-3">
            {anggota.bio}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          {anggota.email && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Mail className="h-4 w-4 text-blue-500" />
              <span className="truncate">{anggota.email}</span>
            </div>
          )}
          {anggota.telepon && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Phone className="h-4 w-4 text-blue-500" />
              <span>{anggota.telepon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
