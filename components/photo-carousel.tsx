'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const photos = [
    {
      id: 1,
      title: 'Himpunan Teknik Industri UNS',
      subtitle: 'Bersama membangun masa depan industri',
      image: '/teknik-industri-kampus-suasana-bersama.jpg',
      color: 'from-blue-600/40',
    },
    {
      id: 2,
      title: 'Program Kerja & Kegiatan',
      subtitle: 'Mengembangkan potensi dan keterampilan',
      image: '/mahasiswa-teknik-industri-workshop-presentasi.jpg',
      color: 'from-indigo-600/40',
    },
    {
      id: 3,
      title: 'Keluarga Besar Kami',
      subtitle: 'Solidaritas dan kolaborasi tanpa batas',
      image: '/kelompok-mahasiswa-berpose-bersama-anggota-organis.jpg',
      color: 'from-purple-600/40',
    },
  ]

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, photos.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
    setIsAutoPlay(false)
  }

  return (
    <div id="home" className="relative w-full h-screen bg-muted overflow-hidden pt-16">
      {/* Slides */}
      <div className="relative w-full h-full">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={photo.image || "/placeholder.svg"}
              alt={photo.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${photo.color} to-background/80`} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                  {photo.title}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
                  {photo.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlay(false)
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  )
}
