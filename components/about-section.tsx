export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="mb-4">
              <span className="text-primary font-semibold">TENTANG KAMI</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Himpunan Mahasiswa Teknik Industri
            </h2>
            <p className="text-foreground/70 text-lg leading-relaxed mb-4">
              Himpunan Mahasiswa Departemen Teknik Industri UNS adalah organisasi yang berkomitmen untuk mengembangkan potensi akademik dan keterampilan profesional mahasiswa Teknik Industri.
            </p>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Kami menyediakan platform untuk berbagi pengetahuan, mengembangkan jaringan profesional, dan berkontribusi pada kemajuan industri Indonesia.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-foreground/70">Anggota Aktif</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">20+</div>
                <div className="text-sm text-foreground/70">Program Tahunan</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-foreground/70">Kemitraan Industri</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 h-96 flex items-center justify-center">
              <img
                src="/kantor-himpunan-mahasiswa-kampus-interior.jpg"
                alt="Ruang Himpunan"
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
