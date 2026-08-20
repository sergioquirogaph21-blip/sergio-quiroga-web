import Link from "next/link";
import { LayoutGrid, Plus, ExternalLink, Mail, Image as ImageIcon, Tag } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Logo } from "@/components/ui/Logo";

export function AdminShell({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper-dim">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-line bg-paper px-6 py-8 md:flex">
          <Link href="/admin">
            <Logo tone="ink" className="h-16" />
          </Link>

          <nav className="mt-10 flex flex-1 flex-col gap-1">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              <LayoutGrid className="h-4 w-4" />
              Galerías
            </Link>
            <Link
              href="/admin/galerias/nueva"
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              <Plus className="h-4 w-4" />
              Nueva galería
            </Link>
            <Link
              href="/admin/mensajes"
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              <Mail className="h-4 w-4" />
              Mensajes de contacto
            </Link>
            <div className="my-2 border-t border-line" />
            <Link
              href="/admin/portfolio"
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              <ImageIcon className="h-4 w-4" />
              Portafolio
            </Link>
            <Link
              href="/admin/servicios"
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              <Tag className="h-4 w-4" />
              Servicios y precios
            </Link>
            <div className="my-2 border-t border-line" />
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-dim hover:text-ink"
            >
              <ExternalLink className="h-4 w-4" />
              Ver sitio público
            </Link>
          </nav>

          <LogoutButton />
        </aside>

        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-serif text-3xl text-ink">{title}</h1>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
