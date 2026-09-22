import { useMemo } from "react";

/** Ambient fog, drifting embers and a faint grid floor. Purely decorative. */
export function Atmosphere({ dense = false }: { dense?: boolean }) {
  const embers = useMemo(
    () =>
      Array.from({ length: dense ? 26 : 14 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        delay: (i * 1.37) % 12,
        duration: 9 + ((i * 3) % 11),
        size: 1 + (i % 3),
        toxic: i % 3 === 0,
      })),
    [dense],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 crypt-bg" />
      <div className="absolute inset-x-0 bottom-0 h-[60vh] grid-floor opacity-60" />
      <div className="animate-fog absolute -left-1/4 top-1/4 h-[42rem] w-[52rem] rounded-full bg-primary/8 blur-[120px]" />
      <div
        className="animate-fog absolute -right-1/4 bottom-0 h-[36rem] w-[46rem] rounded-full bg-toxic/6 blur-[130px]"
        style={{ animationDelay: "-9s" }}
      />
      {embers.map((e) => (
        <span
          key={e.id}
          className={`animate-ember absolute bottom-0 rounded-full ${e.toxic ? "bg-toxic" : "bg-primary"}`}
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            boxShadow: "0 0 8px currentColor",
          }}
        />
      ))}
    </div>
  );
}
