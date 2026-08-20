import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Isotipo de Sergio Quiroga Fotografía. El archivo fuente
 * (/public/logo-sinfondo.png) es blanco sobre fondo transparente, pensado
 * para fondos oscuros. Con tone="ink" se invierte a negro (filter
 * brightness-0) para poder usarlo también sobre fondos claros, sin
 * necesitar un segundo archivo.
 */
export function Logo({
  tone = "white",
  className,
  priority,
}: {
  tone?: "white" | "ink";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-sinfondo.png"
      alt="Sergio Quiroga Fotografía"
      width={499}
      height={500}
      priority={priority}
      className={cn("h-12 w-auto", tone === "ink" && "brightness-0", className)}
    />
  );
}
