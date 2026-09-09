const BARS = [30, 45, 38, 58, 50, 68, 74, 90];
const TOP_PRODUCTS = ["Textured Knitted Shirt", "Minimal Utility Jacket", "Cotton Everyday Tee"];

const DemoAnalytics = ({ isActive }) => {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">Insights</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-black">Analytics</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-black/8 bg-white p-3.5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-black/40">Conversion</p>
          <p className="mt-1.5 font-price text-xl font-bold tabular-nums text-black">3.8%</p>
        </div>
        <div className="rounded-2xl border border-black/8 bg-white p-3.5 shadow-sm">
          <p className="text-[10px] uppercase tracking-wider text-black/40">Growth</p>
          <p className="mt-1.5 font-price text-xl font-bold tabular-nums text-emerald-700">+18.4%</p>
        </div>
      </div>

      <div className="flex flex-1 items-end gap-1.5 rounded-2xl border border-black/8 bg-white p-4 shadow-sm">
        {BARS.map((h, i) => (
          <div key={i} className="flex-1 overflow-hidden rounded-sm bg-black/[0.05]">
            <div
              className="w-full rounded-sm bg-gradient-to-t from-[#cfff04]/40 to-[#cfff04] transition-[height] duration-[1400ms] ease-out"
              style={{ height: isActive ? `${h}%` : "0%", transitionDelay: `${i * 60}ms` }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[10px] uppercase tracking-wider text-black/40">Top products</p>
        {TOP_PRODUCTS.map((name) => (
          <p key={name} className="truncate text-[11px] text-black/60">{name}</p>
        ))}
      </div>
    </div>
  );
};

export default DemoAnalytics;