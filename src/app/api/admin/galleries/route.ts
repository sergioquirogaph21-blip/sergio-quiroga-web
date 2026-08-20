import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { isAdminAuthenticated } from "@/lib/auth-guard";
import { parseDriveFolderId, slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().trim().min(1).max(120),
  clientName: z.string().trim().max(120).optional().or(z.literal("")),
  eventType: z.string().trim().max(60).optional().or(z.literal("")),
  eventDate: z.string().trim().optional().or(z.literal("")),
  driveFolderId: z.string().trim().min(1),
  password: z.string().min(4).max(100),
  requiresPayment: z.boolean().optional(),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { favorites: true } } },
  });

  return NextResponse.json({ galleries });
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { title, clientName, eventType, eventDate, driveFolderId, password, requiresPayment } =
    parsed.data;

  const baseSlug = slugify(title) || "galeria";
  const slug = `${baseSlug}-${nanoid(6).toLowerCase()}`;
  const passwordHash = await hashPassword(password);

  const gallery = await prisma.gallery.create({
    data: {
      slug,
      title,
      clientName: clientName || null,
      eventType: eventType || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      driveFolderId: parseDriveFolderId(driveFolderId),
      passwordHash,
      requiresPayment: requiresPayment ?? false,
      downloadsEnabled: !requiresPayment,
    },
  });

  return NextResponse.json({ gallery }, { status: 201 });
}
