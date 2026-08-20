import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { FavoritesViewer } from "@/components/admin/FavoritesViewer";
import { PaymentReview } from "@/components/admin/PaymentReview";

export default async function EditarGaleriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { favorites: { orderBy: { createdAt: "desc" } } },
  });

  if (!gallery) notFound();

  return (
    <AdminShell
      title={gallery.title}
      actions={
        <a
          href={`/galeria/${gallery.slug}`}
          target="_blank"
          className="flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <ExternalLink className="h-4 w-4" />
          Ver galería del cliente
        </a>
      }
    >
      <div className="space-y-12">
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-ink uppercase">
            Detalles de la galería
          </h2>
          <GalleryForm
            mode="edit"
            galleryId={gallery.id}
            initialValues={{
              title: gallery.title,
              clientName: gallery.clientName ?? "",
              eventType: gallery.eventType ?? "",
              eventDate: gallery.eventDate ? gallery.eventDate.toISOString().slice(0, 10) : "",
              driveFolderId: gallery.driveFolderId,
              password: "",
              isActive: gallery.isActive,
              requiresPayment: gallery.requiresPayment,
              downloadsEnabled: gallery.downloadsEnabled,
            }}
          />
        </section>

        {gallery.requiresPayment && (
          <section>
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-ink uppercase">
              Comprobante de pago
            </h2>
            <PaymentReview
              galleryId={gallery.id}
              downloadsEnabled={gallery.downloadsEnabled}
              receiptOriginalName={gallery.receiptOriginalName}
              receiptMimeType={gallery.receiptMimeType}
              receiptUploadedAt={gallery.receiptUploadedAt?.toISOString() ?? null}
            />
          </section>
        )}

        <section>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-ink uppercase">
            Fotos favoritas del cliente
            <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-normal normal-case text-ink-soft">
              {gallery.favorites.length}
            </span>
          </h2>
          <FavoritesViewer
            slug={gallery.slug}
            favorites={gallery.favorites.map((f) => ({
              ...f,
              createdAt: f.createdAt.toISOString(),
            }))}
          />
        </section>
      </div>
    </AdminShell>
  );
}
