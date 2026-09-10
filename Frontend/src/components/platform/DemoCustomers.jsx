const CUSTOMERS = [
  { name: "Ayesha Rehman", orders: 12, spent: "$1,204", status: "VIP" },
  { name: "Sana Malik", orders: 4, spent: "$389", status: "Active" },
  { name: "Hassan Iqbal", orders: 7, spent: "$742", status: "Active" },
  { name: "Noor Farooq", orders: 1, spent: "$89", status: "New" },
];

const badgeColor = (status) =>
  status === "VIP"
    ? "bg-accent/15 text-accent"
    : status === "New"
    ? "bg-black/[0.05] text-black/45"
    : "bg-emerald-500/10 text-emerald-700";

const DemoCustomers = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">People</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-black">Customers</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {CUSTOMERS.map((c, i) => (
          <div
            key={c.name}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-2.5 shadow-sm transition-all duration-500"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-[9px] font-semibold text-black">
              {c.name.charAt(0)}
            </span>
            <span className="truncate text-[11.5px] font-medium text-black/85">{c.name}</span>
            <span className="font-price text-[10.5px] tabular-nums text-black/40">{c.orders} orders</span>
            <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium ${badgeColor(c.status)}`}>
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoCustomers;