import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import { clientLogos } from "@/data/clients";
import { Badge } from "@/components/primitives/Badge";

export function ClientLogoGrid({ dictionary }: { dictionary: Dictionary }) {
  if (clientLogos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-navy/15 bg-white/50 py-10 text-center">
        <Badge tone="pending">{dictionary.home.clientsPendingNote}</Badge>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 lg:grid-cols-6">
      {clientLogos.map((client) => (
        <div key={client.name} className="flex items-center justify-center opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0">
          <Image src={client.logoSrc} alt={client.name} width={140} height={56} className="h-10 w-auto object-contain" />
        </div>
      ))}
    </div>
  );
}
