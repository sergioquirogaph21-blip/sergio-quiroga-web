import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isGalleryAuthenticated } from "@/lib/auth-guard";

const schema = z.object({
  fileId: z.string().min(1),
  fileName: z.string().min(1),
  thumbnailLink: z.string().optional().nullable(),
  favorite: z.boolean(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }
  if (!(await isGalleryAuthenticated(gallery.id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { fileId, fileName, thumbnailLink, favorite } = parsed.data;

  if (favorite) {
    await prisma.favorite.upsert({
      where: { galleryId_fileId: { galleryId: gallery.id, fileId } },
      update: {},
      create: { galleryId: gallery.id, fileId, fileName, thumbnailLink },
    });
  } else {
    await prisma.favorite.deleteMany({
      where: { galleryId: gallery.id, fileId },
    });
  }

  return NextResponse.json({ ok: true });
}
