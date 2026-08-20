import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createGallerySessionToken, galleryCookieName, verifyPassword } from "@/lib/auth";

const schema = z.object({ password: z.string().min(1) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  const gallery = await prisma.gallery.findUnique({ where: { slug } });
  if (!gallery || !gallery.isActive) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }

  const valid = await verifyPassword(parsed.data.password, gallery.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await createGallerySessionToken(gallery.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(galleryCookieName(gallery.id), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
