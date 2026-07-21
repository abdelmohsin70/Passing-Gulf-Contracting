import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  children: ReactNode;
  className?: string;
  tone?: "sand" | "white" | "navy";
  id?: string;
};

const tones = {
  sand: "bg-sand",
  white: "bg-white",
  navy: "bg-navy text-white",
};

export function Section({ children, className, tone = "white", id }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}
