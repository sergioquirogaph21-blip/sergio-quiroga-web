import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:px-10">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-paper-dim">
          <Image
            src="/mi-foto.jpeg"
            alt="Sergio Quiroga, fotógrafo"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <SectionHeading
            eyebrow="Sobre mí"
            title="Contando historias a través de la luz"
            align="left"
          />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              ¡Hola! Soy Sergio Quiroga, un apasionado fotógrafo con base en Minga Guazú, Alto Paraná. Mi comienzo en la fotografía fue en el año 2019, y desde entonces he dedicado mi trabajo a capturar momentos que cuentan una historia. 
            </p>
            <p>
              Inicialmente, me especialicé en sesiones fotográficas y cumpleaños infantiles. Con el tiempo, he expandido mi experiencia para cubrir una amplia gama de eventos, incluyendo graduaciones, bodas, sesiones de fotos en interiores y exteriores, cumpleaños de 15 años y la energía vibrante de partidos de fútbol y otros eventos deportivos.
            </p>
            <p>
              Mi estilo se centra en la naturalidad, la emoción y la luz. Busco crear recuerdos que perduren para siempre, entregando imágenes que te permitan revivir ese instante una y otra vez. ¡Espero tener la oportunidad de conocernos y crear algo increíble juntos! 
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            <div>
              <dt className="font-serif text-3xl text-ink">6+</dt>
              <dd className="mt-1 text-xs tracking-wide text-ink-soft uppercase">
                Años de experiencia
              </dd>
            </div>
            <div>
              <dt className="font-serif text-3xl text-ink">100+</dt>
              <dd className="mt-1 text-xs tracking-wide text-ink-soft uppercase">
                Eventos capturados
              </dd>
            </div>
            <div>
              <dt className="font-serif text-3xl text-ink">100%</dt>
              <dd className="mt-1 text-xs tracking-wide text-ink-soft uppercase">
                Clientes satisfechos
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
