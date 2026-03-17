import { useEffect, useState } from "react";
import type { Alert, Brief, Holding, Settings } from "@/lib/types";
import {
  defaultAlerts,
  defaultBrief,
  defaultHoldings,
  defaultSettings,
  readJson,
  storageKeys,
  writeJson,
} from "@/lib/storage";
import { formatDateISO } from "@/lib/utils";
import { getMockBrief } from "@/lib/mock";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const stored = readJson<T>(key, initialValue);
    setValue(stored);
  }, [initialValue, key]);

  useEffect(() => {
    writeJson(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

export function useHoldings() {
  const [holdings, setHoldings] = useLocalStorageState<Holding[]>(
    storageKeys.holdings,
    defaultHoldings
  );

  const addHolding = (holding: Holding) => {
    setHoldings((prev) => [holding, ...prev]);
  };

  return { holdings, setHoldings, addHolding };
}

export function useAlerts() {
  const [alerts, setAlerts] = useLocalStorageState<Alert[]>(
    storageKeys.alerts,
    defaultAlerts
  );

  const addAlert = (alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
  };

  const updateAlert = (id: string, updater: (alert: Alert) => Alert) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? updater(alert) : alert)));
  };

  return { alerts, setAlerts, addAlert, updateAlert };
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorageState<Settings>(
    storageKeys.settings,
    defaultSettings
  );

  return { settings, setSettings };
}

export function useBrief() {
  const [brief, setBrief] = useLocalStorageState<Brief>(
    storageKeys.brief,
    defaultBrief
  );

  useEffect(() => {
    const today = formatDateISO();
    if (brief.date !== today) {
      const nextBrief = getMockBrief();
      setBrief(nextBrief);
    }
  }, [brief.date, setBrief]);

  return { brief, setBrief };
}

