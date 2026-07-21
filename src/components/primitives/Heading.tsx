import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-[var(--radius-pill)] bg-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-dark",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  as: As = "h2",
  className,
  tone = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "start" | "center";
  as?: ElementType;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <As
        className={cn(
          "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
          tone === "dark" ? "text-navy" : "text-white"
        )}
      >
        {title}
      </As>
      {subtitle ? (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-slate" : "text-white/80")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
