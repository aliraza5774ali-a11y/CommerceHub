import { useEffect, useState } from "react";

const REVENUE_TICKS = ["$42,231", "$43,120", "$44,231"];
const ORDER_TICKS = [182, 184, 187];
const BARS = [38, 52, 44, 61, 55, 70, 64, 82];

const DemoDashboard = ({ isActive, reduceMotion }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isActive || reduceMotion) return;
    const id = setInterval(() => setTick((t) => (t + 1) % REVENUE_TICKS.length), 900);
    return () => clearInterval(id);
  }, [isActive, reduceMotion]);

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">
          Overview
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-black">Dashboard</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-black/8 bg-white p-3.5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-black/40">Revenue</p>
          <p className="mt-1.5 font-price text-xl font-bold tabular-nums text-black">
            {REVENUE_TICKS[tick]}
          </p>
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-3.5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-black/40">Orders</p>
          <p className="mt-1.5 font-price text-xl font-bold tabular-nums text-black">
            {ORDER_TICKS[tick]}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2 rounded-2xl border border-black/8 bg-white p-4 shadow-sm">
        <p className="text-[10px] uppercase tracking-wider text-black/40">Revenue trend</p>
        <div className="flex flex-1 items-end gap-1.5">
          {BARS.map((h, i) => (
            <div key={i} className="flex-1 overflow-hidden rounded-sm bg-black/[0.05]">
              <div
                className="w-full rounded-sm bg-gradient-to-t from-accent/50 to-accent transition-[height] duration-[1200ms] ease-out"
                style={{ height: isActive ? `${h}%` : "0%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoDashboard;