export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        aria-label="Loading"
        role="status"
        className="size-10 animate-spin rounded-full border-4 border-navy/15 border-t-orange"
      />
    </div>
  );
}
