import "server-only";
import { prisma } from "@/lib/prisma";
import type { ServiceGroupData } from "@/types/services";

export async function getServiceGroups(): Promise<ServiceGroupData[]> {
  const groups = await prisma.serviceGroup.findMany({
    orderBy: { order: "asc" },
    include: { tiers: { orderBy: { order: "asc" } } },
  });

  return groups.map((group) => ({
    id: group.id,
    category: group.category,
    description: group.description,
    tiers: group.tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      description: tier.description,
      features: tier.features.split("\n").filter(Boolean),
      featured: tier.featured,
    })),
  }));
}
