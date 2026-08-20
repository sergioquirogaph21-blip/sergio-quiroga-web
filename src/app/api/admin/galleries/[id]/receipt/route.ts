import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth-guard";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({ where: { id } });

  if (!gallery?.receiptData) {
    return NextResponse.json({ error: "No hay comprobante cargado" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(gallery.receiptData), {
    headers: {
      "Content-Type": gallery.receiptMimeType ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
      "Content-Disposition": `inline; filename="${(gallery.receiptOriginalName ?? "comprobante").replace(/"/g, "")}"`,
    },
  });
}
