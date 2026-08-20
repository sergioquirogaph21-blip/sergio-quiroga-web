import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioManager } from "@/components/admin/PortfolioManager";

export default async function AdminPortfolioPage() {
  await requireAdmin();

  const images = await prisma.portfolioImage.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    select: { id: true, category: true, alt: true, width: true, height: true },
  });

  return (
    <AdminShell title="Portafolio">
      <PortfolioManager images={images} />
    </AdminShell>
  );
}
