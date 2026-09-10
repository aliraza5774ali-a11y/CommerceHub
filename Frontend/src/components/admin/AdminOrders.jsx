import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Receipt, RefreshCw, Search, X } from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../../components/SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load orders. Please try again.");

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function orderFields(o) {
  const id = pick(o, ["id", "_id", "orderId"]);
  const number = pick(o, ["orderNumber", "number"], id);
  const customer =
    pick(o, ["customerName"]) ||
    [o.customer?.firstName, o.customer?.lastName].filter(Boolean).join(" ") ||
    pick(o, ["customerEmail", "email"]) ||
    "—";
  const totalRaw = pick(o, ["total", "totalAmount", "amount"]);
  const total = typeof totalRaw === "number" ? totalRaw : null;
  const currency = pick(o, ["currency", "currencyCode"], "USD");
  const status = pick(o, ["status", "state"], "unknown");
  const itemCountRaw = pick(o, ["itemCount", "itemsCount"]) ?? (Array.isArray(o.items) ? o.items.length : null);
  const date = pick(o, ["createdAt", "placedAt", "date"]);
  return { id, number, customer, total, currency, status, itemCount: itemCountRaw, date, raw: o };
}

function formatMoney(value, currency = "USD") {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const STATUS_STYLES = {
  fulfilled: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-amber-200 bg-amber-50 text-amber-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  canceled: "border-red-200 bg-red-50 text-red-700",
  refunded: "border-black/15 bg-black/5 text-black/55",
};

function StatusPill({ status }) {
  const style = STATUS_STYLES[String(status).toLowerCase()] || "border-black/10 bg-[#f8f8f8] text-black/55";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${style}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .adminOrders()
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refresh = () => {
    setState((state) => ({ ...state, loading: true, error: null }));
    setRefreshKey((key) => key + 1);
  };

  const list = useMemo(() => {
    const arr = Array.isArray(state.data) ? state.data : Array.isArray(state.data?.items) ? state.data.items : [];
    return arr.map(orderFields);
  }, [state.data]);

  const statuses = useMemo(() => {
    const set = new Set(list.map((o) => String(o.status).toLowerCase()));
    return ["all", ...Array.from(set)];
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((o) => {
      const matchesStatus = statusFilter === "all" || String(o.status).toLowerCase() === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || String(o.number).toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [list, statusFilter, query]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Admin" icon={<Receipt size={12} strokeWidth={2} />} heading="Orders" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order # or customer…"
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
            />
          </div>
          {statuses.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition ${
                    statusFilter === s
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-black/10 bg-white text-black/55 hover:border-black/25 hover:text-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={refresh}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {state.loading && <OrdersSkeleton />}

      {!state.loading && state.error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-700">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={16} />
            </span>
            <p className="font-medium">{state.error}</p>
          </div>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {!state.loading && !state.error && list.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
            <Receipt size={16} strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold text-black">No orders yet</p>
          <p className="max-w-md text-sm text-black/55">Orders placed on your storefront will appear here.</p>
        </div>
      )}

      {!state.loading && !state.error && list.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-sm text-black/55">
          No orders match your filters.
        </div>
      )}

      {!state.loading && !state.error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-[#f8f8f8] font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <tr
                    key={o.id ?? i}
                    onClick={() => setSelected(o)}
                    className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-[#f8f8f8]/60"
                  >
                    <td className="px-5 py-3.5 font-price text-black/85">{String(o.number)}</td>
                    <td className="px-5 py-3.5 text-black/70">{o.customer}</td>
                    <td className="px-5 py-3.5 text-black/60">{o.itemCount ?? "—"}</td>
                    <td className="px-5 py-3.5 font-price text-black/85">{formatMoney(o.total, o.currency)}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-black/50">{formatDate(o.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function OrderDrawer({ order, onClose }) {
  const items = Array.isArray(order.raw?.items) ? order.raw.items : [];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
              <Receipt size={15} strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/40">Order</p>
              <h3 className="font-display text-xl font-semibold text-black">{String(order.number)}</h3>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-black/40 hover:bg-black/5 hover:text-black">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <StatusPill status={order.status} />
            <p className="font-price text-lg font-medium text-black">{formatMoney(order.total, order.currency)}</p>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-black/45">Customer</dt>
              <dd className="text-black/80">{order.customer}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black/45">Placed</dt>
              <dd className="text-black/80">{formatDate(order.date)}</dd>
            </div>
            {order.itemCount !== null && order.itemCount !== undefined && (
              <div className="flex justify-between">
                <dt className="text-black/45">Items</dt>
                <dd className="text-black/80">{order.itemCount}</dd>
              </div>
            )}
          </dl>

          {items.length > 0 && (
            <div className="mt-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-black/40">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Line items
              </p>
              <ul className="mt-3 space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between rounded-xl bg-[#f8f8f8] px-4 py-3 text-sm">
                    <span className="text-black/75">{item.name || item.productName || `Item ${i + 1}`}</span>
                    <span className="font-price text-black/70">
                      {item.quantity ? `×${item.quantity}` : ""} {typeof item.price === "number" ? formatMoney(item.price, order.currency) : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-6 text-xs text-black/35">
            Order status changes aren't available yet — this view is read-only until a fulfillment endpoint is added.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-black/5 px-5 py-4 last:border-0">
          <div className="h-4 w-20 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-black/10" />
          <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-black/10" />
        </div>
      ))}
    </div>
  );
}