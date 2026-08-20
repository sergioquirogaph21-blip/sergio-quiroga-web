"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "No se pudo iniciar sesión.");
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <Link href="/" className="mb-8">
        <Logo className="h-16" />
      </Link>

      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <Lock className="h-5 w-5 text-sand" />
      </div>

      <h1 className="mt-6 font-serif text-2xl text-white">Panel de administración</h1>

      <form onSubmit={onSubmit} className="mt-8 w-full max-w-xs space-y-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña de administrador"
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
          Ingresar
        </button>
      </form>
    </div>
  );
}
