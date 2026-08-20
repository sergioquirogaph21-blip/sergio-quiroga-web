import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessGallery } from "@/lib/auth-guard";
import { fetchThumbnail } from "@/lib/drive";

/** Evita SSRF: sólo se permite proxear miniaturas alojadas en Google. */
function isTrustedGoogleThumbnail(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && /(^|\.)googleusercontent\.com$/.test(hostname);
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; fileId: string }> }
) {
  const { slug } = await params;
  const thumbnailLink = req.nextUrl.searchParams.get("tl");
  const size = Number(req.nextUrl.searchParams.get("s") ?? 480);

  if (!thumbnailLink || !isTrustedGoogleThumbnail(thumbnailLink)) {
    return NextResponse.json({ error: "Parámetro inválido" }, { status: 400 });
  }

  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }
  if (!(await canAccessGallery(gallery.id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { buffer, contentType } = await fetchThumbnail(thumbnailLink, size);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "No se pudo obtener la miniatura" }, { status: 502 });
  }
}
