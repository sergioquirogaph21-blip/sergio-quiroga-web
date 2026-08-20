"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/portfolio", label: "Portafolio" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "bg-paper/90 backdrop-blur-md shadow-[0_1px_0_0_var(--line)]" : "bg-transparent"
      )}
    >
      <Container className="flex h-24 items-center justify-between sm:h-28">
        <Link href="/" aria-label="Sergio Quiroga Fotografía" className="py-2">
          <Logo tone={solid ? "ink" : "white"} priority className="h-16 transition-all sm:h-20" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors hover:text-sand",
                solid ? "text-ink-soft" : "text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/galeria"
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium tracking-wide transition-colors",
              solid
                ? "border-ink text-ink hover:bg-ink hover:text-paper"
                : "border-white/70 text-white hover:bg-white hover:text-ink"
            )}
          >
            Acceso Clientes
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className={cn("md:hidden", solid ? "text-ink" : "text-white")}
          aria-label="Abrir menú"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium text-ink-soft hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/galeria"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-ink px-5 py-3 text-center text-sm font-medium text-ink"
              >
                Acceso Clientes
              </Link>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
