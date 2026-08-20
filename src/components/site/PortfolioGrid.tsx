"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/site/Lightbox";
import { cn } from "@/lib/utils";
import type { PortfolioImage } from "@/types/portfolio";

export function PortfolioGrid({ images: allImages }: { images: PortfolioImage[] }) {
  const categories = useMemo(
    () => Array.from(new Set(allImages.map((img) => img.category))),
    [allImages]
  );
  const [active, setActive] = useState<string>("Todas");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = useMemo(
    () => (active === "Todas" ? allImages : allImages.filter((img) => img.category === active)),
    [allImages, active]
  );

  if (allImages.length === 0) {
    return (
      <p className="text-center text-ink-soft">
        Todavía no hay fotos cargadas en el portafolio.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {["Todas", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-colors",
              active === cat
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-sand hover:text-sand-dark"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="masonry mt-12 columns-1 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full overflow-hidden rounded-sm bg-paper-dim"
            style={{ aspectRatio: `${img.width} / ${img.height}` }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="flex w-full items-center justify-between p-4">
                <span className="text-xs font-medium tracking-widest text-white uppercase">
                  {img.category}
                </span>
                <Expand className="h-4 w-4 text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
