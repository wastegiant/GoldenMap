"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MarketControls } from "@/components/market-controls";

const navItems = [
  { href: "/", label: "总览" },
  { href: "/assets", label: "持仓" },
  { href: "/alerts", label: "提醒" },
  { href: "/settings", label: "设置" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef7e2_0%,_#f3e7cf_30%,_#efe4d6_60%,_#f6f3ee_100%)] text-neutral-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-16 h-80 w-80 rounded-full bg-[#f7d07a]/40 blur-[120px]" />
        <div className="pointer-events-none absolute -left-32 top-64 h-72 w-72 rounded-full bg-[#c9a26a]/30 blur-[130px]" />
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-10">
          <header className="flex flex-col gap-6 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-xl shadow-amber-200/40 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">GoldMate</p>
                <h1 className="text-2xl font-semibold text-neutral-900 md:text-3xl">黄金资产监控工作台</h1>
                <p className="mt-2 text-sm text-neutral-600">
                  轻量化投资辅助 · 实时行情 · 资产盈亏 · 智能简报
                </p>
              </div>
              <MarketControls />
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-neutral-900 text-white shadow"
                        : "bg-white/80 text-neutral-700 hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="mt-8 flex-1">{children}</main>

          <footer className="mt-12 text-xs text-neutral-500">
            GoldMate MVP · 本地存储 · 价格提醒基于浏览器推送
          </footer>
        </div>
      </div>
    </div>
  );
}

