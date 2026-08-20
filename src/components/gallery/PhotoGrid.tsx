"use client";

import { PhotoCard } from "@/components/gallery/PhotoCard";
import type { GalleryPhoto } from "@/types/gallery";

export function PhotoGrid({
  slug,
  photos,
  downloadsAllowed,
  onOpen,
  onToggleFavorite,
}: {
  slug: string;
  photos: GalleryPhoto[];
  downloadsAllowed: boolean;
  onOpen: (index: number) => void;
  onToggleFavorite: (photo: GalleryPhoto) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-ink-soft">
        <p>Todavía no hay fotos cargadas en esta galería.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {photos.map((photo, i) => (
        <PhotoCard
          key={photo.id}
          slug={slug}
          photo={photo}
          downloadsAllowed={downloadsAllowed}
          onOpen={() => onOpen(i)}
          onToggleFavorite={() => onToggleFavorite(photo)}
        />
      ))}
    </div>
  );
}
