import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { GalleryList } from "@/components/admin/GalleryList";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { favorites: true } } },
  });

  return (
    <AdminShell
      title="Galerías"
      actions={
        <Link
          href="/admin/galerias/nueva"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-sand-dark"
        >
          <Plus className="h-4 w-4" />
          Nueva galería
        </Link>
      }
    >
      <GalleryList
        galleries={galleries.map((g) => ({
          ...g,
          eventDate: g.eventDate?.toISOString() ?? null,
          createdAt: g.createdAt.toISOString(),
        }))}
      />
    </AdminShell>
  );
}
