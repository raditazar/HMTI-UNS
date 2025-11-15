import { Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-semibold">HUBUNGI KAMI</span>
            <h2 className="text-4xl font-bold text-foreground mt-4 mb-4">
              Mari Terhubung
            </h2>
            <p className="text-foreground/70 text-lg">
              Punya pertanyaan atau ingin bergabung? Hubungi kami sekarang
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-lg mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Email</h3>
              <p className="text-foreground/70">info@himti.uns.ac.id</p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-lg mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Telepon</h3>
              <p className="text-foreground/70">+62 812-3456-7890</p>
            </div>

            <div className="bg-background rounded-xl p-6 border border-border text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-lg mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">Lokasi</h3>
              <p className="text-foreground/70">Kampus UNS, Surakarta</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
