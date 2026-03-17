"use client";

import { useState } from "react";
import { useSettings } from "@/lib/hooks";
import type { AssetSymbol } from "@/lib/types";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();

  const [defaultSymbol, setDefaultSymbol] = useState<AssetSymbol>(settings.defaultSymbol);
  const [pollInterval, setPollInterval] = useState(settings.pollIntervalMs / 60000);
  const [briefTime, setBriefTime] = useState(settings.briefTimeLocal);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSettings({
      defaultSymbol,
      pollIntervalMs: Math.max(1, Math.round(pollInterval)) * 60000,
      briefTimeLocal: briefTime,
    });
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
      <h2 className="text-xl font-semibold text-neutral-900">基础设置</h2>
      <p className="mt-2 text-sm text-neutral-500">调整默认行情与刷新频率。</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="text-neutral-700">默认展示品种</span>
          <select
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            value={defaultSymbol}
            onChange={(event) => setDefaultSymbol(event.target.value as AssetSymbol)}
          >
            <option value="XAU">XAU/USD</option>
            <option value="SHG">上海金</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">行情轮询 (分钟)</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="number"
            min={1}
            step={1}
            value={pollInterval}
            onChange={(event) => setPollInterval(Number(event.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">AI 简报生成时间</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="time"
            value={briefTime}
            onChange={(event) => setBriefTime(event.target.value)}
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
        >
          保存设置
        </button>
      </form>
    </div>
  );
}

