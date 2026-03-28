import { formatDateISO } from "@/lib/utils";
import type { Brief, MarketSnapshot, MarketState } from "@/lib/types";
import { toRmbPerGFromUsdOz } from "@/lib/utils";

const BASE_XAU_USD = 2150;
const BASE_USD_CNY = 7.2;
const BASE_SHG_RMB = 510;

function jitter(value: number, variance: number) {
  const delta = (Math.random() - 0.5) * variance * 2;
  return value + delta;
}

function generateSeries(basePrice: number) {
  const now = new Date();
  const points = [] as { time: string; priceRmbPerG: number }[];
  let current = basePrice;

  for (let i = 23; i >= 0; i -= 1) {
    const pointTime = new Date(now.getTime() - i * 60 * 60 * 1000);
    current = jitter(current, basePrice * 0.006);
    const label = pointTime.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    points.push({ time: label, priceRmbPerG: Number(current.toFixed(2)) });
  }

  return points;
}

function generateStableSeries(basePrice: number) {
  return Array.from({ length: 24 }, (_, index) => {
    const time = `${String(index).padStart(2, "0")}:00`;
    const offset = (index - 12) * 0.18;
    return { time, priceRmbPerG: Number((basePrice + offset).toFixed(2)) };
  });
}

function buildSnapshot(
  symbol: "XAU" | "SHG",
  options: {
    label: string;
    priceRmbPerG: number;
    priceUsdPerOz?: number;
    usdCny: number;
  }
): MarketSnapshot {
  const series24h = generateSeries(options.priceRmbPerG);
  const change24hPct =
    ((options.priceRmbPerG - series24h[0].priceRmbPerG) /
      series24h[0].priceRmbPerG) *
    100;

  return {
    symbol,
    label: options.label,
    priceRmbPerG: Number(options.priceRmbPerG.toFixed(2)),
    priceUsdPerOz: options.priceUsdPerOz,
    usdCny: options.usdCny,
    change24hPct: Number(change24hPct.toFixed(2)),
    updatedAt: Date.now(),
    series24h,
  };
}

export function getInitialMarketState(): MarketState {
  const usdCny = BASE_USD_CNY;
  const xauUsd = BASE_XAU_USD;
  const xauRmb = toRmbPerGFromUsdOz(xauUsd, usdCny);
  const shgRmb = BASE_SHG_RMB;

  return {
    xau: {
      symbol: "XAU",
      label: "XAU/USD",
      priceRmbPerG: Number(xauRmb.toFixed(2)),
      priceUsdPerOz: Number(xauUsd.toFixed(2)),
      usdCny,
      change24hPct: 0.35,
      updatedAt: 0,
      series24h: generateStableSeries(xauRmb),
    },
    shg: {
      symbol: "SHG",
      label: "上海金",
      priceRmbPerG: Number(shgRmb.toFixed(2)),
      usdCny,
      change24hPct: -0.18,
      updatedAt: 0,
      series24h: generateStableSeries(shgRmb),
    },
  };
}

export function getMockMarketState(): MarketState {
  const usdCny = jitter(BASE_USD_CNY, 0.05);
  const xauUsd = jitter(BASE_XAU_USD, 25);
  const xauRmb = toRmbPerGFromUsdOz(xauUsd, usdCny);
  const shgRmb = jitter(BASE_SHG_RMB, 4);

  return {
    xau: buildSnapshot("XAU", {
      label: "XAU/USD",
      priceRmbPerG: xauRmb,
      priceUsdPerOz: xauUsd,
      usdCny,
    }),
    shg: buildSnapshot("SHG", {
      label: "上海金",
      priceRmbPerG: shgRmb,
      usdCny,
    }),
  };
}

export function getMockBrief(): Brief {
  const date = formatDateISO();
  return {
    date,
    content:
      "今日金价区间震荡，避险需求保持高位。\n" +
      "? 美元指数短线回落，对金价形成支撑。\n" +
      "? 关注本周宏观数据公布节奏，警惕短线波动放大。\n" +
      "? 建议保持仓位弹性，分批策略更优。",
  };
}

