'use client';

import { FloatUp } from './animations/float-up';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PhotoCarousel() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FloatUp>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-4">
              <span className="text-md font-medium text-primary">Selamat Datang</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              Himpunan Mahasiswa 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Teknik Industri UNS</span>
            </h1>

            <p className="text-4xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Inklusif, Adaptif, Kolaboratif
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/organisasi"
                className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
              >
                Kenali Kami
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/proker"
                className="inline-flex items-center justify-center gap-2 bg-background border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-all hover:scale-105"
              >
                Lihat Program Kerja
              </Link>
            </div>
          </div>
        </FloatUp>
      </div>
    </section>
  );
}