import type { ReactNode } from "react";

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

