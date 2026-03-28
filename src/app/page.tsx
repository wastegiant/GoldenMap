"use client";

import Link from "next/link";
import { PriceChart } from "@/components/price-chart";
import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { useMarket } from "@/components/market-provider";
import { useHoldings } from "@/lib/hooks";
import { useMounted } from "@/lib/use-mounted";
import { formatPercent, formatRmb, formatNumber } from "@/lib/utils";

export default function Home() {
  const mounted = useMounted();
  const { currentSnapshot } = useMarket();
  const { holdings } = useHoldings();

  if (!mounted) {
    return <div className="min-h-[360px] rounded-3xl border border-white/40 bg-white/70" />;
  }

  const totalWeight = holdings.reduce((sum, item) => sum + item.weightG, 0);
  const totalCost = holdings.reduce((sum, item) => sum + item.buyPriceRmbPerG * item.weightG, 0);
  const marketValue = currentSnapshot.priceRmbPerG * totalWeight;
  const profit = marketValue - totalCost;
  const avgCost = totalWeight ? totalCost / totalWeight : 0;

  const changeClass = currentSnapshot.change24hPct >= 0 ? "text-emerald-600" : "text-rose-600";

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
          <SectionTitle
            title="24H 价格走势"
            action={
              <span className={`text-sm font-semibold ${changeClass}`}>
                {currentSnapshot.change24hPct >= 0 ? "+" : ""}
                {formatPercent(currentSnapshot.change24hPct)}
              </span>
            }
          />
          <div className="mt-4">
            <PriceChart data={currentSnapshot.series24h} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <StatCard
            title="实时价格"
            value={
              <div className="flex items-baseline gap-2">
                <span>{formatRmb(currentSnapshot.priceRmbPerG)}</span>
                <span className="text-sm font-medium text-neutral-500">/g</span>
              </div>
            }
            subtitle={
              currentSnapshot.priceUsdPerOz
                ? `约 ${currentSnapshot.priceUsdPerOz.toFixed(2)} USD/oz`
                : "上海金人民币计价"
            }
          />
          <StatCard
            title="持仓市值"
            value={totalWeight ? formatRmb(marketValue) : "暂无持仓"}
            subtitle={totalWeight ? `${formatNumber(totalWeight, 2)} g · 均价 ${formatRmb(avgCost)}/g` : ""}
            accent="emerald"
          />
          <StatCard
            title="浮动盈亏"
            value={totalWeight ? formatRmb(profit) : "--"}
            subtitle={totalWeight ? `成本 ${formatRmb(totalCost)}` : ""}
            accent={profit >= 0 ? "emerald" : "rose"}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
          <SectionTitle
            title="持仓概览"
            action={<span className="text-xs text-neutral-500">实时同步</span>}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-100 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">总克数</p>
              <p className="mt-2 text-xl font-semibold text-neutral-900">
                {totalWeight ? `${formatNumber(totalWeight, 2)} g` : "--"}
              </p>
              <p className="mt-1 text-xs text-neutral-500">均价 {formatRmb(avgCost)}/g</p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-white/90 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">市值</p>
              <p className="mt-2 text-xl font-semibold text-neutral-900">{formatRmb(marketValue)}</p>
              <p className="mt-1 text-xs text-neutral-500">成本 {formatRmb(totalCost)}</p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-white/90 p-4 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">浮动盈亏</p>
              <p
                className={`mt-2 text-2xl font-semibold ${
                  profit >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {formatRmb(profit)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
          <SectionTitle
            title="快捷操作"
            action={<span className="text-xs text-neutral-500">一键进入</span>}
          />
          <div className="mt-6 grid gap-4">
            <Link
              href="/assets/new"
              className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
            >
              记录新的买入
              <span className="text-xs">+ 持仓</span>
            </Link>
            <Link
              href="/alerts/new"
              className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white px-4 py-4 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              新建价格提醒
              <span className="text-xs">+ 提醒</span>
            </Link>
            <Link
              href="/assets"
              className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white px-4 py-4 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              查看持仓详情
              <span className="text-xs">明细</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

