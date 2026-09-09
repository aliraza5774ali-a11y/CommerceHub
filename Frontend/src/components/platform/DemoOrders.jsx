import { useEffect, useState } from "react";

const ORDERS = [
  { id: "#3021", customer: "A. Rehman", total: "$129.00", payment: "Paid" },
  { id: "#3020", customer: "S. Malik", total: "$59.00", payment: "Paid" },
  { id: "#3019", customer: "H. Iqbal", total: "$214.00", payment: "Pending" },
  { id: "#3018", customer: "N. Farooq", total: "$89.00", payment: "Paid" },
];

const DemoOrders = ({ isActive, reduceMotion }) => {
  const [shipped, setShipped] = useState(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    if (reduceMotion) return;
    const id = setTimeout(() => setShipped(true), 1400);
    return () => clearTimeout(id);
  }, [isActive, reduceMotion]);

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">Fulfillment</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-black">Orders</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {ORDERS.map((o, i) => (
          <div
            key={o.id}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-2.5 shadow-sm"
          >
            <span className="font-price text-[10px] text-black/40">{o.id}</span>
            <span className="truncate text-[11.5px] font-medium text-black/85">{o.customer}</span>
            <span className="font-price text-[11px] tabular-nums text-black/60">{o.total}</span>
            {i === 0 ? (
              <span
                className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium transition-colors duration-500 ${
                  isActive && shipped ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"
                }`}
              >
                {isActive && shipped ? "Shipped" : "Processing"}
              </span>
            ) : (
              <span className="whitespace-nowrap rounded-full bg-black/[0.05] px-2 py-0.5 text-[9px] font-medium text-black/45">
                {o.payment}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoOrders;