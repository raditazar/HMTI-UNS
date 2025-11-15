'use client'

import { useState } from 'react'
import { Menu, X, LogIn, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/auth-context'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const navItems = [
    { label: 'Beranda', href: '#home' },
    { label: 'Tentang', href: '#about' },
    { label: 'Program Kerja', href: '/proker' },
    { label: 'Organisasi', href: '/organisasi' },
    { label: 'Keluarga Besar', href: '#members' },
    { label: 'Kontak', href: '#contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">TI</span>
          </div>
          <span className="font-bold text-foreground hidden sm:inline">Himpunan TI UNS</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link href="/admin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin Panel
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Bergabung
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}

            {/* Mobile Login/Admin Button */}
            {user ? (
              <Link href="/admin" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Bergabung
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
