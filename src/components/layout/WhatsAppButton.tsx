"use client";

import { WhatsAppIcon } from "@/components/icons/icons";
import { whatsappHref } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppButton({ number, label }: { number: string | null; label: string }) {
  if (!number) return null;

  return (
    <a
      href={whatsappHref(number)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click", { source: "floating_button" })}
      className="focus-ring fixed bottom-5 end-5 z-40 flex size-14 items-center justify-center rounded-full bg-success text-white shadow-lift transition-transform hover:scale-105"
      aria-label={label}
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
