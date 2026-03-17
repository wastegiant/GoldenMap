"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { MarketSeriesPoint } from "@/lib/types";
import { formatRmb } from "@/lib/utils";

export function PriceChart({ data }: { data: MarketSeriesPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9e1d2" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#b1966c" />
          <YAxis
            tick={{ fontSize: 11 }}
            width={60}
            stroke="#b1966c"
            domain={["dataMin - 2", "dataMax + 2"]}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            formatter={(value) => formatRmb(Number(value))}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ borderRadius: 12, borderColor: "#efe1c7" }}
          />
          <Line
            type="monotone"
            dataKey="priceRmbPerG"
            stroke="#c58c2d"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

