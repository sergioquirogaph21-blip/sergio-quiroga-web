import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { isAdminAuthenticated } from "@/lib/auth-guard";
import { parseDriveFolderId } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  clientName: z.string().trim().max(120).optional().or(z.literal("")),
  eventType: z.string().trim().max(60).optional().or(z.literal("")),
  eventDate: z.string().trim().optional().or(z.literal("")),
  driveFolderId: z.string().trim().min(1).optional(),
  password: z.string().min(4).max(100).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  requiresPayment: z.boolean().optional(),
  downloadsEnabled: z.boolean().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { favorites: { orderBy: { createdAt: "desc" } } },
  });

  if (!gallery) {
    return NextResponse.json({ error: "Galería no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ gallery });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    title,
    clientName,
    eventType,
    eventDate,
    driveFolderId,
    password,
    isActive,
    requiresPayment,
    downloadsEnabled,
  } = parsed.data;

  const gallery = await prisma.gallery.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(clientName !== undefined && { clientName: clientName || null }),
      ...(eventType !== undefined && { eventType: eventType || null }),
      ...(eventDate !== undefined && {
        eventDate: eventDate ? new Date(eventDate) : null,
      }),
      ...(driveFolderId !== undefined && { driveFolderId: parseDriveFolderId(driveFolderId) }),
      ...(isActive !== undefined && { isActive }),
      ...(requiresPayment !== undefined && { requiresPayment }),
      ...(downloadsEnabled !== undefined && { downloadsEnabled }),
      ...(password && { passwordHash: await hashPassword(password) }),
    },
  });

  return NextResponse.json({ gallery });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.gallery.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
