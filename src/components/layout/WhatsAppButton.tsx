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
      className="focus-ring fixed bottom-5 end-5 z-40 flex size-14 items-center justify-center rounded-full bg-success text-white shadow-lift transition-transform duration-200 hover:scale-110 active:scale-95 motion-reduce:hover:scale-100"
      aria-label={label}
    >
      <span
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-success/60 motion-reduce:hidden"
        style={{ animationIterationCount: 3, animationDuration: "1.8s" }}
        aria-hidden
      />
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
