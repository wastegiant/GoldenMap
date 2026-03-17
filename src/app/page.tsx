"use client";

import Link from "next/link";
import { PriceChart } from "@/components/price-chart";
import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { useMarket } from "@/components/market-provider";
import { useBrief, useHoldings } from "@/lib/hooks";
import { formatPercent, formatRmb, formatNumber } from "@/lib/utils";

export default function Home() {
  const { currentSnapshot } = useMarket();
  const { holdings } = useHoldings();
  const { brief } = useBrief();

  const totalWeight = holdings.reduce((sum, item) => sum + item.weightG, 0);
  const totalCost = holdings.reduce(
    (sum, item) => sum + item.buyPriceRmbPerG * item.weightG + item.feeRmb,
    0
  );
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

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
          <SectionTitle
            title="AI 财经简报"
            action={<span className="text-xs text-neutral-500">每日 09:00 自动更新</span>}
          />
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-neutral-700">{brief.content}</p>
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

