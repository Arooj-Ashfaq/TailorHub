import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-gold" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</span>
          <span className="h-px w-8 bg-gold" />
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl leading-[1.1]">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-base md:text-lg">{description}</p>
      )}
    </div>
  );
}
