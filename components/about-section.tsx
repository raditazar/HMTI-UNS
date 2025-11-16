import { FloatUp } from './animations/float-up';
import { Counter } from './animations/counter';
import { Users, Target, CheckCircle2, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  const stats = [
    { 
      icon: Users,
      value: 100, 
      suffix: '+',
      label: 'Anggota Aktif', 
      color: 'from-blue-500 to-blue-600',
      description: 'Mahasiswa aktif'
    },
    { 
      icon: TrendingUp,
      value: 20, 
      suffix: '+',
      label: 'Program Tahunan', 
      color: 'from-purple-500 to-purple-600',
      description: 'Kegiatan per tahun'
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
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FloatUp>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">TENTANG KAMI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Himpunan Mahasiswa
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Teknik Industri</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-3xl mx-auto">
              Wadah pengembangan potensi mahasiswa Teknik Industri UNS dalam bidang akademik, profesional, dan sosial
            </p>
          </div>
        </FloatUp>

        {/* Main Content - Compact Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left Column: Image - 2 cols */}
            <FloatUp delay={0.1} className="lg:col-span-2">
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
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

                {/* Stats Cards - Overlay on Image */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <FloatUp key={index} delay={0.2 + index * 0.1}>
                        <div className="relative group/stat">
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl opacity-10 group-hover/stat:opacity-20 transition-opacity`} />
                          <div className="relative bg-background/80 backdrop-blur-sm border-2 border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-lg">
                            <Counter
                              end={stat.value}
                              suffix={stat.suffix}
                              duration={2500}
                              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary block mb-1"
                            />
                            <h3 className="text-xs font-bold text-foreground">
                              {stat.label}
                            </h3>
                            <p className="text-xs text-foreground/60 mt-0.5">
                              {stat.description}
                            </p>
                          </div>
                        </div>
                      </FloatUp>
                    );
                  })}
                </div>
              </div>
            </FloatUp>

            {/* Right Column: Visi & Misi - 3 cols */}
            <FloatUp delay={0.2} className="lg:col-span-3">
              <div className="space-y-8">
                {/* Visi */}
                <div className="relative">
                  <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  <div className="pl-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Visi</h3>
                    </div>
                    <p className="text-foreground/80 text-lg leading-relaxed">
                      {visiMisi.visi}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-border"></div>
                  </div>
                </div>

                {/* Misi - Grid Layout */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Misi</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {visiMisi.misi.map((item, index) => (
                      <div
                        key={index}
                        className="relative group/misi bg-muted/50 hover:bg-muted border border-border hover:border-primary/50 rounded-xl p-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-foreground/80 text-sm leading-relaxed">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FloatUp>
          </div>
        </div>
      </div>
    </section>
  );
}