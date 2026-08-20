"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { slugify } from "@/lib/utils";

export default function GaleriaLandingPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/galeria/${slugify(trimmed)}`);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <Link href="/" className="mb-10">
        <Logo className="h-16" />
      </Link>

      <span className="text-xs font-medium tracking-[0.3em] text-sand uppercase">
        Portal de clientes
      </span>
      <h1 className="mt-4 font-serif text-3xl text-white sm:text-4xl">
        Accedé a tu galería privada
      </h1>
      <p className="mt-3 max-w-sm text-sm text-white/70">
        Ingresá el código o enlace de tu galería que te compartí por email o
        WhatsApp. Si ya tenés el enlace directo, simplemente abrilo.
      </p>

      <form onSubmit={onSubmit} className="mt-10 flex w-full max-w-sm gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de galería"
          className="w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-sand"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-full bg-sand p-3 text-ink transition-colors hover:bg-white"
          aria-label="Ingresar"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <p className="mt-8 text-xs text-white/40">
        ¿No tenés tu enlace?{" "}
        <Link href="/contacto" className="text-sand underline underline-offset-4">
          Contactame
        </Link>
      </p>
    </div>
  );
}
