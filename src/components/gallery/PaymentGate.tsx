"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Lock, Receipt, UploadCloud } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { GalleryMeta } from "@/types/gallery";

export function PaymentGate({
  slug,
  meta,
  onUploaded,
}: {
  slug: string;
  meta: GalleryMeta;
  onUploaded: (receiptUploadedAt: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!meta.requiresPayment || meta.downloadsEnabled) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná un archivo primero.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/galeria/${slug}/receipt`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir el comprobante.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      onUploaded(new Date().toISOString());
    } catch {
      setError("Ocurrió un error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  const alreadyUploaded = Boolean(meta.receiptUploadedAt) && !success;

  return (
    <div className="mb-8 rounded-sm border border-sand/40 bg-sand/10 p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand/20 text-sand-dark">
          <Lock className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-ink">Descargas bloqueadas hasta confirmar el pago</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Podés ver y elegir tus favoritas libremente. Para habilitar la
            descarga individual y la galería completa, subí tu comprobante de
            transferencia y te avisaremos apenas lo confirmemos.
          </p>

          {alreadyUploaded || success ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {success
                ? "¡Comprobante enviado! Vamos a revisarlo y habilitar tus descargas a la brevedad."
                : `Comprobante enviado el ${formatDate(meta.receiptUploadedAt)} — en revisión.`}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="max-w-full text-xs text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-medium file:text-paper hover:file:bg-sand-dark"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-ink px-4 py-2 text-xs font-medium tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <UploadCloud className="h-3.5 w-3.5" />
              )}
              {alreadyUploaded ? "Volver a subir" : "Subir comprobante"}
            </button>
          </form>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
            <Receipt className="h-3.5 w-3.5" />
            Formatos aceptados: JPG, PNG, WEBP o PDF — máximo 8MB.
          </p>
        </div>
      </div>
    </div>
  );
}
