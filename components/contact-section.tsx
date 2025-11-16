import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatUp } from './animations/float-up';

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'info@himti.uns.ac.id',
    },
    {
      icon: Phone,
      title: 'Telepon',
      value: '+62 812-3456-7890',
    },
    {
      icon: MapPin,
      title: 'Lokasi',
      value: 'Kampus UNS, Surakarta',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <FloatUp>
            <div className="text-center mb-16">
              <span className="text-primary font-semibold">HUBUNGI KAMI</span>
              <h2 className="text-4xl font-bold text-foreground mt-4 mb-4">
                Mari Terhubung
              </h2>
              <p className="text-foreground/70 text-lg">
                Punya pertanyaan atau ingin bergabung? Hubungi kami sekarang
              </p>
            </div>
          </FloatUp>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <FloatUp key={index} delay={index * 0.1}>
                  <div className="bg-background rounded-xl p-6 border border-border text-center hover:border-primary hover:shadow-lg transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-lg mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                    <p className="text-foreground/70">{info.value}</p>
                  </div>
                </FloatUp>
              );
            })}
          </div>

          {/* CTA */}
          <FloatUp delay={0.3}>
            <div className="text-center">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                Hubungi Kami
              </Button>
            </div>
          </FloatUp>
        </div>
      </div>
    </section>
  );
}