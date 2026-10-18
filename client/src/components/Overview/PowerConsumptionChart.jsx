
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap, TrendingUp } from "lucide-react";

const ranges = [
  { label: "Live", value: "live" },
  { label: "24 Hours", value: "24h" },
  { label: "1 Day", value: "1d" },
  { label: "2 Days", value: "2d" },
  { label: "3 Days", value: "3d" },
];

const chartData = {
  live: [
    { time: "10:00", power: 850 },
    { time: "10:05", power: 920 },
    { time: "10:10", power: 780 },
    { time: "10:15", power: 1250 },
    { time: "10:20", power: 1100 },
    { time: "10:25", power: 1480 },
    { time: "10:30", power: 1320 },
    { time: "10:35", power: 1852 },
    { time: "10:45", power: 1152 },
  ],
  "24h": [
    { time: "12 AM", power: 320 },
    { time: "4 AM", power: 250 },
    { time: "8 AM", power: 900 },
    { time: "10 AM", power: 1450 },
    { time: "12 PM", power: 1852 },
    { time: "2 PM", power: 1600 },
    { time: "4 PM", power: 1200 },
    { time: "6 PM", power: 1750 },
    { time: "8 PM", power: 2100 },
    { time: "10 PM", power: 950 },
  ],
  "1d": [
    { time: "12 AM", power: 320 },
    { time: "4 AM", power: 250 },
    { time: "8 AM", power: 900 },
    { time: "12 PM", power: 1852 },
    { time: "4 PM", power: 1200 },
    { time: "8 PM", power: 2100 },
    { time: "11 PM", power: 600 },
  ],
  "2d": [
    { time: "Day 1 AM", power: 300 },
    { time: "Day 1 PM", power: 1800 },
    { time: "Day 1 Eve", power: 2100 },
    { time: "Day 2 AM", power: 280 },
    { time: "Day 2 PM", power: 1600 },
    { time: "Day 2 Eve", power: 1900 },
  ],
  "3d": [
    { time: "Day 1", power: 1850 },
    { time: "Day 1 Eve", power: 2100 },
    { time: "Day 2", power: 1400 },
    { time: "Day 2 Eve", power: 1950 },
    { time: "Day 3", power: 1600 },
    { time: "Day 3 Eve", power: 2200 },
  ],
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="font-bold text-gray-900 dark:text-white">
        {payload[0].value.toLocaleString()} W
      </p>
    </div>
  );
}

export default function PowerConsumptionChart() {
  const [activeRange, setActiveRange] = useState("live");

  const data = chartData[activeRange];

  const currentPower = data[data.length - 1].power;
  const averagePower = Math.round(
    data.reduce((sum, point) => sum + point.power, 0) /
      data.length
  );

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 ">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-500/10">
              <Zap size={19} className="text-emerald-600" />
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Power Consumption
            </h2>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Monitor your household energy usage over time.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => setActiveRange(range.value)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                activeRange === range.value
                  ? "bg-white text-emerald-700 shadow-sm dark:bg-gray-700 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            {activeRange === "live"
              ? "Latest power draw"
              : "Latest recorded power"}
          </p>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {currentPower.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-gray-500">
              W
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">Sample average</p>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-sm font-semibold text-emerald-600">
            <TrendingUp size={16} />
            {averagePower.toLocaleString()} W
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-30 w-full sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="powerGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#10b981"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="#10b981"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#9ca3af"
              strokeOpacity={0.2}
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              dy={10}
              minTickGap={20}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(value) => `${value}`}
              width={48}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "#10b981",
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="power"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#powerGradient)"
              activeDot={{
                r: 5,
                fill: "#10b981",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              animationDuration={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {activeRange === "live"
            ? "Live monitoring preview"
            : "Historical usage preview"}
        </div>

        <span>Power measured in watts (W)</span>
      </div>
    </section>
  );
}
