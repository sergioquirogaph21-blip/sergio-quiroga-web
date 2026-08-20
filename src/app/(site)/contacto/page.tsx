import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Reservá tu sesión o consultá disponibilidad para tu evento.",
};

export default function ContactoPage() {
  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <SectionHeading
          eyebrow="Contacto"
          title="Hablemos de tu próximo evento"
          description="Completá el formulario y te responderé dentro de las próximas 24-48 horas."
        />

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-sand-dark" />
              <div>
                <h3 className="text-sm font-semibold text-ink">Email</h3>
                <p className="mt-1 text-sm text-ink-soft">sergioquirogaph21@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-sand-dark" />
              <div>
                <h3 className="text-sm font-semibold text-ink">Teléfono</h3>
                <p className="mt-1 text-sm text-ink-soft">+595 971261364</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-sand-dark" />
              <div>
                <h3 className="text-sm font-semibold text-ink">Ubicación</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Minga Guazú - Alto Paraná - Paraguay
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-line bg-paper p-8 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
