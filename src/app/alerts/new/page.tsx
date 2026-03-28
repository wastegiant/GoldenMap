"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlerts } from "@/lib/hooks";
import { uid } from "@/lib/utils";
import { useMarket } from "@/components/market-provider";
import type { AssetSymbol } from "@/lib/types";

export default function NewAlertPage() {
  const router = useRouter();
  const { addAlert } = useAlerts();
  const { selectedSymbol, currentSnapshot } = useMarket();

  const [symbol, setSymbol] = useState<AssetSymbol>(selectedSymbol);
  const [minPrice, setMinPrice] = useState(currentSnapshot.priceRmbPerG.toFixed(2));
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const min = Number(minPrice || maxPrice || currentSnapshot.priceRmbPerG);
    const max = Number(maxPrice || minPrice || currentSnapshot.priceRmbPerG);
    addAlert({
      id: uid("alert"),
      symbol,
      targetMinRmbPerG: min,
      targetMaxRmbPerG: max,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    router.push("/alerts");
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
      <h2 className="text-xl font-semibold text-neutral-900">新建价格提醒</h2>
      <p className="mt-2 text-sm text-neutral-500">当价格进入目标区间时触发一次提醒。</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="text-neutral-700">监控品种</span>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            value={symbol}
            onChange={(event) => setSymbol(event.target.value as AssetSymbol)}
          >
            <option value="XAU">XAU/USD</option>
            <option value="SHG">上海金</option>
          </select>
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-neutral-700">区间下限 (元/克)</span>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
              type="number"
              min={0}
              step={0.01}
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-700">区间上限 (元/克)</span>
            <input
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
              type="number"
              min={0}
              step={0.01}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="可选"
            />
          </label>
        </div>
        <p className="text-xs text-neutral-500">只填写一个值时，会自动视为 min = max。</p>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            保存提醒
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700"
            onClick={() => router.back()}
          >
            返回
          </button>
        </div>
      </form>
    </div>
  );
}
