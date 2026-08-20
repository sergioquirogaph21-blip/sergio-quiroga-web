import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessGallery, isAdminAuthenticated } from "@/lib/auth-guard";
import { fileBelongsToFolder, getFileMeta, getFileStream } from "@/lib/drive";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; fileId: string }> }
) {
  const { slug, fileId } = await params;
  const download = req.nextUrl.searchParams.get("download") === "1";

  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }
  if (!(await canAccessGallery(gallery.id))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (download && gallery.requiresPayment && !gallery.downloadsEnabled) {
    const admin = await isAdminAuthenticated();
    if (!admin) {
      return NextResponse.json(
        { error: "Las descargas están bloqueadas hasta confirmar el pago." },
        { status: 403 }
      );
    }
  }

  let belongs: boolean;
  try {
    belongs = await fileBelongsToFolder(fileId, gallery.driveFolderId);
  } catch (err) {
    console.error(`No se pudo verificar el archivo ${fileId} en Drive:`, err);
    return NextResponse.json({ error: "No se pudo conectar con Google Drive" }, { status: 502 });
  }
  if (!belongs) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const meta = await getFileMeta(fileId);
  const stream = await getFileStream(fileId);
  const webStream = Readable.toWeb(stream as Readable) as ReadableStream<Uint8Array>;

  const headers: Record<string, string> = {
    "Content-Type": meta.mimeType ?? "application/octet-stream",
    "Cache-Control": "private, max-age=3600",
  };
  if (download) {
    headers["Content-Disposition"] = `attachment; filename="${(meta.name ?? fileId).replace(/"/g, "")}"`;
  }

  return new NextResponse(webStream, { headers });
}
