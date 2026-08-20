"use client";

import { Heart, Download, Expand, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/types/gallery";

export function PhotoCard({
  slug,
  photo,
  downloadsAllowed,
  onOpen,
  onToggleFavorite,
}: {
  slug: string;
  photo: GalleryPhoto;
  downloadsAllowed: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
}) {
  const thumbSrc = photo.thumbnailLink
    ? `/api/galeria/${slug}/thumb/${photo.id}?tl=${encodeURIComponent(photo.thumbnailLink)}&s=480`
    : undefined;

  const ratio = photo.width && photo.height ? `${photo.width} / ${photo.height}` : "4 / 5";

  return (
    <div
      className="group relative overflow-hidden rounded-sm bg-paper-dim"
      style={{ aspectRatio: ratio }}
    >
      {thumbSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbSrc}
          alt={photo.name}
          loading="lazy"
          className="h-full w-full cursor-pointer object-cover transition-transform duration-500 group-hover:scale-105"
          onClick={onOpen}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <button
        onClick={onToggleFavorite}
        className={cn(
          "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
          photo.favorite
            ? "bg-white text-red-500"
            : "bg-black/30 text-white opacity-0 group-hover:opacity-100"
        )}
        aria-label="Marcar como favorita"
      >
        <Heart className={cn("h-4 w-4", photo.favorite && "fill-current")} />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          onClick={onOpen}
          className="pointer-events-auto rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
          aria-label="Ver imagen"
        >
          <Expand className="h-4 w-4" />
        </button>
        {downloadsAllowed ? (
          <a
            href={`/api/galeria/${slug}/image/${photo.id}?download=1`}
            className="pointer-events-auto rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50"
            aria-label="Descargar foto"
          >
            <Download className="h-4 w-4" />
          </a>
        ) : (
          <span
            className="pointer-events-auto rounded-full bg-black/30 p-2 text-white/50 backdrop-blur-sm"
            title="Confirmá el pago para habilitar la descarga"
          >
            <Lock className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
