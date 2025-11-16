'use client';

import { useState, useEffect } from 'react';
import { FloatUp } from './animations/float-up';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const photos = [
  '/carousel/carousel0.jpg',
  '/carousel/carousel1.jpg',
  '/carousel/carousel2.jpg',
  '/carousel/carousel3.jpg',
  '/carousel/carousel4.jpg',
  '/carousel/carousel5.jpg',
  '/carousel/carousel6.jpg',
  '/carousel/carousel7.jpg',
  '/carousel/carousel8.jpg',
  '/carousel/carousel9.jpg',
  '/carousel/carousel10.jpg',
];

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 5000); // Ganti foto setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Photo Carousel */}
      <div className="absolute inset-0 w-full h-full">
        {photos.map((photo, index) => (
          <div
            key={photo}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={photo}
              alt={`HMTI UNS ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
        
        {/* Navy Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001d3d]/90 via-[#003d7a]/80 to-[#1a7aa0]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000d1a]/70 via-transparent to-[#001d3d]/50" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#003d7a]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#1a7aa0]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Dots Indicator - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-10 h-2.5 rounded-full bg-gradient-to-r from-[#003d7a] via-[#1a7aa0] to-[#1e9baa] shadow-lg shadow-[#003d7a]/50'
                : 'w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white/70 hover:w-6'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <FloatUp>
          <div className={`text-center max-w-4xl mx-auto transition-all duration-700 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/20 hover:bg-[#003d7a]/30 transition-all duration-300 shadow-lg">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1e9baa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1e9baa] shadow-lg shadow-[#1e9baa]/50"></span>
              </span>
              <span className="text-sm md:text-base font-semibold text-white">Selamat Datang di HMTI UNS</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Himpunan Mahasiswa
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5a9fd4] via-[#1a7aa0] to-[#1e9baa] animate-gradient-x drop-shadow-none">
                Teknik Industri UNS
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-3xl lg:text-4xl text-white/95 mb-8 max-w-2xl mx-auto font-light drop-shadow-lg">
              Inklusif, Adaptif, Kolaboratif
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/organisasi"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#761f8f] to-[#1a7aa0] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#004d99] hover:to-[#2089b3] transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-[#003d7a]/50"
              >
                Kenali Kami
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/proker/divisi"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#003d7a]/40 hover:border-[#1a7aa0] transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Lihat Program Kerja
              </Link>
            </div>

    
          </div>
        </FloatUp>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2 backdrop-blur-sm bg-white/5">
          <div className="w-1.5 h-3 bg-gradient-to-b from-[#1a7aa0] to-[#1e9baa] rounded-full animate-pulse shadow-lg shadow-[#1a7aa0]/50" />
        </div>
      </div>

      {/* CSS Animation for gradient text */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s ease infinite;
        }
      `}</style>
    </section>
  );
}