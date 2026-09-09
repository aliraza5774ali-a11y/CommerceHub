import { useEffect, useState } from "react";

const ITEMS = [
  { name: "Textured Knitted Shirt", sku: "TKS-001", stock: [1284, 1279], value: "$8,412" },
  { name: "Minimal Utility Jacket", sku: "MUJ-014", stock: [12, 12], value: "$1,188", low: true },
  { name: "Cotton Everyday Tee", sku: "CET-006", stock: [96, 96], value: "$3,744" },
  { name: "Essential Cargo Trouser", sku: "ECT-009", stock: [0, 0], value: "$0", low: true },
];

const DemoInventory = ({ isActive, reduceMotion }) => {
  const [flip, setFlip] = useState(0);

  useEffect(() => {
    if (!isActive || reduceMotion) return;
    const id = setTimeout(() => setFlip(1), 1300);
    return () => clearTimeout(id);
  }, [isActive, reduceMotion]);

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">Stock</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-black">Inventory</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {ITEMS.map((item) => (
          <div
            key={item.sku}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-2.5 shadow-sm"
          >
            <div className="min-w-0">
              <p className="truncate text-[11.5px] font-medium text-black/85">{item.name}</p>
              <p className="font-mono text-[9.5px] text-black/35">{item.sku}</p>
            </div>
            <span className="font-price text-[11px] tabular-nums text-black/60">
              {item.stock[flip]}
              {item.low && (
                <span className="ml-1.5 rounded-full bg-red-500/10 px-1.5 py-0.5 text-[8.5px] font-medium text-red-700">
                  Low
                </span>
              )}
            </span>
            <span className="font-price text-[11px] tabular-nums text-black/40">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoInventory;