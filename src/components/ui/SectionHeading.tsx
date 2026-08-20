import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-sand-dark uppercase">
          {align === "center" && <span className="h-px w-8 bg-sand" />}
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-sand" />}
        </span>
      )}
      <h2 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-balance text-base text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}
