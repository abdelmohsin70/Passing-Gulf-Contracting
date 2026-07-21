import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/primitives/Container";
import { CalendarIcon, ClockIcon, GaugeIcon, MapPinIcon, ShieldIcon } from "@/components/icons/icons";

export function TrustStrip({ dictionary }: { dictionary: Dictionary }) {
  const items = [
    { icon: CalendarIcon, label: dictionary.trust.since },
    { icon: MapPinIcon, label: dictionary.trust.coverage },
    { icon: ClockIcon, label: dictionary.trust.availability },
    { icon: GaugeIcon, label: dictionary.trust.integrated },
    { icon: ShieldIcon, label: dictionary.trust.certifications },
  ];

  return (
    <div className="border-b border-navy/10 bg-white py-6">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-sm font-medium text-navy sm:justify-between">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-4 text-orange" />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
