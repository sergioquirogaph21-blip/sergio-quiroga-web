"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Check, ExternalLink, Trash2, Heart, ImageOff, Lock, ShieldCheck } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

export type GalleryListItem = {
  id: string;
  slug: string;
  title: string;
  clientName: string | null;
  eventType: string | null;
  eventDate: string | null;
  isActive: boolean;
  requiresPayment: boolean;
  downloadsEnabled: boolean;
  createdAt: string;
  _count: { favorites: number };
};

export function GalleryList({ galleries }: { galleries: GalleryListItem[] }) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function copyLink(gallery: GalleryListItem) {
    const url = `${window.location.origin}/galeria/${gallery.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(gallery.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  async function deleteGallery(gallery: GalleryListItem) {
    if (!confirm(`¿Eliminar la galería "${gallery.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeletingId(gallery.id);
    await fetch(`/api/admin/galleries/${gallery.id}`, { method: "DELETE" });
    router.refresh();
    setDeletingId(null);
  }

  if (galleries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-line bg-paper py-20 text-center text-ink-soft">
        <ImageOff className="h-6 w-6" />
        <p>Todavía no creaste ninguna galería.</p>
        <Link
          href="/admin/galerias/nueva"
          className="mt-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-sand-dark"
        >
          Crear la primera galería
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-line bg-paper">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-line bg-paper-dim text-xs uppercase tracking-wide text-ink-soft">
          <tr>
            <th className="px-5 py-3 font-medium">Galería</th>
            <th className="px-5 py-3 font-medium">Fecha</th>
            <th className="px-5 py-3 font-medium">Favoritas</th>
            <th className="px-5 py-3 font-medium">Estado</th>
            <th className="px-5 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {galleries.map((g) => (
            <tr key={g.id} className="align-middle">
              <td className="px-5 py-4">
                <Link href={`/admin/galerias/${g.id}`} className="font-medium text-ink hover:text-sand-dark">
                  {g.title}
                </Link>
                {g.clientName && <p className="mt-0.5 text-xs text-ink-soft">{g.clientName}</p>}
              </td>
              <td className="px-5 py-4 text-ink-soft">{formatDate(g.eventDate) || "—"}</td>
              <td className="px-5 py-4">
                {g._count.favorites > 0 ? (
                  <span className="inline-flex items-center gap-1 text-red-500">
                    <Heart className="h-3.5 w-3.5 fill-current" /> {g._count.favorites}
                  </span>
                ) : (
                  <span className="text-ink-soft">—</span>
                )}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      g.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {g.isActive ? "Activa" : "Inactiva"}
                  </span>
                  {g.requiresPayment && (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                        g.downloadsEnabled
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                      title={g.downloadsEnabled ? "Descargas habilitadas" : "Descargas bloqueadas"}
                    >
                      {g.downloadsEnabled ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      Pago
                    </span>
                  )}
                </div>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => copyLink(g)}
                    className="rounded-md p-2 text-ink-soft hover:bg-paper-dim hover:text-ink"
                    aria-label="Copiar enlace"
                    title="Copiar enlace de la galería"
                  >
                    {copiedId === g.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={`/galeria/${g.slug}`}
                    target="_blank"
                    className="rounded-md p-2 text-ink-soft hover:bg-paper-dim hover:text-ink"
                    aria-label="Abrir galería"
                    title="Abrir galería"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => deleteGallery(g)}
                    disabled={deletingId === g.id}
                    className="rounded-md p-2 text-ink-soft hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Eliminar galería"
                    title="Eliminar galería"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
