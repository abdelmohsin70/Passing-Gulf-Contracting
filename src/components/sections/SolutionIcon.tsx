import type { Solution } from "@/data/solutions";
import type { IconProps } from "@/components/icons/icons";
import {
  WrenchIcon,
  SparklesIcon,
  HammerIcon,
  LeafIcon,
  PlaneIcon,
  BugIcon,
  ConciergeIcon,
  HomeIcon,
} from "@/components/icons/icons";

const map: Record<Solution["icon"], (props: IconProps) => React.JSX.Element> = {
  wrench: WrenchIcon,
  sparkles: SparklesIcon,
  hammer: HammerIcon,
  leaf: LeafIcon,
  plane: PlaneIcon,
  bug: BugIcon,
  concierge: ConciergeIcon,
  home: HomeIcon,
};

export function SolutionIcon({ icon, className }: { icon: Solution["icon"]; className?: string }) {
  const Icon = map[icon];
  return <Icon className={className} />;
}
