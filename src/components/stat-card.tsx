import type { ReactNode } from "react";

export function StatCard({
  title,
  value,
  subtitle,
  accent = "amber",
}: {
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  accent?: "amber" | "slate" | "emerald" | "rose";
}) {
  const accentMap: Record<string, string> = {
    amber: "bg-amber-500/90",
    slate: "bg-neutral-800",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/75 p-6 shadow-lg shadow-amber-200/40">
      <div className={`absolute right-4 top-4 h-10 w-10 rounded-full ${accentMap[accent]} opacity-20`} />
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">{title}</p>
      <div className="mt-3 text-2xl font-semibold text-neutral-900">{value}</div>
      {subtitle ? <div className="mt-1 text-sm text-neutral-500">{subtitle}</div> : null}
    </div>
  );
}

