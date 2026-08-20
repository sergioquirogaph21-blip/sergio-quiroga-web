import { Mail, MailOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDate, cn } from "@/lib/utils";

export default async function MensajesPage() {
  await requireAdmin();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Mensajes de contacto">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-line bg-paper py-20 text-center text-ink-soft">
          <Mail className="h-6 w-6" />
          <p>Todavía no recibiste mensajes desde el formulario de contacto.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="rounded-sm border border-line bg-paper p-6">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    {m.read ? (
                      <MailOpen className="h-4 w-4 text-ink-soft" />
                    ) : (
                      <Mail className="h-4 w-4 text-sand-dark" />
                    )}
                    <h3 className="font-medium text-ink">{m.name}</h3>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        "bg-paper-dim text-ink-soft"
                      )}
                    >
                      {m.eventType}
                    </span>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-sand-dark hover:underline">
                    {m.email}
                  </a>
                </div>
                <div className="text-right text-xs text-ink-soft">
                  <p>Enviado: {formatDate(m.createdAt)}</p>
                  {m.eventDate && <p>Evento: {formatDate(m.eventDate)}</p>}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
