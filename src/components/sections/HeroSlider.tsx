"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Full-bleed hero background slider: cross-fades through the client's
 * real photos under a navy gradient, with dot indicators. Cross-fade
 * (opacity only, no translate) keeps it identical in RTL and LTR.
 * Auto-advance pauses for users who prefer reduced motion.
 */
export function HeroSlider({ images, children }: { images: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative overflow-hidden bg-navy text-white">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${index === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60" />
      <div className="relative">{children}</div>
      {images.length > 1 ? (
        <div className="absolute bottom-5 start-1/2 flex -translate-x-1/2 gap-2 rtl:translate-x-1/2">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              aria-label={`${index + 1} / ${images.length}`}
              onClick={() => setActive(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === active ? "w-6 bg-orange" : "w-1.5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
