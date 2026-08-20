import { Readable } from "node:stream";
import { ZipArchive } from "archiver";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessGallery, isAdminAuthenticated } from "@/lib/auth-guard";
import { findFolderInTree, flattenTree, getFileStream, getGalleryTree } from "@/lib/drive";
import { slugify } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const folderParam = req.nextUrl.searchParams.get("folder");

  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }
  if (!(await canAccessGallery(gallery.id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (gallery.requiresPayment && !gallery.downloadsEnabled) {
    const admin = await isAdminAuthenticated();
    if (!admin) {
      return NextResponse.json(
        { error: "Las descargas están bloqueadas hasta confirmar el pago." },
        { status: 403 }
      );
    }
  }

  let tree;
  try {
    tree = await getGalleryTree(gallery.driveFolderId);
  } catch (err) {
    console.error(`No se pudieron listar las fotos de Drive para ${slug}:`, err);
    return NextResponse.json({ error: "No se pudo conectar con Google Drive" }, { status: 502 });
  }

  let scopedNode = tree;
  if (folderParam) {
    const found = findFolderInTree(tree, folderParam);
    if (!found) {
      return NextResponse.json({ error: "Sección no encontrada" }, { status: 404 });
    }
    scopedNode = found;
  }

  const flat = flattenTree(scopedNode);
  if (flat.length === 0) {
    return NextResponse.json({ error: "Esta sección no tiene fotos" }, { status: 404 });
  }

  const archive = new ZipArchive({ zlib: { level: 6 } });
  archive.on("warning", (err: Error) => console.warn("archiver warning:", err));
  archive.on("error", (err: Error) => console.error("archiver error:", err));

  // Se agregan los archivos de forma asíncrona sin bloquear la respuesta inicial.
  (async () => {
    for (const { photo, path } of flat) {
      try {
        const stream = await getFileStream(photo.id);
        const entryName = [...path, photo.name].join("/");
        archive.append(stream as Readable, { name: entryName });
      } catch (err) {
        console.error(`No se pudo agregar ${photo.name} al zip:`, err);
      }
    }
    archive.finalize();
  })();

  const webStream = Readable.toWeb(archive as unknown as Readable) as ReadableStream<Uint8Array>;
  const baseName = scopedNode.name || gallery.title;
  const filename = `${slugify(baseName) || "galeria"}.zip`;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
