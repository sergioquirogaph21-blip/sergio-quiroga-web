"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Lock, ShieldCheck, ShieldX } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

export function PaymentReview({
  galleryId,
  downloadsEnabled,
  receiptOriginalName,
  receiptMimeType,
  receiptUploadedAt,
}: {
  galleryId: string;
  downloadsEnabled: boolean;
  receiptOriginalName: string | null;
  receiptMimeType: string | null;
  receiptUploadedAt: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function setDownloads(enabled: boolean) {
    setLoading(true);
    await fetch(`/api/admin/galleries/${galleryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downloadsEnabled: enabled }),
    });
    router.refresh();
    setLoading(false);
  }

  const isImage = receiptMimeType?.startsWith("image/");

  return (
    <div className="max-w-2xl rounded-sm border border-line bg-paper p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {downloadsEnabled ? (
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          ) : (
            <ShieldX className="h-5 w-5 text-amber-600" />
          )}
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              downloadsEnabled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            )}
          >
            {downloadsEnabled ? "Descargas habilitadas" : "Descargas bloqueadas"}
          </span>
        </div>

        {downloadsEnabled ? (
          <button
            onClick={() => setDownloads(false)}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-soft hover:text-red-600 disabled:opacity-50"
          >
            <Lock className="h-3.5 w-3.5" />
            Volver a bloquear
          </button>
        ) : null}
      </div>

      <div className="mt-4">
        {receiptOriginalName ? (
          <div className="flex items-center gap-3 rounded-sm border border-line p-3">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/admin/galleries/${galleryId}/receipt`}
                alt="Comprobante de pago"
                className="h-16 w-16 rounded-sm object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-paper-dim text-ink-soft">
                <FileText className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{receiptOriginalName}</p>
              <p className="text-xs text-ink-soft">
                Subido el {formatDate(receiptUploadedAt)}
              </p>
              <a
                href={`/api/admin/galleries/${galleryId}/receipt`}
                target="_blank"
                className="mt-1 inline-block text-xs text-sand-dark underline underline-offset-2"
              >
                Ver comprobante completo
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-soft">
            El cliente todavía no subió un comprobante de pago.
          </p>
        )}

        {!downloadsEnabled && (
          <button
            onClick={() => setDownloads(true)}
            disabled={loading}
            className="mt-4 flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark disabled:opacity-60"
          >
            <CheckCircle2 className="h-4 w-4" />
            Aprobar pago y habilitar descargas
          </button>
        )}
      </div>
    </div>
  );
}
