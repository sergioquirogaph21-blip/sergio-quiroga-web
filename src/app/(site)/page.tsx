import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { AboutSection } from "@/components/site/AboutSection";
import { ServicesPricing } from "@/components/site/ServicesPricing";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { getPortfolioImages } from "@/lib/portfolio";
import { getServiceGroups } from "@/lib/services";

// Se sirve siempre desde la base de datos (no prerenderizada): así los
// cambios hechos en /admin/portfolio y /admin/servicios se ven al instante.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [images, groups] = await Promise.all([getPortfolioImages(), getServiceGroups()]);

  const categories = Array.from(new Set(images.map((img) => img.category)));
  const featured = categories
    .map((cat) => images.find((img) => img.category === cat))
    .filter((img) => img !== undefined);

  return (
    <>
      <Hero />

      {featured.length > 0 && (
        <section className="py-24 sm:py-32">
          <Container>
            <SectionHeading
              eyebrow="Portafolio"
              title="Momentos capturados con intención"
              description="Una selección de trabajos recientes en bodas, retratos, eventos y paisajes."
            />

            <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featured.map((img) => (
                <Link
                  key={img.id}
                  href="/portfolio"
                  className="group relative block aspect-[3/4] overflow-hidden rounded-sm bg-paper-dim"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <span className="absolute bottom-4 left-4 text-sm font-medium tracking-wide text-white">
                    {img.category}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                href="/portfolio"
                className="flex items-center gap-2 rounded-full border border-ink px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Ver portafolio completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
      )}

      <AboutSection />
      <ServicesPricing groups={groups} />

      <section className="py-24 sm:py-32">
        <Container className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            eyebrow="Reservas"
            title="¿Listo para contar tu historia?"
            description="Contame sobre tu evento y armemos juntos una sesión inolvidable."
          />
          <Link
            href="/contacto"
            className="mt-2 rounded-full bg-ink px-10 py-4 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark"
          >
            Contactar ahora
          </Link>
        </Container>
      </section>
    </>
  );
}
