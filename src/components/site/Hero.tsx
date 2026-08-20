"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2400&auto=format&fit=crop"
        alt="Sergio Quiroga Fotografía"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-3 text-xs font-medium tracking-[0.4em] text-white/80 uppercase"
        >
          <span className="h-px w-10 bg-sand" />
          Fotógrafo
          <span className="h-px w-10 bg-sand" />
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="font-serif text-5xl leading-[1.05] text-white sm:text-7xl lg:text-8xl"
        >
          Sergio Quiroga
          <br />
          <span className="italic text-sand">Fotografía</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-6 max-w-lg text-balance text-base font-light text-white/85 sm:text-lg"
        >
          Fotos que reviven el momento: bodas, 15 años, eventos y cobertura deportiva.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/contacto"
            className="rounded-full bg-sand px-8 py-3.5 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-white"
          >
            Reservar
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-white/60 px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-white/10"
          >
            Ver portafolio
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
}
