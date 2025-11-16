'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProkerDropdown, setShowProkerDropdown] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/#home', label: 'Beranda' },
    { href: '/#about', label: 'Tentang' },
    { href: '/organisasi', label: 'Organisasi' },
    { 
      label: 'Program Kerja',
      dropdown: [
        { href: '/proker/bidang', label: 'Proker Bidang' },
        { href: '/proker/divisi', label: 'Proker Divisi' },
      ]
    },
    { href: '/#contact', label: 'Kontak' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${
        isScrolled
          ? 'shadow-lg shadow-[#001d3d]/10'
          : 'shadow-md shadow-[#001d3d]/5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image
                src="/logo hmti.png"
                alt="Logo HMTI UNS"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden md:block">
              <div className="font-bold text-lg text-[#001d3d]">HMTI UNS</div>
              <div className="text-xs text-[#001d3d]/70">Teknik Industri</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div 
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setShowProkerDropdown(true)}
                  onMouseLeave={() => setShowProkerDropdown(false)}
                >
                  <button className="text-[#001d3d]/80 hover:text-[#003d7a] font-medium transition-colors flex items-center gap-1 relative group/btn">
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProkerDropdown ? 'rotate-180' : ''}`} />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#003d7a] to-[#1a7aa0] transition-all group-hover/btn:w-full" />
                  </button>
                  
                  {showProkerDropdown && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border-2 border-[#003d7a]/10 overflow-hidden">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 text-[#001d3d]/80 hover:bg-gradient-to-r hover:from-[#003d7a]/10 hover:to-[#1a7aa0]/10 hover:text-[#001d3d] transition-all border-l-2 border-transparent hover:border-[#003d7a]"
                            onClick={() => setShowProkerDropdown(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#001d3d]/80 hover:text-[#003d7a] font-medium transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#003d7a] to-[#1a7aa0] transition-all group-hover:w-full" />
                </Link>
              )
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#003d7a]/30 text-[#001d3d] hover:bg-[#003d7a]/10 hover:border-[#003d7a]"
                  >
                    Admin Panel
                  </Button>
                </Link>
                <Button 
                  onClick={signOut} 
                  variant="ghost" 
                  size="sm"
                  className="text-[#001d3d]/70 hover:text-[#003d7a] hover:bg-[#003d7a]/5"
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-[#003d7a] to-[#1a7aa0] hover:from-[#004d99] hover:to-[#2089b3] text-white shadow-lg shadow-[#003d7a]/30 hover:shadow-xl hover:shadow-[#003d7a]/40"
                >
                  Login Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#003d7a]/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#001d3d]" />
            ) : (
              <Menu className="w-6 h-6 text-[#001d3d]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#003d7a]/20 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.label}>
                    <p className="text-[#001d3d]/60 font-medium text-sm px-4 py-2">
                      {link.label}
                    </p>
                    <div className="pl-4">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-[#001d3d]/80 hover:text-[#003d7a] font-medium transition-colors px-4 py-2 hover:bg-[#003d7a]/5 rounded-lg"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#001d3d]/80 hover:text-[#003d7a] font-medium transition-colors px-4 py-2 hover:bg-[#003d7a]/5 rounded-lg"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-[#003d7a]/30 text-[#001d3d] hover:bg-[#003d7a]/10"
                    >
                      Admin Panel
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }} 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-[#001d3d]/70 hover:text-[#003d7a] hover:bg-[#003d7a]/5"
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-[#003d7a] to-[#1a7aa0] hover:from-[#004d99] hover:to-[#2089b3] text-white"
                  >
                    Login Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}