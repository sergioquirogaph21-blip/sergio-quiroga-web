import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  eventType: z.string().trim().min(1).max(60),
  eventDate: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(10).max(3000),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, eventType, eventDate, message } = parsed.data;

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      eventType,
      eventDate: eventDate ? new Date(eventDate) : null,
      message,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
