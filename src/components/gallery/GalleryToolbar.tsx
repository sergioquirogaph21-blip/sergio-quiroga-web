"use client";

import { Download, Heart, Lock, PlayCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { GalleryMeta } from "@/types/gallery";

export function GalleryToolbar({
  meta,
  total,
  favoriteCount,
  downloadsAllowed,
  canStartSlideshow,
  zipUrl,
  zipLabel,
  onStartSlideshow,
}: {
  slug: string;
  meta: GalleryMeta;
  total: number;
  favoriteCount: number;
  downloadsAllowed: boolean;
  canStartSlideshow: boolean;
  zipUrl: string;
  zipLabel: string;
  onStartSlideshow: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-xs font-medium tracking-[0.3em] text-sand-dark uppercase">
          Galería privada
        </span>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">{meta.title}</h1>
        <p className="mt-2 text-sm text-ink-soft">
          {meta.eventType && <span>{meta.eventType} · </span>}
          {meta.eventDate && <span>{formatDate(meta.eventDate)} · </span>}
          {total} foto{total === 1 ? "" : "s"}
          {favoriteCount > 0 && (
            <span className="ml-1 inline-flex items-center gap-1 text-red-500">
              · <Heart className="h-3.5 w-3.5 fill-current" /> {favoriteCount}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onStartSlideshow}
          disabled={!canStartSlideshow}
          className="flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-40"
        >
          <PlayCircle className="h-4 w-4" />
          Diapositivas
        </button>
        {downloadsAllowed ? (
          <a
            href={zipUrl}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark"
          >
            <Download className="h-4 w-4" />
            {zipLabel}
          </a>
        ) : (
          <span
            className="flex cursor-not-allowed items-center gap-2 rounded-full bg-paper-dim px-5 py-2.5 text-sm font-medium tracking-wide text-ink-soft"
            title="Confirmá el pago para habilitar la descarga"
          >
            <Lock className="h-4 w-4" />
            {zipLabel}
          </span>
        )}
      </div>
    </div>
  );
}
