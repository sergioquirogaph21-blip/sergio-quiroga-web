import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth-guard";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 15 * 1024 * 1024; // 15MB

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const images = await prisma.portfolioImage.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: {
      id: true,
      category: true,
      alt: true,
      width: true,
      height: true,
      order: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  const category = formData?.get("category");
  const alt = formData?.get("alt");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Adjuntá una imagen" }, { status: 400 });
  }
  if (typeof category !== "string" || !category.trim()) {
    return NextResponse.json({ error: "Falta la categoría" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usá JPG, PNG o WEBP." },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen supera los 15MB permitidos." }, { status: 400 });
  }

  const data = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(data).metadata();

  const maxOrder = await prisma.portfolioImage.aggregate({
    where: { category: category.trim() },
    _max: { order: true },
  });

  const image = await prisma.portfolioImage.create({
    data: {
      category: category.trim(),
      data,
      mimeType: file.type,
      alt: typeof alt === "string" && alt.trim() ? alt.trim() : file.name,
      width: meta.width ?? 4,
      height: meta.height ?? 5,
      order: (maxOrder._max.order ?? -1) + 1,
    },
    select: { id: true },
  });

  return NextResponse.json({ image }, { status: 201 });
}
