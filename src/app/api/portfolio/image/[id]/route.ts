import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Sirve las fotos del portafolio público. Sin autenticación: son de marketing. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const image = await prisma.portfolioImage.findUnique({
    where: { id },
    select: { data: true, mimeType: true },
  });

  if (!image) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
