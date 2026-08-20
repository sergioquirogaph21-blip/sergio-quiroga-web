import { requireAdmin } from "@/lib/auth-guard";
import { getServiceGroups } from "@/lib/services";
import { AdminShell } from "@/components/admin/AdminShell";
import { ServicesManager } from "@/components/admin/ServicesManager";

export default async function AdminServiciosPage() {
  await requireAdmin();
  const groups = await getServiceGroups();

  return (
    <AdminShell title="Servicios y precios">
      <ServicesManager groups={groups} />
    </AdminShell>
  );
}
