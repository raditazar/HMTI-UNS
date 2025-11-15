export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold">TI</span>
              </div>
              <span className="font-bold">Himpunan TI UNS</span>
            </div>
            <p className="text-background/70 text-sm">
              Organisasi mahasiswa yang membangun masa depan industri Indonesia
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Menu</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#home" className="hover:text-background transition-colors">Beranda</a></li>
              <li><a href="#about" className="hover:text-background transition-colors">Tentang</a></li>
              <li><a href="#program" className="hover:text-background transition-colors">Program</a></li>
              <li><a href="#members" className="hover:text-background transition-colors">Pengurus</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Sosial Media</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-background transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold mb-4">Info</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Syarat Penggunaan</a></li>
              <li><a href="#" className="hover:text-background transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-background/70">
            <p>&copy; {currentYear} Himpunan Teknik Industri UNS. All rights reserved.</p>
            <p>Dibuat dengan ❤️ oleh Tim Himpunan</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
