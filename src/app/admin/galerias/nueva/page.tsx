import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default async function NuevaGaleriaPage() {
  await requireAdmin();

  return (
    <AdminShell title="Nueva galería">
      <GalleryForm mode="create" />
    </AdminShell>
  );
}
