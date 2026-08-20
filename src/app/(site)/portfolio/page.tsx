import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/site/PortfolioGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { getPortfolioImages } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portafolio",
  description: "Galería de bodas, retratos, eventos y paisajes de Sergio Quiroga Fotografía.",
};

// Siempre servida desde la base (no prerenderizada): refleja al instante
// los cambios hechos en /admin/portfolio.
export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const images = await getPortfolioImages();

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <SectionHeading
          eyebrow="Portafolio"
          title="Una mirada a mi trabajo"
          description="Explora por categoría y hacé clic en cualquier imagen para verla a pantalla completa."
        />
        <div className="mt-16">
          <PortfolioGrid images={images} />
        </div>
      </Container>
    </div>
  );
}
