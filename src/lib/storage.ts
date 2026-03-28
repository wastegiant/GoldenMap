import type { Alert, Brief, Holding, Settings } from "@/lib/types";
import { getMockBrief } from "@/lib/mock";

export const storageKeys = {
  holdings: "goldmate:holdings",
  alerts: "goldmate:alerts",
  settings: "goldmate:settings",
  brief: "goldmate:brief",
};

export const defaultSettings: Settings = {
  defaultSymbol: "XAU",
  pollIntervalMs: 5 * 60 * 1000,
  briefTimeLocal: "09:00",
};

export const defaultHoldings: Holding[] = [
  {
    id: "seed_001",
    buyPriceRmbPerG: 498.5,
    weightG: 12.4,
    boughtAt: "2026-03-01",
    note: "首批试运行持仓",
  },
  {
    id: "seed_002",
    buyPriceRmbPerG: 505.2,
    weightG: 8.1,
    boughtAt: "2026-03-08",
  },
];

export const defaultAlerts: Alert[] = [
  {
    id: "alert_001",
    symbol: "XAU",
    targetMinRmbPerG: 520,
    targetMaxRmbPerG: 520,
    active: true,
    createdAt: "2026-03-10",
  },
];

export const defaultBrief: Brief = getMockBrief();

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

