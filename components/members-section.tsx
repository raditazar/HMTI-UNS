'use client';

import { FloatUp } from './animations/float-up';
import { Users, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase, type Anggota } from '@/backend/config/supabase';
import { getFotoUrl } from '@/backend/api/organisasi/get-struktur';

export default function MembersSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [members, setMembers] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch members dari database
  useEffect(() => {
    async function fetchMembers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('anggota')
          .select(`
            *,
            divisi:divisi_id (
              nama,
              bidang:bidang_id (
                nama
              )
            )
          `)
          .order('urutan', { ascending: true });

        if (error) throw error;

        setMembers(data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError('Gagal memuat data anggota');
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();

    // Real-time subscription untuk update otomatis
    const channel = supabase
      .channel('anggota-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'anggota',
        },
        () => {
          // Reload data saat ada perubahan
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Duplicate members untuk seamless loop
  const duplicatedMembers = [...members, ...members];

  // Loading state
  if (loading) {
    return (
      <section id="members" className="py-20 bg-gradient-to-b from-background to-muted relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-primary font-semibold">Memuat Data...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="members" className="py-20 bg-gradient-to-b from-background to-muted relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (members.length === 0) {
    return (
      <section id="members" className="py-20 bg-gradient-to-b from-background to-muted relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-foreground/70">Belum ada data anggota</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="members" className="py-20 bg-gradient-to-b from-background to-muted relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FloatUp>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">KELUARGA BESAR KAMI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Anggota HMTI UNS
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              {members.length}+ mahasiswa aktif yang berdedikasi untuk kemajuan bersama
            </p>
          </div>
        </FloatUp>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div
            className="flex gap-6 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={`flex gap-6 ${isPaused ? '[animation-play-state:paused]' : ''}`}
              style={{
                animation: 'scroll 60s linear infinite',
              }}
            >
              {duplicatedMembers.map((member, index) => (
                <div
                  key={`${member.id}-${index}`}
                  className="flex-shrink-0 w-64 group"
                >
                  <div className="relative bg-background rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl">
                    {/* Image Container */}
                    <div className="relative h-80 bg-muted overflow-hidden">
                      {member.foto_url ? (
                        <img
                          src={getFotoUrl(member.foto_url) || ''}
                          alt={member.nama}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback jika gambar gagal load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                  <svg class="w-24 h-24 text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                  </svg>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                          <User className="w-24 h-24 text-muted-foreground/30" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Angkatan Badge */}
                      <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                        <span className="text-xs font-bold text-white">
                          {member.angkatan}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-gradient-to-br from-background to-muted/30">
                      <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {member.nama}
                      </h3>
                      <p className="text-sm text-foreground/70 truncate mt-1">
                        {member.jabatan}
                      </p>
                      {member.divisi && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {member.divisi.nama}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pause Indicator */}
          {isPaused && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-lg">
              <p className="text-xs text-foreground/70 font-medium">
                Hover to pause • Scroll dihentikan sementara
              </p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <FloatUp delay={0.2}>
          <div className="text-center mt-12">
            <a
              href="/organisasi"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              <span>Lihat Struktur Organisasi Lengkap</span>
            </a>
          </div>
        </FloatUp>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}