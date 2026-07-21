import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "sand",
  className,
}: {
  children: ReactNode;
  tone?: "sand" | "orange" | "success" | "pending";
  className?: string;
}) {
  const tones = {
    sand: "bg-sand text-navy border border-navy/10",
    orange: "bg-orange/10 text-orange-dark border border-orange/20",
    success: "bg-success/10 text-success border border-success/20",
    pending: "bg-slate/10 text-slate border border-slate/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
