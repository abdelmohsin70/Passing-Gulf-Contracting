"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function TrackedLink({
  event,
  params,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { event: AnalyticsEvent; params?: Record<string, string>; children: ReactNode }) {
  return (
    <a {...props} onClick={() => trackEvent(event, params)}>
      {children}
    </a>
  );
}
