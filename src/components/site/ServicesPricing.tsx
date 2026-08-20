"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import type { ServiceGroupData } from "@/types/services";

export function ServicesPricing({ groups }: { groups: ServiceGroupData[] }) {
  const [active, setActive] = useState(groups[0]?.category);
  const group = groups.find((g) => g.category === active) ?? groups[0];

  if (!group) {
    return null;
  }

  const singleTier = group.tiers.length === 1;

  return (
    <section className="bg-paper-dim py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Servicios"
          title="Paquetes pensados para cada momento"
          description="Precios de referencia — cada paquete se ajusta a la duración y necesidades específicas de tu evento."
        />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(g.category)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-colors",
                active === g.category
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-sand hover:text-sand-dark"
              )}
            >
              {g.category}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-ink-soft">
          {group.description}
        </p>

        <div
          className={cn(
            "mt-12 grid grid-cols-1 gap-6",
            singleTier ? "mx-auto max-w-md" : "md:grid-cols-3"
          )}
        >
          {group.tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col rounded-sm border p-8",
                tier.featured
                  ? "border-ink bg-ink text-paper shadow-xl"
                  : "border-line bg-paper text-ink"
              )}
            >
              {tier.featured && (
                <span className="mb-4 w-fit rounded-full bg-sand px-3 py-1 text-xs font-medium tracking-widest text-ink uppercase">
                  Más elegido
                </span>
              )}
              <h3 className="font-serif text-2xl">{tier.name}</h3>
              <p
                className={cn(
                  "mt-2 text-sm",
                  tier.featured ? "text-paper/70" : "text-ink-soft"
                )}
              >
                {tier.description}
              </p>
              <div className="mt-6 font-serif text-4xl">
                {tier.price}
                <span
                  className={cn(
                    "ml-1 text-sm font-sans",
                    tier.featured ? "text-paper/60" : "text-ink-soft"
                  )}
                >
                  desde
                </span>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        tier.featured ? "text-sand" : "text-sand-dark"
                      )}
                    />
                    <span className={tier.featured ? "text-paper/90" : "text-ink-soft"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contacto"
                className={cn(
                  "mt-8 rounded-full px-6 py-3 text-center text-sm font-medium tracking-wide transition-colors",
                  tier.featured
                    ? "bg-sand text-ink hover:bg-white"
                    : "border border-ink text-ink hover:bg-ink hover:text-paper"
                )}
              >
                Consultar disponibilidad
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
