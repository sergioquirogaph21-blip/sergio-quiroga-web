import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isGalleryAuthenticated } from "@/lib/auth-guard";
import { ALLOWED_RECEIPT_TYPES, MAX_RECEIPT_SIZE } from "@/lib/receipts";

export async function POST(
  req: NextRequest,
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
  if (!gallery.requiresPayment) {
    return NextResponse.json(
      { error: "Esta galería no requiere comprobante de pago" },
      { status: 400 }
    );
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Adjuntá un archivo" }, { status: 400 });
  }
  if (!ALLOWED_RECEIPT_TYPES.includes(file.type as (typeof ALLOWED_RECEIPT_TYPES)[number])) {
    return NextResponse.json(
      { error: "Formato no permitido. Usá una imagen (JPG, PNG, WEBP) o un PDF." },
      { status: 400 }
    );
  }
  if (file.size > MAX_RECEIPT_SIZE) {
    return NextResponse.json({ error: "El archivo supera los 8MB permitidos." }, { status: 400 });
  }

  const receiptData = Buffer.from(await file.arrayBuffer());

  await prisma.gallery.update({
    where: { id: gallery.id },
    data: {
      receiptData,
      receiptOriginalName: file.name,
      receiptMimeType: file.type,
      receiptUploadedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
