import Image from "next/image";
import type { Solution } from "@/data/solutions";
import { PlaceholderGallery } from "@/components/sections/PlaceholderGallery";
import { Reveal } from "@/components/Reveal";

export function SiteGallery({
  images,
  icon,
  placeholderLabel,
}: {
  images: string[] | undefined;
  icon: Solution["icon"];
  placeholderLabel: string;
}) {
  if (!images || images.length === 0) {
    return <PlaceholderGallery icon={icon} label={placeholderLabel} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {images.map((src, index) => (
        <Reveal key={src} delay={index * 90} variant="scale" className="aspect-square overflow-hidden rounded-[var(--radius-card)]">
          <div className="group relative size-full">
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
