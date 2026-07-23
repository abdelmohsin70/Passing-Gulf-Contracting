import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";

/** Shimmer block used to build page skeletons. */
function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-navy/10 ${className}`} />;
}

/**
 * Skeleton for a content-index page (hero band + card grid). Shown by the
 * route's loading.tsx while the server fetches CMS data, so navigation
 * feels instant instead of blank.
 */
export function GridPageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <>
      <Section tone="sand" className="pt-10">
        <Container>
          <Bar className="h-9 w-64 max-w-full" />
          <Bar className="mt-4 h-4 w-96 max-w-full" />
        </Container>
      </Section>
      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: cards }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-soft">
                <Bar className="h-44 w-full rounded-none" />
                <div className="p-6">
                  <Bar className="h-5 w-2/3" />
                  <Bar className="mt-3 h-3 w-full" />
                  <Bar className="mt-2 h-3 w-4/5" />
                  <Bar className="mt-5 h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

/** Skeleton for a detail page (navy hero + two-column body). */
export function DetailPageSkeleton() {
  return (
    <>
      <div className="bg-navy py-16">
        <Container>
          <Bar className="h-9 w-72 max-w-full bg-white/15" />
          <Bar className="mt-4 h-4 w-96 max-w-full bg-white/10" />
        </Container>
      </div>
      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              <Bar className="h-6 w-48" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-3/4" />
              <Bar className="mt-6 h-6 w-40" />
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-5/6" />
            </div>
            <div className="space-y-4">
              <Bar className="aspect-[4/3] w-full" />
              <Bar className="h-32 w-full" />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
