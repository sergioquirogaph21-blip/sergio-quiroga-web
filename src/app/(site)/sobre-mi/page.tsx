import type { Metadata } from "next";
import { AboutSection } from "@/components/site/AboutSection";
import { ServicesPricing } from "@/components/site/ServicesPricing";
import { getServiceGroups } from "@/lib/services";

export const metadata: Metadata = {
  title: "Sobre mí",
  description: "Conocé a Sergio Quiroga y los servicios de fotografía disponibles.",
};

// Siempre servida desde la base (no prerenderizada): refleja al instante
// los cambios hechos en /admin/servicios.
export const dynamic = "force-dynamic";

export default async function SobreMiPage() {
  const groups = await getServiceGroups();

  return (
    <div className="pt-20">
      <AboutSection />
      <ServicesPricing groups={groups} />
    </div>
  );
}
