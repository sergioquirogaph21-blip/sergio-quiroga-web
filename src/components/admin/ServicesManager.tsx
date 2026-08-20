"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceGroupData } from "@/types/services";

type EditableTier = {
  key: string;
  name: string;
  price: string;
  description: string;
  features: string; // textarea, una por línea
  featured: boolean;
};

type EditableGroup = {
  key: string;
  category: string;
  description: string;
  tiers: EditableTier[];
};

let keyCounter = 0;
function newKey() {
  keyCounter += 1;
  return `new-${Date.now()}-${keyCounter}`;
}

function toEditable(groups: ServiceGroupData[]): EditableGroup[] {
  return groups.map((g) => ({
    key: g.id,
    category: g.category,
    description: g.description,
    tiers: g.tiers.map((t) => ({
      key: t.id,
      name: t.name,
      price: t.price,
      description: t.description,
      features: t.features.join("\n"),
      featured: t.featured,
    })),
  }));
}

const inputClass =
  "w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-sand";
const labelClass = "mb-1.5 block text-xs font-medium tracking-wide text-ink-soft uppercase";

export function ServicesManager({ groups: initialGroups }: { groups: ServiceGroupData[] }) {
  const router = useRouter();
  const [groups, setGroups] = useState<EditableGroup[]>(() => toEditable(initialGroups));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateGroup(key: string, patch: Partial<EditableGroup>) {
    setGroups((prev) => prev.map((g) => (g.key === key ? { ...g, ...patch } : g)));
    setSaved(false);
  }

  function updateTier(groupKey: string, tierKey: string, patch: Partial<EditableTier>) {
    setGroups((prev) =>
      prev.map((g) =>
        g.key !== groupKey
          ? g
          : { ...g, tiers: g.tiers.map((t) => (t.key === tierKey ? { ...t, ...patch } : t)) }
      )
    );
    setSaved(false);
  }

  function addGroup() {
    setGroups((prev) => [
      ...prev,
      {
        key: newKey(),
        category: "Nueva categoría",
        description: "",
        tiers: [
          {
            key: newKey(),
            name: "Combo",
            price: "$0",
            description: "",
            features: "",
            featured: false,
          },
        ],
      },
    ]);
  }

  function removeGroup(key: string) {
    if (!confirm("¿Eliminar esta categoría y todos sus combos?")) return;
    setGroups((prev) => prev.filter((g) => g.key !== key));
    setSaved(false);
  }

  function addTier(groupKey: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.key !== groupKey
          ? g
          : {
              ...g,
              tiers: [
                ...g.tiers,
                {
                  key: newKey(),
                  name: "Combo",
                  price: "$0",
                  description: "",
                  features: "",
                  featured: false,
                },
              ],
            }
      )
    );
    setSaved(false);
  }

  function removeTier(groupKey: string, tierKey: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.key !== groupKey ? g : { ...g, tiers: g.tiers.filter((t) => t.key !== tierKey) }
      )
    );
    setSaved(false);
  }

  async function onSave() {
    setLoading(true);
    setError(null);
    setSaved(false);

    const payload = {
      groups: groups.map((g) => ({
        category: g.category.trim(),
        description: g.description.trim(),
        tiers: g.tiers.map((t) => ({
          name: t.name.trim(),
          price: t.price.trim(),
          description: t.description.trim(),
          features: t.features
            .split("\n")
            .map((f) => f.trim())
            .filter(Boolean),
          featured: t.featured,
        })),
      })),
    };

    if (payload.groups.some((g) => g.tiers.length === 0)) {
      setError("Cada categoría necesita al menos un combo.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudieron guardar los cambios.");
        setLoading(false);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Ocurrió un error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-24">
      {groups.map((group) => (
        <div key={group.key} className="rounded-sm border border-line bg-paper p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Categoría</label>
                <input
                  className={cn(inputClass, "font-medium")}
                  value={group.category}
                  onChange={(e) => updateGroup(group.key, { category: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Descripción</label>
                <input
                  className={inputClass}
                  value={group.description}
                  onChange={(e) => updateGroup(group.key, { description: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={() => removeGroup(group.key)}
              className="mt-6 rounded-md p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
              aria-label="Eliminar categoría"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.tiers.map((tier) => (
              <div key={tier.key} className="rounded-sm border border-line bg-paper-dim p-4">
                <div className="flex items-start justify-between gap-2">
                  <input
                    className={cn(inputClass, "font-medium")}
                    value={tier.name}
                    onChange={(e) => updateTier(group.key, tier.key, { name: e.target.value })}
                    placeholder="Nombre del combo"
                  />
                  <button
                    onClick={() => removeTier(group.key, tier.key)}
                    className="shrink-0 rounded-md p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                    aria-label="Eliminar combo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3">
                  <label className={labelClass}>Precio</label>
                  <input
                    className={inputClass}
                    value={tier.price}
                    onChange={(e) => updateTier(group.key, tier.key, { price: e.target.value })}
                    placeholder="$1200"
                  />
                </div>

                <div className="mt-3">
                  <label className={labelClass}>Descripción corta</label>
                  <input
                    className={inputClass}
                    value={tier.description}
                    onChange={(e) =>
                      updateTier(group.key, tier.key, { description: e.target.value })
                    }
                  />
                </div>

                <div className="mt-3">
                  <label className={labelClass}>Características (una por línea)</label>
                  <textarea
                    className={cn(inputClass, "min-h-24")}
                    value={tier.features}
                    onChange={(e) =>
                      updateTier(group.key, tier.key, { features: e.target.value })
                    }
                    placeholder={"8 horas de cobertura\n2 fotógrafos\nGalería digital privada"}
                  />
                </div>

                <label className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={tier.featured}
                    onChange={(e) =>
                      updateTier(group.key, tier.key, { featured: e.target.checked })
                    }
                    className="h-4 w-4 accent-sand"
                  />
                  Destacado (&quot;Más elegido&quot;)
                </label>
              </div>
            ))}

            <button
              onClick={() => addTier(group.key)}
              className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-line text-sm text-ink-soft transition-colors hover:border-sand hover:text-sand-dark"
            >
              <Plus className="h-5 w-5" />
              Agregar combo
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addGroup}
        className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-line py-6 text-sm text-ink-soft transition-colors hover:border-sand hover:text-sand-dark"
      >
        <Plus className="h-4 w-4" />
        Agregar categoría de servicio
      </button>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
          <div className="text-sm">
            {error && <span className="text-red-600">{error}</span>}
            {saved && !error && <span className="text-emerald-600">Cambios guardados.</span>}
          </div>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-sand-dark disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
