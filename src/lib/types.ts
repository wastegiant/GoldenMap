export type AssetSymbol = "XAU" | "SHG";

export type MarketSeriesPoint = {
  time: string;
  priceRmbPerG: number;
};

export type MarketSnapshot = {
  symbol: AssetSymbol;
  label: string;
  priceRmbPerG: number;
  priceUsdPerOz?: number;
  usdCny: number;
  change24hPct: number;
  updatedAt: number;
  series24h: MarketSeriesPoint[];
};

export type MarketState = {
  xau: MarketSnapshot;
  shg: MarketSnapshot;
};

export type Holding = {
  id: string;
  buyPriceRmbPerG: number;
  weightG: number;
  feeRmb: number;
  boughtAt: string;
  note?: string;
};

export type Alert = {
  id: string;
  symbol: AssetSymbol;
  targetRmbPerG: number;
  active: boolean;
  createdAt: string;
  triggeredAt?: string;
};

export type Brief = {
  date: string;
  content: string;
};

export type Settings = {
  defaultSymbol: AssetSymbol;
  pollIntervalMs: number;
  briefTimeLocal: string;
};

