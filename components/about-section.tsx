import { FloatUp } from './animations/float-up';
import { Counter } from './animations/counter';
import { Users, Award, Target, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  const stats = [
    { 
      value: 100, 
      suffix: '+',
      label: 'Anggota Aktif', 
      color: 'from-blue-500 to-blue-600',
      link: '/organisasi',
      linkText: 'Lihat Struktur'
    },
    { 
      value: 20, 
      suffix: '+',
      label: 'Program Tahunan', 
      color: 'from-purple-500 to-purple-600',
      link: '/proker',
      linkText: 'Lihat Program'
    },
  ];

  const visiMisi = {
    visi: "Terwujudnya HMTI yang profesional inklusif dan menjunjung nilai kekeluargaan dalam mendukung koordinasi dan pengembangan potensi mahasiswa",
    misi: [
      "Memperkuat keterhubungan harmonis antar pengurus maupun antar anggota dan juga keduanya",
      "Memfasilitasi juga mendorong pengembangan potensi minat-bakat mahasiswa Teknik Industri",
      "Menjalin kerjasama strategis antar-organisasi mahasiswa di Fakultas Teknik UNS sehingga tercipta sinergi yang kuat dan bermanfaat",
      "Memberikan manfaat keberlanjutan dalam pemenuhan kebutuhan dan memberikan dampak positif bagi mahasiswa Teknik Industri"
    ]
  };

  return (
    <section id="about" className="py-16 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FloatUp>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">TENTANG KAMI</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Himpunan Mahasiswa
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Teknik Industri</span>
            </h2>
            <p className="text-foreground/70 max-w-3xl mx-auto">
              Wadah pengembangan potensi mahasiswa Teknik Industri UNS dalam bidang akademik, profesional, dan sosial
            </p>
          </div>
        </FloatUp>

        {/* Main Content - 2 Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Image */}
          <FloatUp delay={0.1}>
            <div className="relative group lg:sticky lg:top-24">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 mix-blend-multiply z-10" />
                <Image
                  src="/allstaff.jpg"
                  alt="Keluarga Besar HMTI UNS"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-background/95 backdrop-blur-md rounded-lg p-3 shadow-lg border border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">Periode 2024/2025</p>
                        <p className="text-xs text-muted-foreground">Keluarga Besar HMTI UNS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
            </div>
          </FloatUp>

          {/* Right Column: Visi & Misi + Stats */}
          <div className="space-y-8">
            {/* Visi & Misi */}
            <FloatUp delay={0.2}>
              <div className="space-y-6">
                {/* Visi */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Visi</h3>
                  </div>
                  <p className="text-foreground/80 leading-relaxed pl-13">
                    {visiMisi.visi}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Misi */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Misi</h3>
                  </div>
                  <ul className="space-y-3 pl-13">
                    {visiMisi.misi.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-foreground/80 text-sm leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FloatUp>

            {/* Stats Section */}
            <FloatUp delay={0.3}>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="group"
                  >
                    <div className="relative bg-gradient-to-br from-background to-muted/30 border-2 border-border rounded-xl p-5 hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Counter
                            end={stat.value}
                            suffix={stat.suffix}
                            duration={2500}
                            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"
                          />
                          <h3 className="text-sm font-bold text-foreground mt-1">
                            {stat.label}
                          </h3>
                        </div>
                        <a
                          href={stat.link}
                          className={`inline-flex items-center justify-center gap-1 bg-gradient-to-r ${stat.color} text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-xs`}
                        >
                          <span>{stat.linkText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                      <div className={`h-1 bg-gradient-to-r ${stat.color} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </FloatUp>
          </div>
        </div>
      </div>
    </section>
  );
}