import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v7h3v-7h2.2l.8-3H14v-1.5a1 1 0 0 1 1-1H16V8Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-dim">
      <Container className="flex flex-col gap-10 py-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Logo tone="ink" className="h-14" />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Fotos que reviven el momento: bodas, 15s, eventos y cobertura deportiva.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="https://www.instagram.com/sergioquirogaa_/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-sand hover:text-sand"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/share/1BoSasBtS4/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-sand hover:text-sand"
              aria-label="Facebook"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href="https://wa.link/xa41v7"
              className="rounded-full border border-line p-2.5 text-ink-soft transition-colors hover:border-sand hover:text-sand"
              aria-label="Whatsapp"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-ink uppercase">
              Sitio
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><Link href="/portfolio" className="hover:text-sand">Portafolio</Link></li>
              <li><Link href="/sobre-mi" className="hover:text-sand">Sobre mí</Link></li>
              <li><Link href="/contacto" className="hover:text-sand">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-ink uppercase">
              Clientes
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li><Link href="/galeria" className="hover:text-sand">Mi galería</Link></li>
              <li><Link href="/admin" className="hover:text-sand">Panel admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] text-ink uppercase">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li>sergioquirogaph21@gmail.com</li>
              <li>+595 971261364</li>
            </ul>
          </div>
        </div>
      </Container>
      <div className="border-t border-line py-6">
        <Container className="text-center text-xs text-ink-soft">
          © {new Date().getFullYear()} Sergio Quiroga. Todos los derechos reservados.
        </Container>
      </div>
    </footer>
  );
}
