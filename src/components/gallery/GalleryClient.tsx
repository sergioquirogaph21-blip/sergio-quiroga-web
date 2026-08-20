"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FolderBrowser } from "@/components/gallery/FolderBrowser";
import { GalleryToolbar } from "@/components/gallery/GalleryToolbar";
import { PaymentGate } from "@/components/gallery/PaymentGate";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { Slideshow } from "@/components/gallery/Slideshow";
import {
  countFavoritesRecursive,
  countPhotosRecursive,
  resolveNode,
  resolvePathNodes,
  updateTreePhoto,
} from "@/lib/gallery-tree";
import type { GalleryFolderNode, GalleryMeta, GalleryPhoto } from "@/types/gallery";

export function GalleryClient({ slug }: { slug: string }) {
  const [meta, setMeta] = useState<GalleryMeta | null>(null);
  const [tree, setTree] = useState<GalleryFolderNode | null>(null);
  const [pathIds, setPathIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/galeria/${slug}/photos`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error);
        if (cancelled) return;
        setMeta(data.gallery);
        setTree(data.tree);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error && err.message
              ? err.message
              : "No se pudieron cargar las fotos de esta galería."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const pathNodes = useMemo(() => (tree ? resolvePathNodes(tree, pathIds) : []), [tree, pathIds]);
  const currentNode = useMemo(() => (tree ? resolveNode(tree, pathIds) : null), [tree, pathIds]);

  async function toggleFavorite(photo: GalleryPhoto) {
    const next = !photo.favorite;
    setTree((prev) => (prev ? updateTreePhoto(prev, photo.id, { favorite: next }) : prev));

    await fetch(`/api/galeria/${slug}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileId: photo.id,
        fileName: photo.name,
        thumbnailLink: photo.thumbnailLink,
        favorite: next,
      }),
    }).catch(() => {
      setTree((prev) => (prev ? updateTreePhoto(prev, photo.id, { favorite: !next }) : prev));
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-soft">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !meta || !tree || !currentNode) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center text-ink-soft">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p>{error ?? "Ocurrió un error."}</p>
      </div>
    );
  }

  const total = countPhotosRecursive(currentNode);
  const favoriteCount = countFavoritesRecursive(currentNode);
  const downloadsAllowed = !meta.requiresPayment || meta.downloadsEnabled;
  const atRoot = pathIds.length === 0;
  const zipUrl = atRoot
    ? `/api/galeria/${slug}/zip`
    : `/api/galeria/${slug}/zip?folder=${currentNode.id}`;
  const zipLabel = atRoot ? "Descargar galería completa (.zip)" : "Descargar esta sección (.zip)";

  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        <PaymentGate
          slug={slug}
          meta={meta}
          onUploaded={(receiptUploadedAt) =>
            setMeta((prev) => (prev ? { ...prev, receiptUploadedAt } : prev))
          }
        />

        <GalleryToolbar
          slug={slug}
          meta={meta}
          total={total}
          favoriteCount={favoriteCount}
          downloadsAllowed={downloadsAllowed}
          canStartSlideshow={currentNode.photos.length > 0}
          zipUrl={zipUrl}
          zipLabel={zipLabel}
          onStartSlideshow={() => setSlideIndex(0)}
        />

        <div className="mt-10">
          <FolderBrowser
            pathNodes={pathNodes}
            currentNode={currentNode}
            onBreadcrumbClick={(depth) => setPathIds(pathIds.slice(0, depth))}
            onEnterFolder={(folderId) => setPathIds([...pathIds, folderId])}
          />

          {(currentNode.photos.length > 0 || currentNode.folders.length === 0) && (
            <PhotoGrid
              slug={slug}
              photos={currentNode.photos}
              downloadsAllowed={downloadsAllowed}
              onOpen={setSlideIndex}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </Container>

      <Slideshow
        slug={slug}
        photos={currentNode.photos}
        index={slideIndex}
        downloadsAllowed={downloadsAllowed}
        onClose={() => setSlideIndex(null)}
        onNavigate={setSlideIndex}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
