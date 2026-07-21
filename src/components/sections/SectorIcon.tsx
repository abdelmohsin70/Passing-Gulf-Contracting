import type { Sector } from "@/data/sectors";
import type { IconProps } from "@/components/icons/icons";
import {
  BuildingIcon,
  HeartPulseIcon,
  HomeIcon,
  FactoryIcon,
  GraduationCapIcon,
  PlaneIcon,
  LandmarkIcon,
} from "@/components/icons/icons";

const map: Record<Sector["icon"], (props: IconProps) => React.JSX.Element> = {
  office: BuildingIcon,
  health: HeartPulseIcon,
  residential: HomeIcon,
  industrial: FactoryIcon,
  education: GraduationCapIcon,
  airport: PlaneIcon,
  government: LandmarkIcon,
};

export function SectorIcon({ icon, className }: { icon: Sector["icon"]; className?: string }) {
  const Icon = map[icon];
  return <Icon className={className} />;
}
