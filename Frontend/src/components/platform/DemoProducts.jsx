const PRODUCTS = [
  { name: "Textured Knitted Shirt", price: "$59.00", stock: 48, status: "Active", category: "Apparel" },
  { name: "Minimal Utility Jacket", price: "$99.00", stock: 12, status: "Active", category: "Apparel" },
  { name: "Essential Cargo Trouser", price: "$89.00", stock: 0, status: "Out of stock", category: "Apparel" },
  { name: "Cotton Everyday Tee", price: "$39.00", stock: 96, status: "Active", category: "Apparel" },
];

const statusColor = (status) =>
  status === "Active" ? "bg-emerald-500/10 text-emerald-700" : "bg-black/[0.05] text-black/45";

const DemoProducts = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">Catalog</p>
        <h3 className="mt-1 font-display text-lg font-semibold text-black">Products</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {PRODUCTS.map((p, i) => (
          <div
            key={p.name}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border border-black/8 bg-white px-3 py-2.5 shadow-sm transition-all duration-500"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-7 w-7 shrink-0 rounded-md bg-black/[0.05]" />
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium text-black/85">{p.name}</p>
                <p className="text-[10px] text-black/35">{p.category}</p>
              </div>
            </div>
            <span className="font-price text-[11px] tabular-nums text-black/60">{p.price}</span>
            <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium ${statusColor(p.status)}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoProducts;