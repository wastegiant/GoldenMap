"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { AssetSymbol, MarketSnapshot, MarketState } from "@/lib/types";
import { getInitialMarketState, getMockMarketState } from "@/lib/mock";
import { useAlerts, useSettings } from "@/lib/hooks";
import { useToast } from "@/components/toast-provider";

type MarketContextValue = {
  market: MarketState;
  selectedSymbol: AssetSymbol;
  setSelectedSymbol: (symbol: AssetSymbol) => void;
  refreshMarket: (mode?: "manual" | "auto") => void;
  isRefreshing: boolean;
  lastUpdated: number;
  currentSnapshot: MarketSnapshot;
};

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const { settings, setSettings } = useSettings();
  const { alerts, updateAlert } = useAlerts();
  const { addToast } = useToast();

  const [market, setMarket] = useState<MarketState>(() => getInitialMarketState());
  const [selectedSymbolState, setSelectedSymbolState] = useState<AssetSymbol>(settings.defaultSymbol);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastManualRefreshRef = useRef(0);

  useEffect(() => {
    setSelectedSymbolState(settings.defaultSymbol);
  }, [settings.defaultSymbol]);

  const refreshMarket = useCallback(
    (mode: "manual" | "auto" = "auto") => {
      const now = Date.now();
      if (mode === "manual" && now - lastManualRefreshRef.current < 1000) {
        return;
      }
      if (mode === "manual") {
        lastManualRefreshRef.current = now;
      }
      setIsRefreshing(true);
      const nextMarket = getMockMarketState();
      setMarket(nextMarket);
      setLastUpdated(Date.now());
      setIsRefreshing(false);
    },
    []
  );

  useEffect(() => {
    refreshMarket("auto");
  }, [refreshMarket]);

  useEffect(() => {
    const timer = setInterval(() => refreshMarket("auto"), settings.pollIntervalMs);
    return () => clearInterval(timer);
  }, [refreshMarket, settings.pollIntervalMs]);

  useEffect(() => {
    const handleAlerts = () => {
      const snapshotBySymbol: Record<AssetSymbol, MarketSnapshot> = {
        XAU: market.xau,
        SHG: market.shg,
      };

      alerts.forEach((alert) => {
        if (!alert.active) {
          return;
        }
        const snapshot = snapshotBySymbol[alert.symbol];
        const min = Math.min(alert.targetMinRmbPerG, alert.targetMaxRmbPerG);
        const max = Math.max(alert.targetMinRmbPerG, alert.targetMaxRmbPerG);
        if (snapshot.priceRmbPerG >= min && snapshot.priceRmbPerG <= max) {
          updateAlert(alert.id, (prev) => ({
            ...prev,
            active: false,
            triggeredAt: new Date().toISOString(),
          }));

          addToast({
            title: `${snapshot.label} 触达提醒`,
            description: `当前价 ${snapshot.priceRmbPerG.toFixed(2)} 元/克 ∈ 区间 ${min}-${max} 元/克`,
          });

          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("GoldMate 价格提醒", {
                body: `${snapshot.label} 达到区间 ${min}-${max} 元/克`,
              });
            }
          }

          fetch("/api/feishu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `GoldMate 价格提醒：${snapshot.label} 当前价 ${snapshot.priceRmbPerG.toFixed(
                2
              )} 元/克，已进入目标区间 ${min}-${max} 元/克。`,
            }),
          }).catch(() => {});
        }
      });
    };

    handleAlerts();
  }, [alerts, market, updateAlert, addToast]);

  const setSelectedSymbol = useCallback(
    (symbol: AssetSymbol) => {
      setSelectedSymbolState(symbol);
      setSettings((prev) => ({ ...prev, defaultSymbol: symbol }));
    },
    [setSettings]
  );

  const currentSnapshot = selectedSymbolState === "XAU" ? market.xau : market.shg;

  const value = useMemo(
    () => ({
      market,
      selectedSymbol: selectedSymbolState,
      setSelectedSymbol,
      refreshMarket,
      isRefreshing,
      lastUpdated,
      currentSnapshot,
    }),
    [market, selectedSymbolState, setSelectedSymbol, refreshMarket, isRefreshing, lastUpdated, currentSnapshot]
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error("useMarket must be used within MarketProvider");
  }
  return context;
}

