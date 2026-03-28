"use client";

import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { useHoldings } from "@/lib/hooks";
import { formatNumber, formatRmb } from "@/lib/utils";
import { useMarket } from "@/components/market-provider";
import { useMounted } from "@/lib/use-mounted";

export default function AssetsPage() {
  const mounted = useMounted();
  const { holdings } = useHoldings();
  const { currentSnapshot } = useMarket();

  if (!mounted) {
    return <div className="min-h-[240px] rounded-3xl border border-white/40 bg-white/70" />;
  }

  const totalWeight = holdings.reduce((sum, item) => sum + item.weightG, 0);
  const totalCost = holdings.reduce((sum, item) => sum + item.buyPriceRmbPerG * item.weightG, 0);
  const marketValue = currentSnapshot.priceRmbPerG * totalWeight;
  const profit = marketValue - totalCost;

  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
      <SectionTitle
        title="我的持仓"
        action={
          <Link
            href="/assets/new"
            className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
          >
            新增记录
          </Link>
        }
      />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">总成本</p>
          <p className="mt-2 text-lg font-semibold text-neutral-900">{formatRmb(totalCost)}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">当前市值</p>
          <p className="mt-2 text-lg font-semibold text-neutral-900">{formatRmb(marketValue)}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">浮动盈亏</p>
          <p className={`mt-2 text-lg font-semibold ${profit >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatRmb(profit)}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-[0.2em] text-neutral-500">
            <tr>
              <th className="px-4 py-3">日期</th>
              <th className="px-4 py-3">买入价</th>
              <th className="px-4 py-3">克数</th>
              <th className="px-4 py-3">成本</th>
              <th className="px-4 py-3">备注</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((item) => {
              const cost = item.buyPriceRmbPerG * item.weightG;
              return (
                <tr key={item.id} className="border-t border-neutral-100 bg-white/90">
                  <td className="px-4 py-3 text-neutral-700">{item.boughtAt}</td>
                  <td className="px-4 py-3 text-neutral-700">{formatRmb(item.buyPriceRmbPerG)}/g</td>
                  <td className="px-4 py-3 text-neutral-700">{formatNumber(item.weightG, 2)} g</td>
                  <td className="px-4 py-3 text-neutral-900">{formatRmb(cost)}</td>
                  <td className="px-4 py-3 text-neutral-500">{item.note ?? "--"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!holdings.length ? (
          <div className="px-4 py-6 text-sm text-neutral-500">暂无持仓记录</div>
        ) : null}
      </div>
    </div>
  );
}

