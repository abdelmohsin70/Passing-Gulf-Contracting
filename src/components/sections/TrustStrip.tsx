import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/Reveal";
import { CalendarIcon, ClockIcon, GaugeIcon, MapPinIcon, ShieldIcon } from "@/components/icons/icons";

export function TrustStrip({ dictionary }: { dictionary: Dictionary }) {
  const items = [
    { icon: CalendarIcon, label: dictionary.trust.since },
    { icon: MapPinIcon, label: dictionary.trust.coverage },
    { icon: ClockIcon, label: dictionary.trust.availability },
    { icon: GaugeIcon, label: dictionary.trust.integrated },
    { icon: ShieldIcon, label: dictionary.trust.certifications, pending: dictionary.trust.certificationsPending },
  ];

  return (
    <div className="border-b border-navy/10 bg-sand py-6 sm:py-8">
      <Container>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {items.map(({ icon: Icon, label, pending }, index) => (
            <Reveal
              key={label}
              delay={index * 70}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-navy/10 bg-white px-4 py-3.5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold leading-snug text-navy">
                {label}
                {pending ? (
                  <span className="mt-1 block text-[11px] font-medium text-slate">{pending}</span>
                ) : null}
              </span>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
