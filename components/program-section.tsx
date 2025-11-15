export default function ProgramSection() {
  const programs = [
    {
      id: 1,
      title: 'Seminar & Workshop',
      description: 'Program edukasi dengan pembicara dari industri terkemuka untuk meningkatkan pengetahuan teknik industri',
      icon: '📊',
    },
    {
      id: 2,
      title: 'Compfest & Kompetisi',
      description: 'Ajang kompetisi untuk mengasah kemampuan analitik dan problem solving mahasiswa',
      icon: '🏆',
    },
    {
      id: 3,
      title: 'Career Development',
      description: 'Program bimbingan karir dan job matching dengan perusahaan-perusahaan partner',
      icon: '💼',
    },
    {
      id: 4,
      title: 'Community Service',
      description: 'Kegiatan pengabdian masyarakat dan pemberdayaan ekonomi lokal',
      icon: '🤝',
    },
    {
      id: 5,
      title: 'Networking Events',
      description: 'Acara networking dengan alumni dan profesional di bidang teknik industri',
      icon: '🌐',
    },
    {
      id: 6,
      title: 'Study Club',
      description: 'Kelompok belajar untuk membahas materi kuliah dan isu-isu industri terkini',
      icon: '📚',
    },
  ]

  return (
    <section id="program" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold">PROGRAM KAMI</span>
          <h2 className="text-4xl font-bold text-foreground mt-4 mb-4">
            Aktivitas & Program Kerja
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Berbagai program menarik dirancang untuk mengembangkan potensi dan keterampilan anggota
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-background rounded-xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-300"
            >
              <div className="text-5xl mb-4">{program.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {program.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
