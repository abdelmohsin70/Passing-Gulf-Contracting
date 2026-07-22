/**
 * `template.tsx` remounts on every navigation (unlike `layout.tsx`, which
 * persists), so the `animate-fade-up` CSS animation defined in globals.css
 * fires fresh on each page. This gives every route a consistent, subtle
 * enter transition without any JS-driven transition logic. Respects
 * `prefers-reduced-motion` via the global override in globals.css.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}
