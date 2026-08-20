"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Download,
  Lock,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/types/gallery";

export function Slideshow({
  slug,
  photos,
  index,
  downloadsAllowed,
  onClose,
  onNavigate,
  onToggleFavorite,
}: {
  slug: string;
  photos: GalleryPhoto[];
  index: number | null;
  downloadsAllowed: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onToggleFavorite: (photo: GalleryPhoto) => void;
}) {
  const open = index !== null;
  const current = open ? photos[index] : null;
  const [playing, setPlaying] = useState(false);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const handleClose = useCallback(() => {
    setPlaying(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") setPlaying((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, handleClose, goNext, goPrev]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setInterval(goNext, 3500);
    return () => clearInterval(t);
  }, [open, playing, goNext]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPlaying((p) => !p);
              }}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={playing ? "Pausar diapositivas" : "Reproducir diapositivas"}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(current);
                }}
                className={cn(
                  "rounded-full p-2 transition-colors hover:bg-white/10",
                  current.favorite ? "text-red-400" : "text-white/80 hover:text-white"
                )}
                aria-label="Marcar como favorita"
              >
                <Heart className={cn("h-5 w-5", current.favorite && "fill-current")} />
              </button>
              {downloadsAllowed ? (
                <a
                  href={`/api/galeria/${slug}/image/${current.id}?download=1`}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Descargar foto"
                >
                  <Download className="h-5 w-5" />
                </a>
              ) : (
                <span
                  className="rounded-full p-2 text-white/40"
                  title="Confirmá el pago para habilitar la descarga"
                >
                  <Lock className="h-5 w-5" />
                </span>
              )}
              <button
                onClick={handleClose}
                className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

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
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/galeria/${slug}/image/${current.id}`}
              alt={current.name}
              className="h-full w-full object-contain"
            />
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/60">
            {index !== null ? index + 1 : 0} / {photos.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
