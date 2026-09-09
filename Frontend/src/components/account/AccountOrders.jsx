import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Package, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../../components/SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load your orders. Please try again.");

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function orderFields(o) {
  const id = pick(o, ["id", "_id", "orderId"]);
  const number = pick(o, ["orderNumber", "number"], id);
  const totalRaw = pick(o, ["total", "totalAmount", "amount"]);
  const total = typeof totalRaw === "number" ? totalRaw : null;
  const currency = pick(o, ["currency", "currencyCode"], "USD");
  const status = pick(o, ["status", "state"], "unknown");
  const date = pick(o, ["createdAt", "placedAt", "date"]);
  const items = Array.isArray(o.items) ? o.items : [];
  return { id, number, total, currency, status, date, items, raw: o };
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
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-amber-200 bg-amber-50 text-amber-700",
  shipped: "border-blue-200 bg-blue-50 text-blue-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
  canceled: "border-red-200 bg-red-50 text-red-700",
};

function StatusPill({ status }) {
  const style = STATUS_STYLES[String(status).toLowerCase()] || "border-black/10 bg-[#f8f8f8] text-black/55";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${style}`}>
      {status}
    </span>
  );
}

export default function AccountOrders() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .orders()
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

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Account" icon={<Package size={12} strokeWidth={2} />} heading="My Orders" />

      {state.loading && <OrdersSkeleton />}

      {!state.loading && state.error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
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
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black/50">
            <ShoppingBag size={18} strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold text-black">No orders yet</p>
          <p className="max-w-md text-sm text-black/55">Orders you place will show up here so you can track them.</p>
          <Link
            to="/shops"
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Start shopping
          </Link>
        </div>
      )}

      {!state.loading && !state.error && list.length > 0 && (
        <div className="flex flex-col gap-3">
          {list.map((o, i) => {
            const isOpen = expanded === (o.id ?? i);
            return (
              <div key={o.id ?? i} className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                <button
                  onClick={() => setExpanded(isOpen ? null : o.id ?? i)}
                  className="flex w-full flex-col gap-3 px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-price text-sm text-black">Order {String(o.number)}</p>
                    <p className="mt-0.5 text-xs text-black/45">{formatDate(o.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill status={o.status} />
                    <p className="font-price text-sm font-medium text-black">{formatMoney(o.total, o.currency)}</p>
                  </div>
                </button>
                {isOpen && o.items.length > 0 && (
                  <div className="border-t border-black/5 bg-[#f8f8f8]/60 px-5 py-4">
                    <ul className="space-y-2">
                      {o.items.map((item, j) => (
                        <li key={j} className="flex items-center justify-between text-sm">
                          <span className="text-black/70">{item.name || item.productName || `Item ${j + 1}`}</span>
                          <span className="font-price text-black/60">
                            {item.quantity ? `×${item.quantity}` : ""}{" "}
                            {typeof item.price === "number" ? formatMoney(item.price, o.currency) : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {isOpen && o.items.length === 0 && (
                  <div className="border-t border-black/5 bg-[#f8f8f8]/60 px-5 py-4 text-sm text-black/45">
                    No line item detail available for this order.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-2xl border border-black/8 bg-white px-5 py-4">
          <div className="space-y-2">
            <div className="h-3.5 w-28 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-20 animate-pulse rounded bg-black/10" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-black/10" />
        </div>
      ))}
    </div>
  );
}
