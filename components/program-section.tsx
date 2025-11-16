'use client';

import { FloatUp } from './animations/float-up';
import { Play, Calendar, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ProgramSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const mainProgram = {
    title: 'Company Profile HMTI UNS 2024',
    description: 'Tonton video dokumentasi lengkap kegiatan dan program kerja HMTI UNS dalam mengembangkan potensi mahasiswa Teknik Industri.',
    videoId: 'SBjXMH2HHg8', // ID YouTube yang benar (tanpa parameter)
    thumbnail: 'https://img.youtube.com/vi/SBjXMH2HHg8/maxresdefault.jpg',
    date: 'Periode 2024/2025'
  };

  return (
    <section id="program" className="py-20 bg-gradient-to-b from-muted to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - Compact */}
        <FloatUp>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Play className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">PROGRAM KAMI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Aktivitas & Program Kerja
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Berbagai program menarik untuk mengembangkan potensi dan keterampilan mahasiswa
            </p>
          </div>
        </FloatUp>

        {/* Main Video - Enhanced Design */}
        <FloatUp delay={0.1}>
          <div className="max-w-5xl mx-auto">
            {/* Video Card with Gradient Border */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
              
              <div className="relative bg-background rounded-2xl overflow-hidden border-2 border-border hover:border-transparent transition-all duration-300 shadow-2xl">
                {/* Video Container */}
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${mainProgram.videoId}?autoplay=1`}
                      title={mainProgram.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={mainProgram.thumbnail}
                        alt={mainProgram.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Play Button Overlay */}
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/40 to-transparent hover:from-black/70 hover:via-black/50 transition-all group/play"
                        aria-label={`Play video: ${mainProgram.title}`}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 animate-ping" />
                          <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center transform group-hover/play:scale-110 transition-transform shadow-2xl">
                            <Play className="w-12 h-12 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </button>
                      {/* Date Badge */}
                      <div className="absolute top-6 right-6 bg-background/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-border shadow-lg">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{mainProgram.date}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Content - Side by Side with CTA */}
                <div className="p-8 bg-gradient-to-r from-background to-muted/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {mainProgram.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {mainProgram.description}
                      </p>
                    </div>
                    <a
                      href="/proker"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
                    >
                      <span>Lihat Semua</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FloatUp>
      </div>
    </section>
  );
}