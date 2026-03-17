import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { MarketProvider } from "@/components/market-provider";
import { ToastProvider, ToastStack } from "@/components/toast-provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoldMate · 黄金监控平台",
  description: "个人投资者的轻量黄金资产管理与提醒工作台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable} font-sans antialiased`}>
        <ToastProvider>
          <MarketProvider>
            <AppShell>{children}</AppShell>
            <ToastStack />
          </MarketProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

