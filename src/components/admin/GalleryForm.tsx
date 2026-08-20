"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { parseDriveFolderId } from "@/lib/utils";

export type GalleryFormValues = {
  title: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  driveFolderId: string;
  password: string;
  isActive: boolean;
  requiresPayment: boolean;
  downloadsEnabled: boolean;
};

const EMPTY: GalleryFormValues = {
  title: "",
  clientName: "",
  eventType: "",
  eventDate: "",
  driveFolderId: "",
  password: "",
  isActive: true,
  requiresPayment: false,
  downloadsEnabled: true,
};

export function GalleryForm({
  mode,
  galleryId,
  initialValues,
}: {
  mode: "create" | "edit";
  galleryId?: string;
  initialValues?: Partial<GalleryFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<GalleryFormValues>({ ...EMPTY, ...initialValues });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof GalleryFormValues>(key: K, value: GalleryFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = mode === "create" ? "/api/admin/galleries" : `/api/admin/galleries/${galleryId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const payload =
      mode === "create"
        ? values
        : { ...values, password: values.password || undefined };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudo guardar la galería.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Ocurrió un error de conexión.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-sand";
  const labelClass = "mb-2 block text-xs font-medium tracking-wide text-ink uppercase";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6 rounded-sm border border-line bg-paper p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Título del evento</label>
          <input
            className={inputClass}
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Boda de Ana & Martín"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Nombre del cliente</label>
          <input
            className={inputClass}
            value={values.clientName}
            onChange={(e) => update("clientName", e.target.value)}
            placeholder="Ana Pérez"
          />
        </div>
        <div>
          <label className={labelClass}>Tipo de evento</label>
          <input
            className={inputClass}
            value={values.eventType}
            onChange={(e) => update("eventType", e.target.value)}
            placeholder="Boda, Retrato, Evento deportivo..."
          />
        </div>
        <div>
          <label className={labelClass}>Fecha del evento</label>
          <input
            type="date"
            className={inputClass}
            value={values.eventDate}
            onChange={(e) => update("eventDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>ID de la carpeta de Google Drive</label>
        <input
          className={inputClass}
          value={values.driveFolderId}
          onChange={(e) => update("driveFolderId", e.target.value)}
          onBlur={(e) => update("driveFolderId", parseDriveFolderId(e.target.value))}
          placeholder="1AbCDefGhIJkLmNoPQRstuVWxyz"
          required
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          Podés pegar el link completo de la carpeta (con &quot;?usp=drive_link&quot; y
          todo) o sólo el ID — se limpia automáticamente.
        </p>
      </div>

      <div>
        <label className={labelClass}>
          {mode === "create" ? "Contraseña de acceso" : "Nueva contraseña (opcional)"}
        </label>
        <input
          type="text"
          className={inputClass}
          value={values.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder={mode === "create" ? "Contraseña para el cliente" : "Dejar en blanco para no cambiarla"}
          required={mode === "create"}
        />
      </div>

      <div className="space-y-3 rounded-sm border border-line bg-paper-dim p-4">
        {mode === "edit" && (
          <label className="flex items-center gap-2.5 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="h-4 w-4 accent-sand"
            />
            Galería activa (visible para el cliente)
          </label>
        )}

        <label className="flex items-center gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={values.requiresPayment}
            onChange={(e) => {
              const requiresPayment = e.target.checked;
              update("requiresPayment", requiresPayment);
              if (mode === "create") update("downloadsEnabled", !requiresPayment);
            }}
            className="h-4 w-4 accent-sand"
          />
          Requiere confirmar el pago antes de habilitar las descargas
        </label>
        <p className="pl-6.5 text-xs text-ink-soft">
          El cliente podrá ver y marcar favoritas igual, pero no podrá
          descargar fotos hasta que subas su comprobante y lo apruebes desde
          esta pantalla.
        </p>

        {mode === "edit" && values.requiresPayment && (
          <label className="flex items-center gap-2.5 pt-1 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={values.downloadsEnabled}
              onChange={(e) => update("downloadsEnabled", e.target.checked)}
              className="h-4 w-4 accent-sand"
            />
            Descargas habilitadas ahora mismo
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Crear galería" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
