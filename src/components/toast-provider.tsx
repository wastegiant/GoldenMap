"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `toast_${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [{ id, ...toast }, ...prev]);
      setTimeout(() => removeToast(id), 6000);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function ToastStack() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed right-6 top-24 z-50 flex w-[320px] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow-lg backdrop-blur"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-neutral-900">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-xs text-neutral-600">{toast.description}</p>
              ) : null}
            </div>
            <button
              className="text-xs text-neutral-400 transition hover:text-neutral-700"
              onClick={() => removeToast(toast.id)}
            >
              关闭
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

