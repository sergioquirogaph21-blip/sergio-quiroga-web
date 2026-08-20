import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth-guard";

const tierSchema = z.object({
  name: z.string().trim().min(1).max(60),
  price: z.string().trim().min(1).max(30),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  features: z.array(z.string().trim().min(1)).max(20),
  featured: z.boolean().optional(),
});

const groupSchema = z.object({
  category: z.string().trim().min(1).max(60),
  description: z.string().trim().max(300).optional().or(z.literal("")),
  tiers: z.array(tierSchema).min(1).max(6),
});

const schema = z.object({ groups: z.array(groupSchema).max(20) });

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const groups = await prisma.serviceGroup.findMany({
    orderBy: { order: "asc" },
    include: { tiers: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ groups });
}

/** Reemplaza todos los grupos y combos de servicios de una sola vez. */
export async function PUT(req: NextRequest) {
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

  await prisma.$transaction(async (tx) => {
    await tx.serviceGroup.deleteMany({});

    for (const [groupOrder, group] of parsed.data.groups.entries()) {
      await tx.serviceGroup.create({
        data: {
          category: group.category,
          description: group.description || "",
          order: groupOrder,
          tiers: {
            create: group.tiers.map((tier, tierOrder) => ({
              name: tier.name,
              price: tier.price,
              description: tier.description || "",
              features: tier.features.join("\n"),
              featured: tier.featured ?? false,
              order: tierOrder,
            })),
          },
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
