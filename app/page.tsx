'use client'

import { useState, useRef, useEffect } from 'react'
import Navigation from '@/components/navigation'
import PhotoCarousel from '@/components/photo-carousel'
import AboutSection from '@/components/about-section'
import ProgramSection from '@/components/program-section'
import MembersSection from '@/components/members-section'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="w-full">
      <Navigation />
      <PhotoCarousel />
      <AboutSection />
      <ProgramSection />
      <MembersSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
