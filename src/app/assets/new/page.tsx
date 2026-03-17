"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useHoldings } from "@/lib/hooks";
import { uid } from "@/lib/utils";

export default function NewAssetPage() {
  const router = useRouter();
  const { addHolding } = useHoldings();

  const [buyPrice, setBuyPrice] = useState(500);
  const [weight, setWeight] = useState(5);
  const [fee, setFee] = useState(10);
  const [boughtAt, setBoughtAt] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addHolding({
      id: uid("holding"),
      buyPriceRmbPerG: Number(buyPrice),
      weightG: Number(weight),
      feeRmb: Number(fee),
      boughtAt,
      note: note.trim() || undefined,
    });
    router.push("/assets");
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-amber-200/40">
      <h2 className="text-xl font-semibold text-neutral-900">新增买入记录</h2>
      <p className="mt-2 text-sm text-neutral-500">录入买入价、克数与手续费，系统自动计算盈亏。</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="text-neutral-700">买入价 (元/克)</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="number"
            min={0}
            step={0.01}
            value={buyPrice}
            onChange={(event) => setBuyPrice(Number(event.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">克数</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="number"
            min={0}
            step={0.01}
            value={weight}
            onChange={(event) => setWeight(Number(event.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">手续费 (元)</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="number"
            min={0}
            step={0.01}
            value={fee}
            onChange={(event) => setFee(Number(event.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">买入日期</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="date"
            value={boughtAt}
            onChange={(event) => setBoughtAt(event.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">备注</span>
          <input
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2"
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="可选"
          />
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            保存记录
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

