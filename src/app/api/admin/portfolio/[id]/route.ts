import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth-guard";

const schema = z.object({
  category: z.string().trim().min(1).max(60).optional(),
  alt: z.string().trim().min(1).max(200).optional(),
  order: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const image = await prisma.portfolioImage.update({
    where: { id },
    data: parsed.data,
    select: { id: true, category: true, alt: true, order: true },
  });

  return NextResponse.json({ image });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.portfolioImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
