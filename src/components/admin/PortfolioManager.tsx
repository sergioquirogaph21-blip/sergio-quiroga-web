"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, UploadCloud } from "lucide-react";

export type AdminPortfolioImage = {
  id: string;
  category: string;
  alt: string;
  width: number;
  height: number;
};

export function PortfolioManager({ images }: { images: AdminPortfolioImage[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("");
  const [alt, setAlt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(images.map((img) => img.category))).sort(),
    [images]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, AdminPortfolioImage[]>();
    for (const img of images) {
      if (!map.has(img.category)) map.set(img.category, []);
      map.get(img.category)!.push(img);
    }
    return Array.from(map.entries());
  }, [images]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Seleccioná una imagen.");
      return;
    }
    if (!category.trim()) {
      setError("Indicá la categoría.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category.trim());
    formData.append("alt", alt.trim());

    try {
      const res = await fetch("/api/admin/portfolio", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No se pudo subir la imagen.");
        setLoading(false);
        return;
      }
      setAlt("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch {
      setError("Ocurrió un error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar esta foto del portafolio?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    router.refresh();
    setDeletingId(null);
  }

  const inputClass =
    "w-full rounded-sm border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-sand";
  const labelClass = "mb-2 block text-xs font-medium tracking-wide text-ink uppercase";

  return (
    <div className="space-y-10">
      <form
        onSubmit={onUpload}
        className="max-w-2xl space-y-6 rounded-sm border border-line bg-paper p-8"
      >
        <div>
          <label className={labelClass}>Imagen</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-medium file:text-paper hover:file:bg-sand-dark"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Categoría</label>
            <input
              className={inputClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Bodas y 15 Años"
              list="categorias-existentes"
            />
            <datalist id="categorias-existentes">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Descripción (alt)</label>
            <input
              className={inputClass}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Boda de Ana y Martín"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          Subir foto
        </button>
      </form>

      {grouped.length === 0 ? (
        <p className="text-sm text-ink-soft">Todavía no subiste fotos al portafolio.</p>
      ) : (
        grouped.map(([cat, imgs]) => (
          <section key={cat}>
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink uppercase">
              {cat}
              <span className="ml-2 font-normal normal-case text-ink-soft">
                ({imgs.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {imgs.map((img) => (
                <div
                  key={img.id}
                  className="group relative overflow-hidden rounded-sm border border-line bg-paper-dim"
                  style={{ aspectRatio: `${img.width} / ${img.height}` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/portfolio/image/${img.id}`}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => onDelete(img.id)}
                    disabled={deletingId === img.id}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 disabled:opacity-50"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
