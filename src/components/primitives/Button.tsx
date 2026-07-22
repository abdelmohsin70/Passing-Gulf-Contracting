import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transition-[color,background-color,border-color,transform,box-shadow] duration-200 active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 motion-reduce:active:scale-100";

const variants = {
  primary: "bg-orange text-white hover:bg-orange-dark hover:shadow-lift",
  secondary: "bg-navy text-white hover:bg-navy-dark hover:shadow-lift",
  outline: "border border-navy/20 text-navy bg-white hover:border-orange hover:text-orange",
  // For use on dark (navy) backgrounds — kept as a distinct variant instead
  // of overriding `outline`'s classes via className, since conflicting
  // Tailwind utilities (e.g. text-navy vs text-white) don't reliably
  // override one another based on JSX class order.
  "outline-inverse": "border border-white/30 bg-transparent text-white hover:border-orange hover:text-orange",
  ghost: "text-navy hover:bg-navy/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm sm:text-base",
  lg: "px-7 py-4 text-base sm:text-lg",
};

type CommonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
    if (isExternal) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
