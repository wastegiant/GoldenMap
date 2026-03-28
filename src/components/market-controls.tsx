"use client";

import { useMarket } from "@/components/market-provider";
import { formatDateTime, formatRmb, formatUsd } from "@/lib/utils";

export function MarketControls() {
  const { selectedSymbol, setSelectedSymbol, refreshMarket, isRefreshing, lastUpdated, currentSnapshot } = useMarket();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">实时行情</p>
          <p className="text-lg font-semibold text-neutral-900">
            {currentSnapshot.label}
            <span className="ml-2 text-sm font-medium text-neutral-500">{formatRmb(currentSnapshot.priceRmbPerG)}/g</span>
          </p>
          {currentSnapshot.priceUsdPerOz ? (
            <p className="text-xs text-neutral-500">{formatUsd(currentSnapshot.priceUsdPerOz)}/oz · USD/CNY {currentSnapshot.usdCny.toFixed(2)}</p>
          ) : (
            <p className="text-xs text-neutral-500">人民币计价 · 上海金</p>
          )}
        </div>
        <button
          onClick={() => refreshMarket("manual")}
          className="rounded-full border border-neutral-200 bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
        >
          {isRefreshing ? "刷新中" : "手动刷新"}
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSymbol("XAU")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedSymbol === "XAU" ? "bg-amber-500 text-white" : "bg-amber-100/60 text-amber-900"
          }`}
        >
          XAU/USD
        </button>
        <button
          onClick={() => setSelectedSymbol("SHG")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            selectedSymbol === "SHG" ? "bg-amber-500 text-white" : "bg-amber-100/60 text-amber-900"
          }`}
        >
          上海金
        </button>
        <span className="text-xs text-neutral-500">
          {lastUpdated ? `更新于 ${formatDateTime(lastUpdated)}` : "正在同步"}
        </span>
      </div>
    </div>
  );
}

