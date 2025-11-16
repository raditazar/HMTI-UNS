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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
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
              <div className="font-bold text-lg text-foreground">HMTI UNS</div>
              <div className="text-xs text-muted-foreground">Teknik Industri</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div 
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setShowProkerDropdown(true)}
                  onMouseLeave={() => setShowProkerDropdown(false)}
                >
                  <button className="text-foreground/80 hover:text-primary font-medium transition-colors flex items-center gap-1">
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${showProkerDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* FIX: Tambah padding dan z-index tinggi */}
                  {showProkerDropdown && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="w-48 bg-background/95 backdrop-blur-md rounded-lg shadow-xl border border-border overflow-hidden">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-3 text-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors"
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
                  className="text-foreground/80 hover:text-primary font-medium transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              )
            ))}
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Panel
                  </Button>
                </Link>
                <Button onClick={signOut} variant="ghost" size="sm">
                  Keluar
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">
                  Login Admin
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.label}>
                    <p className="text-foreground/60 font-medium text-sm px-4 py-2">
                      {link.label}
                    </p>
                    <div className="pl-4">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-foreground/80 hover:text-primary font-medium transition-colors px-4 py-2"
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
                    className="text-foreground/80 hover:text-primary font-medium transition-colors px-4 py-2"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Admin Panel
                    </Button>
                  </Link>
                  <Button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} variant="ghost" size="sm" className="w-full">
                    Keluar
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
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