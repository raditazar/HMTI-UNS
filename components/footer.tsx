import { FloatUp } from './animations/float-up';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <FloatUp>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 bg-background rounded-lg p-1">
                  <Image
                    src="/logo hmti.png"
                    alt="Logo HMTI UNS"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="font-bold text-lg">HMTI UNS</div>
                  <div className="text-xs text-background/70">Teknik Industri</div>
                </div>
              </div>
              <p className="text-background/70 text-sm leading-relaxed">
                Himpunan Mahasiswa Teknik Industri Universitas Sebelas Maret
              </p>
              
              {/* Social Media */}
              <div className="flex gap-3 mt-4">
                <a
                  href="#"
                  className="w-9 h-9 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-background/10 hover:bg-primary rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Menu Cepat</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <Link href="/#home" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/#about" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/organisasi" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Struktur Organisasi
                  </Link>
                </li>
                <li>
                  <Link href="/proker" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Program Kerja
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-4">Kontak Kami</h4>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>info@hmti.uns.ac.id</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Kampus UNS Jl. Ir. Sutami 36A, Surakarta, Jawa Tengah</span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4">Informasi</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>
                  <a href="#" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-background transition-colors hover:translate-x-1 inline-block">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </FloatUp>

        {/* Divider */}
        <FloatUp delay={0.2}>
          <div className="border-t border-background/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
              <p>
                &copy; {currentYear} Himpunan Mahasiswa Teknik Industri UNS. All rights reserved.
              </p>

            </div>
          </div>
        </FloatUp>
      </div>
    </footer>
  );
}