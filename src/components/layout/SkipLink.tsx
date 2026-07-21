import type { Dictionary } from "@/i18n/dictionaries";

export function SkipLink({ dictionary }: { dictionary: Dictionary }) {
  return (
    <a
      href="#main-content"
      className="focus-ring absolute start-4 top-2 z-[100] -translate-y-24 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-2"
    >
      {dictionary.common.skipToContent}
    </a>
  );
}
