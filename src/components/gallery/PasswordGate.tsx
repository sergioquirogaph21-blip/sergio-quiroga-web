"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function PasswordGate({
  slug,
  title,
  clientName,
}: {
  slug: string;
  title: string;
  clientName?: string | null;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/galeria/${slug}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudo verificar la contraseña.");
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      setError("Ocurrió un error de conexión.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <Logo className="mb-8 h-16" />

      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <Lock className="h-5 w-5 text-sand" />
      </div>

      <h1 className="mt-6 font-serif text-2xl text-white sm:text-3xl">{title}</h1>
      {clientName && <p className="mt-1 text-sm text-white/60">Para {clientName}</p>}
      <p className="mt-4 max-w-xs text-sm text-white/60">
        Esta galería es privada. Ingresá la contraseña que te compartí para
        acceder a tus fotos.
      </p>

      <form onSubmit={onSubmit} className="mt-8 w-full max-w-xs space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          autoFocus
          className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-center text-sm text-white placeholder:text-white/40 outline-none focus:border-sand"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-sand px-5 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-white disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Ver mi galería
        </button>
      </form>
    </div>
  );
}
