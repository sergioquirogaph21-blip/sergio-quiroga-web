"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PortfolioImage } from "@/types/portfolio";

export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: PortfolioImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const open = index !== null;
  const current = open ? images[index] : null;

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-5"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-5"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/60">
            {index !== null ? index + 1 : 0} / {images.length} — {current.category}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
