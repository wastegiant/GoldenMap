"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionTitle } from "@/components/section-title";
import { useAlerts } from "@/lib/hooks";
import { formatRmb } from "@/lib/utils";
import { useMarket } from "@/components/market-provider";
import { useMounted } from "@/lib/use-mounted";

export default function AlertsPage() {
  const mounted = useMounted();
  const { alerts } = useAlerts();
  const { market } = useMarket();
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  if (!mounted) {
    return <div className="min-h-[240px] rounded-3xl border border-white/40 bg-white/70" />;
  }

  const handlePermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const latestBySymbol = {
    XAU: market.xau.priceRmbPerG,
    SHG: market.shg.priceRmbPerG,
  };

  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
      <SectionTitle
        title="价格提醒"
        action={
          <Link
            href="/alerts/new"
            className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
          >
            新建提醒
          </Link>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handlePermission}
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700"
        >
          {permission === "granted" ? "已启用浏览器推送" : "启用浏览器推送"}
        </button>
        <span className="text-xs text-neutral-500">提醒触达时同时显示页面提示</span>
      </div>

      <div className="mt-6 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {alert.symbol === "XAU" ? "XAU/USD" : "上海金"} 目标区间 {formatRmb(alert.targetMinRmbPerG)} - {formatRmb(alert.targetMaxRmbPerG)}/g
              </p>
              <p className="text-xs text-neutral-500">当前价 {formatRmb(latestBySymbol[alert.symbol])}/g</p>
            </div>
            <div className="text-xs text-neutral-500">
              {alert.active ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">监控中</span>
              ) : (
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-500">已触发</span>
              )}
            </div>
          </div>
        ))}
        {!alerts.length ? (
          <div className="text-sm text-neutral-500">暂无提醒，先创建一个目标价吧。</div>
        ) : null}
      </div>
    </div>
  );
}

