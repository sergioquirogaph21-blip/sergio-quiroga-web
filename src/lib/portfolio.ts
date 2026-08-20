import "server-only";
import { prisma } from "@/lib/prisma";
import type { PortfolioImage } from "@/types/portfolio";

export async function getPortfolioImages(): Promise<PortfolioImage[]> {
  const rows = await prisma.portfolioImage.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: { id: true, category: true, alt: true, width: true, height: true },
  });

  return rows.map((row) => ({
    id: row.id,
    category: row.category,
    alt: row.alt,
    width: row.width,
    height: row.height,
    src: `/api/portfolio/image/${row.id}`,
  }));
}
