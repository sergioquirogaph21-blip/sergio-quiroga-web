import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isGalleryAuthenticated } from "@/lib/auth-guard";
import { getGalleryTree, type DriveFolderNode } from "@/lib/drive";
import type { GalleryFolderNode } from "@/types/gallery";

function withFavorites(node: DriveFolderNode, favoriteIds: Set<string>): GalleryFolderNode {
  return {
    id: node.id,
    name: node.name,
    photos: node.photos.map((p) => ({ ...p, favorite: favoriteIds.has(p.id) })),
    folders: node.folders.map((f) => withFavorites(f, favoriteIds)),
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery || !gallery.isActive) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }

  if (!(await isGalleryAuthenticated(gallery.id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let tree;
  try {
    tree = await getGalleryTree(gallery.driveFolderId);
  } catch (err) {
    console.error(`No se pudieron listar las fotos de Drive para ${slug}:`, err);
    return NextResponse.json(
      {
        error:
          "No se pudo conectar con Google Drive. Verificá las credenciales de la API y el ID de la carpeta.",
      },
      { status: 502 }
    );
  }

  const favorites = await prisma.favorite.findMany({ where: { galleryId: gallery.id } });
  const favoriteIds = new Set(favorites.map((f) => f.fileId));

  return NextResponse.json({
    gallery: {
      id: gallery.id,
      slug: gallery.slug,
      title: gallery.title,
      clientName: gallery.clientName,
      eventType: gallery.eventType,
      eventDate: gallery.eventDate,
      requiresPayment: gallery.requiresPayment,
      downloadsEnabled: gallery.downloadsEnabled,
      receiptUploadedAt: gallery.receiptUploadedAt,
    },
    tree: withFavorites(tree, favoriteIds),
  });
}
