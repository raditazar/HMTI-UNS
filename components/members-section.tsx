export default function MembersSection() {
  const members = [
    {
      id: 1,
      name: 'Ketua Himpunan',
      role: 'Pemimpin Organisasi',
      image: '/mahasiswa-pria-profesional.jpg',
    },
    {
      id: 2,
      name: 'Wakil Ketua',
      role: 'Koordinator Program',
      image: '/mahasiswa-wanita-profesional.jpg',
    },
    {
      id: 3,
      name: 'Sekretaris',
      role: 'Pengelola Administrasi',
      image: '/mahasiswa-profesional.jpg',
    },
    {
      id: 4,
      name: 'Bendahara',
      role: 'Pengelola Keuangan',
      image: '/mahasiswa-kerja-sama-tim.jpg',
    },
  ]

  return (
    <section id="members" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold">PENGURUS</span>
          <h2 className="text-4xl font-bold text-foreground mt-4 mb-4">
            Keluarga Besar Kami
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Pengurus dan anggota yang berdedikasi untuk kesuksesan bersama
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="text-center group"
            >
              <div className="mb-4 overflow-hidden rounded-xl h-64">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {member.name}
              </h3>
              <p className="text-foreground/70 text-sm mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
